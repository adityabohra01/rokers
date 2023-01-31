// create express server with modular js
import express from 'express';
import bodyParser from 'body-parser';
import { connection, insert, query } from './server/database/index.js';
import { config } from "dotenv"
import spotify from './server/spotify/index.js';
import queue from './server/components/queue/index.js';
import featuredArtist from './server/components/featuredArtist/index.js';
import { exec } from "child_process"
import { set } from 'firebase/database';

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

app.post('/play', async (req, res) => {
    try {
        console.log("trying to play song")
        const id = await queue.play(req.body.track)
        res.json({id})
    } catch (error) {
        res.json({error})
        throw error
    }

})

app.get("/playAlbum/:albumID", async (req, res) => {
    try {
        const songs = await query(`SELECT * FROM songs WHERE albumID = '${req.params.albumID}';`)
        queue.clearQueue()
        songs.forEach(async song => {
            await queue.play({id: song.sid})
        })
        res.json({songs})

    } catch (error) {
        res.json({error})
        throw error
    }
})

app.get("/playArtist/:artistID", async (req, res) => {
    try {
        const songs = await query(`SELECT * FROM songs join songArtists on songs.sid = songArtists.sid WHERE songArtists.artistID = '${req.params.artistID}';`)
        queue.clearQueue()
        songs.forEach(async song => {
            await queue.play({id: song.sid})
        })
        res.json({songs})

    } catch (error) {
        res.json({error})
        throw error
    }
})

// return array of albums on GET request
app.get('/albums', async (req, res) => {
    // get albums from database, find songs in each album and their artists
    let albums = await query("SELECT * FROM albums order by favourite desc")
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
    // search for song in spotify
    spotify.searchSong({
        query : req.params.query,
        limit : req.query.limit || 10,
        offset : req.query.offset || 0,
        type : 'track',
    }).then(data => {
        res.json(data)
    }).catch(err => {
        res.json(err)
    })
    
})

// get featured artist name and album art
app.get('/featuredArtist', featuredArtist)

app.get("/featuredArtistSongs/:id", async (req, res) => {
    // get song details from artistID
    try {
        const artistID = req.params.id
        console.log(artistID)
        connection.query(`select * from songs join songArtists on songs.sid = songArtists.sid where songArtists.artistID = '${artistID}';`, (err, result) => {
            if (err) throw err
            console.log(result)
            res.json(result)
        })
        
    } catch (error) {
        res.json(error)
    }
})

app.get("/recentlyPlayed/:limit/:offset", async (req, res) => {
    // get recently played songs by limit and offset

    try {
        const limit = req.params.limit
        const offset = req.params.offset
        console.log(limit, offset)

        const songs = await query(
            `select songs.sid, songs.vid, songs.name, songs.albumID, songs.lastPlayed, songs.albumArt, songs.length, songs.playCount, songs.pid, songs.favourite, albums.albumName from songs join albums on songs.albumID = albums.albumID order by lastPlayed desc limit ${limit} offset ${offset};`
        )
        res.json(songs)
    } catch (error) {
        res.json({error})
    }
})

app.get("/favouriteSongs/:limit/:offset", async (req, res) => {
    // get favourite songs by limit and offset

    try {
        const limit = req.params.limit
        const offset = req.params.offset
        console.log(limit, offset)

        const songs = await query(`select * from songs join albums on songs.albumID = albums.albumID where favourite = true order by lastPlayed desc limit ${limit} offset ${offset};`)
        res.json(songs)
    } catch (error) {
        res.json({error})
    }
})

app.get("/toggleFavourite/:sid", async (req, res) => {
    // set favourite song by id

    try {
        const songs = await query(`update songs set favourite = !favourite where sid = '${req.params.sid}';`)
        res.json({sid: req.params.sid})
    } catch (error) {
        res.json({error})
    }
})

app.get("/command/:c", async (req, res) => {
    let command, value
    if (req.params.c.includes('-'))
        [command, value] = req.params.c.split('-')
    else [command, value] = [req.params.c, null]
    switch (command) {
        case "play":
            queue.vlc.toggle_play()
            break
        case "pause":
            queue.pause()
            break
        case "volume":
            queue.vlc.volume(value)
            break
        case "next":
            queue.next()
            break
        case "prev":
            queue.prev()
            break
        case "repeat":
            queue.vlc.repeat()
            break
        case "stop":
            queue.vlc.stop()
            break
        case "playlistInfo":
            console.log(await queue.vlc.playlist_info())
            break
        default:
            console.log(await queue.vlc[req.params.c]())
            break
    }
    res.json({status : true})
})


    

// listen for requests
app.listen(3000, () => {
     console.log("Server is listening on port 3000")
     // run ngrok
     const ngrok = exec("ngrok http 3000")
     ngrok.stdout.on("data", data => {
         console.log(data)
     })
     const interval = setInterval(() => {
         if (ngrok.pid) {
             fetch("http://127.0.0.1:4040/api/tunnels", {
                 method: "GET",
                 headers: {
                     "Content-Type": "application/json",
                 },
             })
                 .then(res => res.json())
                 .then(data => {
                     console.log(data.tunnels[0].public_url)
                     const body = new FormData()
                     body.append("url", data.tunnels[0].public_url)
                     console.log(body)
                     fetch("https://rokerss.000webhostapp.com/", {
                         method: "POST",
                         body,
                     })
                        .then(res => res.text())
                        .then(data => {
                            console.log(data)
                            clearInterval(interval)
                        })
                        .catch(err => {
                            console.log(err)
                        })
                 })
                 .catch(err => {
                     console.log(err)
                 })
         }
     }, 2000)

});