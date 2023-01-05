// create express server with modular js
import express from 'express';
import bodyParser from 'body-parser';
import { connection, insert, query } from './server/database/index.js';
import { config } from "dotenv"
import spotify from './server/spotify/index.js';
import queue from './server/components/queue/index.js';
import featuredArtist from './server/components/featuredArtist/index.js';

config()
// create express app
const app = express();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// parse requests of content-type - application/json
app.use(bodyParser.json())
// enable cors
app.use((req, res, next) => {
    res.header("Access-Control-Max-Age", "86400")
    res.header("Access-Control-Allow-Origin", req.headers.origin) // restrict it to the required domain
    // res.header("Access-Control-Allow-Origin", origins) // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Methods", "GET,POST")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    res.header("Access-Control-Allow-Credentials", "true")
    next()
})
// serve static files from /dist
app.use(express.static('dist'))

// define a simple route
app.get('/',async (req, res) => {
    const result = await insert('songs', {
        sid : '123',
        title : 'test',
        albumID : 1,
        lastPlayed : new Date(),
        albumArt : 'test'.toString('base64'),
        length : 123,
        playCount : 1,
        // pid : 1,
        favourite : true
    });
    res.json({"result": result});
})

app.post('/play', async (req, res) => {
    try {
        // inxert song into database
        // get youtube id
        const track = req.body.track

        // query from songs table to see if song exists
        // if it does, update playCount
        // if it doesn't, insert into songs table
        let id
        const song = await query(`SELECT * FROM songs WHERE sid = '${track.id}'`)
        console.log(song)
        if (song.length > 0) {
            // update playCount in songs table, update lastPlayed 
            await query(`UPDATE songs SET playCount = playCount + 1 WHERE sid = '${track.id}'`)
        } else {
            id = await spotify.getSongYoutube(track)
            console.log(id)
            await insert('songs', {  
                sid : req.body.track.id,
                vid : id,
                name : req.body.track.name,
                albumID : req.body.track.album.id,
                lastPlayed : new Date(),
                albumArt : req.body.track.album.images[0].url,
                length : req.body.track.duration_ms,
                playCount : 1,
                // pid : 1,
                favourite : false
            });
            // Populate artists table
            req.body.track.artists.forEach(async artist => {
                // query from artists table to see if artist exists
                // if it does, update songCount
                // if it doesn't, insert into artists table
                const artistQuery = await query(`SELECT * FROM artists WHERE artistID = '${artist.id}'`)
                if (artistQuery.length > 0) {
                    await query(`UPDATE artists SET songCount = songCount + 1 WHERE artistID = '${artist.id}'`)
                } else {
                    await insert("artists", {
                        artistID: artist.id,
                        artistName: artist.name,
                        songCount: 1,
                        favourite: false,
                    })
                }
                await insert('songArtists', {
                    sid : req.body.track.id,
                    artistID : artist.id
                })
            })
            // Populate albums table    
            // query from albums table to see if album exists
            // if it does, update songCount
            // if it doesn't, insert into albums table
            const album = await query(`SELECT * FROM albums WHERE albumID = '${req.body.track.album.id}'`)
            if (album.length > 0) {
                await query(`UPDATE albums SET songCount = songCount + 1 WHERE albumID = '${req.body.track.album.id}'`)
            } else {
                await insert("albums", {
                    albumID: req.body.track.album.id,
                    albumName: req.body.track.album.name,
                    albumImage: req.body.track.album.images[0].url,
                    songCount: 1,
                    favourite: false,
                })
            }
        }
        console.log(song.length)
        const buffer = await spotify.getSongYoutubeBuffer((song.length > 0) ? song[0].vid : id)
        queue.addSong(buffer)
        res.json({id})
    } catch (error) {
        throw error
    }

})
function a(s) {
    console.log(s)
}
// return array of albums on GET request
app.get('/albums', async (req, res) => {
    // get albums from database, find songs in each album and their artists
    let albums = await query("SELECT * FROM albums order by favourite desc")
    // let artists_ = []
    // albums.forEach(async (album, index) => {
    //     album.songs = await query(`SELECT * FROM songs WHERE albumID = '${album.albumID}'`)
    //     album.songs.forEach(async (song) => {
    //         song.artists = await query(`SELECT * FROM songArtists WHERE sid = '${song.sid}'`)
    //         song.artists.forEach(async artist => {
    //             artist.artist = await query(`SELECT * FROM artists WHERE artistID = '${artist.artistID}'`)
    //             artists_.push(artist.artist[0].artistName)
    //             // console.log(artist.artist[0])
    //             a(artist.artist[0].artistName)
    //         })
    //     })
    //     console.log(artists_)
    //     albums[index].artists = artists_
    // })
    
    // console.log(albums)
    res.json(albums)
})

// route to display all songs in html table
app.get('/songs', (req, res) => {
    connection.query("SELECT * FROM songs inner join albums on songs.albumID = albums.albumID;", (err, result) => {
        if (err) throw err
        // create html table with data
        let html = "<table border=1|1>"
        html += "<tr>"
        for (let key in result[0]) {
            html += `<th>${key}</th>`
        }
        html += "</tr>"
        result.forEach(row => {
            html += "<tr>"
            for (let key in row) {
                html += `<td>${row[key]}</td>`
            }
            html += "</tr>"
        })
        html += "</table>"
        res.send(html)
    })
})

// get song by id
app.get('/search/:query', (req, res) => {
    spotify.searchSong({
        query : req.params.query,
        limit : 10,
        offset : 0,
        type : 'track',
    }).then(data => {
        res.json(data)
    }).catch(err => {
        res.json(err)
    })
    
    // connection.query(`SELECT * FROM songs WHERE sid = '${req.params.id}'`, (err, result) => {
    //     if (err) throw err;
    //     res.json(result);
    // });
})

// get featured artist name and album art
app.get('/featuredArtist', featuredArtist)

// listen for requests
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});