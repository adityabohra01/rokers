import Player from "vlc-remote"
import { initializeApp } from "firebase/app"
import { ref, getDatabase, update, set } from "firebase/database"
import spotify from "../../spotify/index.js"
import { query, insert } from "../../database/index.js"

const firebaseConfig = {
    apiKey: "AIzaSyA1_F1pROIduw6oLTxIUpyypPS3iciASk4",
    authDomain: "rokers-88dad.firebaseapp.com",
    projectId: "rokers-88dad",
    storageBucket: "rokers-88dad.appspot.com",
    messagingSenderId: "472240287143",
    appId: "1:472240287143:web:edf03ee0c37093d27a5a82",
    databaseURL: "https://rokers-88dad-default-rtdb.asia-southeast1.firebasedatabase.app",
}
const app = initializeApp(firebaseConfig)
const db = getDatabase(app)

class PlaybackQueue {
    constructor() {
        this.vlc = new Player({ port: 8088, host: "127.0.0.1" })
        this.queue = new Array()
        this.nextPressed = false
        this.prevPressed = false
        this.songIndex = -1
        this.db = db
        this.playing = false
        this.ref = ref(this.db, "player")
        this.vlc.start().then(() => {
            console.log("VLC Started")
            update(this.ref, {
                online: true,
                playing: false,
            })

            this.vlc.on("error", error => {
                update(this.ref, {
                    online: false,
                    playing: false,
                })
                console.log(error)
            })

            this.vlc.on("state", state => {
                console.log("state------------------", state)
            })

            this.vlc.on("play", path => {
                // add to realtime database using firebase-admin
                if (!this.nextPressed) {
                    if (!this.prevPressed) this.songIndex++
                    this.prevPressed = false

                    if (this.songIndex >= this.queue.length) {
                        this.songIndex = 0
                    }
                }
                set(this.ref, {
                    playing: true,
                    online: true,
                    added: Date.now(),
                    song: this.queue[this.songIndex],
                })
                this.playing = true
                console.log("Playing--------------------")
                this.nextPressed = false
            })
        })
    }

    async addToQueue(url, track) {
        if (!Object.hasOwnProperty.call(track, "duration_ms")) {
            track = (await spotify.spotifyApi.getTrack(track.id)).body
        }
        track.download = url
        this.queue.push(track)
        console.log("added to queue", this.queue.length)
        await this.vlc.enqueue(url)
        await this.vlc.toggle_play()
    }

    pause() {
        this.playing = !this.playing
        update(this.ref, {
            playing: this.playing,
            online: true,
        })
        this.vlc.pause()
    }

    next() {
        this.nextPressed = true
        this.songIndex++
        if (this.songIndex >= this.queue.length) {
            this.songIndex = 0
        }
        this.vlc.next()
    }

    prev() {
        this.prevPressed = true
        this.songIndex--
        if (this.songIndex < 0) {
            this.songIndex = this.queue.length - 1
        }
        this.vlc.prev()
    }

    /**
     *
     * @param {{iString}} track track Object containing id of sspotify track
     *
     * @returns { Promise }
     */
    play(track) {
        return new Promise(async (resolve, reject) => {
            try {
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
                    await insert("songs", {
                        sid: track.id,
                        vid: id,
                        name: track.name,
                        albumID: track.album.id,
                        lastPlayed: new Date(),
                        albumArt: track.album.images[0].url,
                        length: track.duration_ms,
                        playCount: 1,
                        // pid : 1,
                        favourite: false,
                    })
                    // Populate artists table
                    track.artists.forEach(async artist => {
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
                        await insert("songArtists", {
                            sid: track.id,
                            artistID: artist.id,
                        })
                    })
                    // Populate albums table
                    // query from albums table to see if album exists
                    // if it does, update songCount
                    // if it doesn't, insert into albums table
                    const album = await query(`SELECT * FROM albums WHERE albumID = '${track.album.id}'`)
                    if (album.length > 0) {
                        await query(`UPDATE albums SET songCount = songCount + 1 WHERE albumID = '${track.album.id}'`)
                    } else {
                        await insert("albums", {
                            albumID: track.album.id,
                            albumName: track.album.name,
                            albumImage: track.album.images[0].url,
                            songCount: 1,
                            favourite: false,
                        })
                    }
                }
                const buffer = await spotify.getSongYoutubeBuffer(song.length > 0 ? song[0].vid : id)
                console.log(buffer)

                await this.addToQueue(buffer, track)
                resolve(id)
            } catch (error) {
                reject(error)
            }
        })
    }

    clearQueue() {
        this.vlc.clear_playlist()
        this.queue = []
        this.songIndex = -1
    }
}

export default new PlaybackQueue()
