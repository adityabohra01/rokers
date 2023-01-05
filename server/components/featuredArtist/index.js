import albumArt from "album-art"
import { connection, query } from "../../database/index.js"

export default async (req, res) => {
    try {
        // Query songs table to see if song exists
        const result = await query("select artistName, artists.artistID, songCount, artistImage, artists.favourite, count(*) as playCount from artists join songArtists on artists.artistID = songArtists.artistID join songs on songArtists.sid = songs.sid group by artists.artistID order by playCount desc limit 1;")
        // if song exists
        if (result.length > 0) {
            // if no album art, get album art
            if (!result[0].artistImage) {
                result[0].artistImage = await albumArt(result[0].artistName, { size: "large" })
                // update song with album art
                await query(`update artists set artistImage = '${result[0].artistImage}' where artistID = '${result[0].artistID}'`)
            }
            // return song
            res.json(result[0])
        } else {
            // if song doesn't exist, return error
            res.json({error: "No songs found"})
        }
        console.log(result)
    } catch (error) {
        console.log(error)
    }
}
