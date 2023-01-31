import React, { useEffect } from "react";
import weekend from "../../assets/weekend.avif"
import bring from "../bring";
import "./index.css";

export default function FeaturedArtist() {
    const [open, setOpen] = React.useState(false)
    const [artist, setArtist] = React.useState({
        artistName: "The Weeknd",
        featured: true,
        artistImage: weekend,
    })
    const [songs, setSongs] = React.useState([])

    useEffect(() => {
        // fetch artist
        bring({path: "featuredArtist"})
        .then((data) => data.json())
        .then((artist) => {
            setArtist(artist)
            console.log(artist)
        })
    }, [])

    function getSongs() {
        // fetch songs
        bring({ path: "featuredArtistSongs/" + artist.artistID })
            .then(data => data.json())
            .then(songs => {
                setSongs(songs)
                console.log(songs)
            })
            .catch(err => console.error(err))
    }
    return (
        <>
            {!open ? (
                <article
                    className="featuredArtist"
                    style={{ backgroundImage: `url(${artist.artistImage})` }}
                    onClick={() => {
                        getSongs()
                        setOpen(!open)
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: 12,
                            // width: "calc(100% - 16px)",
                            width: "100%",
                            margin: "16px 0",
                            // borderRadius: 16,
                            // margin: 6,
                            color: "var(--ic)",
                            backdropFilter: "blur(6px) brightness(0.8)",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                alignItems: "baseline",
                                marginLeft: 16,
                            }}
                        >
                            <span
                                className="elipsis"
                                style={{
                                    fontSize: 24,
                                    fontWeight: "bold",
                                    color: "var(--lt)",
                                    lineClamp: 1,
                                    WebkitLineClamp: 1,
                                }}
                            >
                                {artist.artistName}
                            </span>
                            <span
                                style={{
                                    fontSize: 16,
                                    fontWeight: "bold",
                                    color: "var(--st)",
                                }}
                            >
                                Featured Artist
                            </span>
                        </div>
                        <div
                            style={{
                                display: "flex",
                            }}
                        >
                            <div
                                className="playArrow"
                                style={{
                                    height: "48px",
                                    width: "48px",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    backgroundColor: "var(--container)",
                                    borderRadius: 16,
                                    marginRight: 8,
                                }}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    bring({
                                        path: "playArtist/" + artist.artistID,
                                        options: {
                                            method: "GET",
                                        }
                                    })
                                }}
                            >
                                <span className="material-icons-outlined" style={{ fontSize: 32 }}>
                                    play_arrow
                                </span>
                            </div>
                            <div
                                className="playArrow"
                                style={{
                                    height: "48px",
                                    width: "48px",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    backgroundColor: "var(--container)",
                                    borderRadius: 16,
                                }}
                            >
                                <span className="material-icons-outlined" style={{ fontSize: 32 }}>
                                    more_vert
                                </span>
                            </div>
                        </div>
                    </div>
                    <img className="artistReflection" src={artist.artistImage} />
                </article>
            ) : (
                <div className="expand">
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: 12,
                            width: "100%",
                            color: "var(--pt)",
                        }}
                    >
                        <div className="artistsHeader">
                            <span
                                className="elipsis"
                                style={{
                                    fontSize: 24,
                                    fontWeight: "bold",
                                    lineClamp: 1,
                                    WebkitLineClamp: 1,
                                }}
                            >
                                {artist.artistName}
                            </span>
                            <span className="material-icons" onClick={() => setOpen(false)}>
                                close
                            </span>
                        </div>
                        <br></br>

                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-around",
                                alignItems: "center",
                                width: "100%",
                                flexWrap: "wrap",
                                overflowY: "scroll",
                                whiteSpace: "pre-line",
                                height: "calc(100% - 64px)",
                            }}
                        >
                            {songs.map((album, index) =>
                                !open && index > 1 ? null : (
                                    <article key={album.sid} className="albums" style={{ backgroundImage: `url(${album.albumArt})` }}>
                                        <div className="albumControlWrapper">
                                            <div className="albumNameAndArtist">
                                                <span>{album.name}</span>
                                                {/* <span>{album.artist}</span> */}
                                            </div>
                                            <div className="playArrow" onClick={() => {
                                                bring({
                                                    path: "play",
                                                    options: {
                                                        method: "POST",
                                                        headers: {
                                                            "Content-Type": "application/json",
                                                        },
                                                        body: JSON.stringify({
                                                            track: {
                                                                id: album.sid,
                                                            }
                                                        }),
                                                    }
                                                })
                                            }}>
                                                <span className="material-icons-outlined">play_arrow</span>
                                            </div>
                                        </div>
                                        <img className="albumReflection" src={album.albumArt} />
                                    </article>
                                )
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}