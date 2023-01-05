import fs from 'fs';
import { config } from 'dotenv';
import SpotifyToYoutube from "spotify-to-youtube"
import SpotifyWebApi from "spotify-web-api-node"
import ytdl from 'ytdl-core';

config();

class Spotify {
    constructor(clientID, clientSecret) {
        this.clientID = clientID
        this.clientSecret = clientSecret
        // check if token file exists and read it
        if (fs.existsSync('./token.json')) {
            this.token = JSON.parse(fs.readFileSync('./token.json', 'utf8'))
            console.log("Token loaded", this.token)
            if (this.token.expires_at < Date.now())
                (async () => await this.refreshToken())()
            }
            else (async () => await this.refreshToken())()

        this.spotifyApi = new SpotifyWebApi()
        this.spotifyApi.setAccessToken(this.token.access_token)
        this.spotifyToYoutube = SpotifyToYoutube(this.spotifyApi)
    }

    async refreshToken() {
        return new Promise((resolve, reject) => {
            // get new token
            fetch("https://accounts.spotify.com/api/token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": "Basic " + Buffer.from(this.clientID + ":" + this.clientSecret).toString("base64"),
                },
                body: "grant_type=client_credentials",
            })
                .then(res => res.json())
                .then(data => {
                    data.expires_at = Date.now() + data.expires_in * 1000
                    this.token = data
                    fs.writeFileSync("./token.json", JSON.stringify(data))
                    console.log("Token refreshed", this.token)
                    resolve(data)
                })
                .catch(err => {
                    console.log(err)
                    reject(err)
                })
        })
    }

    getSong(id) {
        return new Promise(async (resolve, reject) => {
            if (this.token.expires_at < Date.now())
            await this.refreshToken()
            this.spotifyApi.getTrack(id)
                .then(data => {
                    console.log(data)
                    resolve(data)
                })
                .catch(err => {
                    console.log(err)
                    reject(err)
                })
        })
    }

    /**
     * 
     * @param {*} id  
     * @returns String youtube id
     */
    getSongYoutube(id) {
        return new Promise((resolve, reject) => {
            this.spotifyToYoutube(id)
                .then(data => {

                    // console.log("success",data)
                    resolve(data)
                })
                .catch(err => {
                    console.log("error", err)
                    reject(err)
                })
        })
    }

    getSongYoutubeBuffer(id) {
        return new Promise(async (resolve, reject) => {
            try {
                // get audio buffer from ytdl
                let info = await ytdl.getInfo(id);
                let format = ytdl.chooseFormat(info.formats, { quality: '251' });
                // console.log('Format found!', format.url);
                resolve(format.url)
                // stroe readable stream in a buffer
                // const readable = ytdl.downloadFromInfo(info, { format: format })
                // const chunks = []
                // readable.on('data', (chunk) => {
                //     chunks.push(chunk)
                // })
                // readable.on('end', () => {
                //     const buffer = Buffer.concat(chunks)
                //     resolve(buffer)
                // })
                // readable.on('error', (err) => {
                //     reject(err)
                // })
                
            } catch (error) {
                reject(error)
            }
        })
    }

    /**
     * 
     * @param {string} query
     * @param {string} type
     * @param {number} limit
     * @param {number} offset
     * @returns {Promise}
     * @example
     * search("test", "track", 10, 0)
     * search("test", "track", 10)
     * search("test", "track")
     * 
     * // search for tracks
     * search("test")
     * 
     */
    searchSong({ query, types=['track'],limit = 10, offset = 0, region = "IN" }) {
        return new Promise(async (resolve, reject) => {
            if (this.token.expires_at < Date.now())
                await this.refreshToken()

            this.spotifyApi.searchTracks(query, { limit, offset, market: region })
            // fetch(`https://api.spotify.com/v1/search?q=${query}&type=${types.join(',')}&include_external=audio&limit=${limit}&market=${region}&offset=${offset}`, {
            //     method: "GET",
            //     headers: {
            //         "Content-type": "application/json",
            //         "Authorization": "Bearer " + this.token.access_token,
            //     },
            // })
            //     .then(res => res.json())
                .then(data => resolve(data.body))
                .catch(err => reject(err))
        })
    }
        
}

const spotify = new Spotify(process.env.SPOTIFY_CLIENT_ID, process.env.SPOTIFY_CLIENT_SECRET)
export default spotify