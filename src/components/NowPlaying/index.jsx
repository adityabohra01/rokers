import React, { useContext, useEffect, useState } from "react";
import bring from "../bring"
import { onValue, ref } from "firebase/database";
import db from "../../firebase/database";
import "./index.css"
import Controls from "../Controls";
import { ControlContext } from "../ControlContext";


export default function NowPlaying() {
    const { togglePlay, height, setHeight, player, setPlayer } = useContext(ControlContext)
    const [timer, setTimer] = useState(null)
    const [y, setY] = useState(0)

    useEffect(() => {
        onValue(ref(db, "player"), (snapshot) => {
            setPlayer(snapshot.val())
            clearInterval(timer)
        })
    }, [])

    useEffect(() => {
        try {
            if (timer) clearInterval(timer)
            console.log(player)
            if (!player) { return }
            const added = new Date(player.added)
            const now = new Date()
            const diff = now - added
            if (diff > player.song.duration_ms) {
                if (timer) {
                    clearInterval(timer)
                }
            }
            else {
                const t = setInterval(() => {
                    let progress = 0
                    const now = new Date()
                    const diff = now - added
                    if (diff > player.song.duration_ms) {
                        progress = 100
                        clearInterval(t)
                        if (timer) {
                            clearInterval(timer)
                        }
                    }
                    progress = (diff / player.song.duration_ms) * 100
                    console.log(progress)
                    if (player?.playing) {
                        const playButton = document.querySelector(".RadialProgress")
                        playButton.style.setProperty("--progress", progress + "%")
                    }
                    if (progress >= 100) {
                        clearInterval(t)
                    }
                }, 1000)
    
                setTimer(t)
            }
        } catch (error) {
            console.error(error)
        }

    }, [player])

    return (
        <div
            className="nowPlaying"
            onPointerOver={() => setHeight(160)}
            onPointerLeave={() => setHeight(112)}
            onTouchMove={(e) => {
                if (e.touches[0].clientY < y) {
                    setHeight(160)
                }
                else {
                    setHeight(112)
                }
                console.log(e.touches[0].clientY - y)

            }}
            onTouchStart={(e) => {
                setY(e.touches[0].clientY)
            }}
            style={{
                display: "flex",
                position: "fixed",
                flexDirection: "column",
                padding: "16px",
                alignContent: "center",
                height,
                borderRadius: 16,
                bottom: 24,
                width: "calc(100% - 32px)",
                backgroundColor: "var(--container)",
                zIndex: 98,
                minWidth: "346px",
                maxWidth: "440px",
                overflow: "hidden",
                transition: "height 0.2s ease-in-out",
                // margin: "0 -8px",
            }}
        >
            <div className="searchResult">
                <div className="coverPhoto">
                    <img className="actual" src={player?.song?.album?.images[1].url} alt="AlbumArt" />
                    <img className="reflection" src={player?.song?.album?.images[1].url} alt="AlbumArt" />
                </div>
                <div className="info">
                    <div className="title">
                        <a href={player?.song?.download} target="_blank">
                            {player?.song?.name}
                        </a>
                    </div>
                    <div className="aa">
                        <div className="artist">
                            <a href={player?.song?.album.external_urls.spotify} target="_blank">
                                {player?.song?.album?.name.substr(0, 12)}
                            </a>
                        </div>
                        <div className="album">
                            <a href={player?.song?.artists[0].external_urls.spotify} target="_blank">
                                {player?.song?.artists[0].name}
                            </a>
                        </div>
                    </div>
                </div>
                <div className="playArrow playButton RadialProgress" role="progressbar" aria-valuenow="5" aria-valuemin="0" aria-valuemax="100" onClick={togglePlay}>
                    <span className="material-icons-outlined" style={{ fontSize: 32 }}>
                        { player?.playing ? "pause" : "play_arrow"}
                    </span>
                </div>
            </div>
            <Controls />
        </div>
    )
}