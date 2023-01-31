import React, { useRef } from "react"
import { useState } from "react"
import { useContext } from "react"
import Albums from "./components/Albums"
import bring from "./components/bring"
import { ControlContext } from "./components/ControlContext"
import FeaturedArtist from "./components/FeaturedArtist"
import Navigation from "./components/Navigation"
import NowPlaying from "./components/NowPlaying"
import RecentlyPlayed from "./components/RecentlyPlayed"

function App() {
    const [paused, setPaused] = useState(false)
    const [height, setHeight] = useState(112)
    const [player, setPlayer] = useState(null)
    const volumeRef = useRef(null)

    const states = {
        paused,
        setPaused,
        height,
        setHeight,
        player,
        setPlayer,
        volumeRef,
        togglePlay: function () {
            if (player) {
                bring({
                    path: "command/pause",
                    options: {
                        method: "GET",
                        mode: "cors",
                        cache: "no-cache",
                    },
                })
            }
        },
        changeVolume: function (e) {
            const val = e.target.value
            console.log(val)
            bring({
                path: "command/volume-" + val,
                options: {
                    method: "GET",
                },
            })
        },
        next: function () {
            bring({
                path: "command/next",
                options: {
                    method: "GET",
                },
            })
        },
        prev: function () {
            bring({
                path: "command/prev",
                options: {
                    method: "GET",
                },
            })
        },

        search: function (query) {
            return new Promise((resolve, reject) => {
                bring({
                    path: "search/" + encodeURI(query) + "?limit=1",
                    options: {
                        method: "GET",
                    },
                })
                    .then(res => res.json())
                    .then(res => {
                        resolve(res)
                    })
                    .catch(err => {
                        reject(err)
                    })
            })
        },

        playSong: function (track) {
          return new Promise((resolve, reject) => {
            bring({
                path: "play",
                options: {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ track }),
                },
            })
                .then(data => data.json())
                .then(data => {
                    console.log(data)
                    resolve(data)
                })
                .catch(err => {
                    reject(err)
                })
          })
        },
    }

    return (
        <ControlContext.Provider value={states}>
            <div
                className="root"
                style={{
                    display: "flex",
                    position: "relative",
                    flexDirection: "column",
                    padding: "8px 16px",
                    alignContent: "center",
                    minWidth: "346px",
                    maxWidth: "440px",
                }}
            >
                <Navigation />
                <br></br>
                <FeaturedArtist />
                <Albums />
                <br></br>
                <RecentlyPlayed />
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <NowPlaying />
            </div>
        </ControlContext.Provider>
    )
}

export default App
