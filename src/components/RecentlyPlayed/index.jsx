import React, { useEffect, useState } from "react";
import "./index.css"
import photo from "../../assets/ashiqui.jpg"
import bring from "../bring";

export default function RecentlyPlayed() {
    const [recentlyPlayed, setRecentlyPlayed] = useState([])
    const [limit, setLimit] = useState(4)

    useEffect(() => {
        bring({path: `/recentlyPlayed/${limit}/${0}/`})
        .then((res) => res.json())
        .then((data) => {
            setRecentlyPlayed(data)
        })
        .catch((err) => {
            console.log(err)
        })
    }, [limit])

    function setFavourite (sid, index) {
        bring({
            path: "toggleFavourite/" + sid,
            options: {
                method: "GET",
            },
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    console.error(data.error)
                    return
                }
                console.log(data)
                let temp = [...recentlyPlayed]
                temp[index].favourite = !temp[index].favourite
                setRecentlyPlayed(temp)
            })
            .catch(err => {
                console.error(err)
            })
    }

    function playByVid (sid) {
        bring({
            path: `play`,
            options: {
                method: "POST",
                mode: "cors",
                cache: "no-cache",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    track: {
                        id: sid,
                    }
                })
            }
        })
    }

    return (
        <div
            className="recentlyPlayed"
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                margin: "16px 0 0 0",
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                }}
            >
                <span
                    style={{
                        fontSize: 24,
                        fontWeight: "bold",
                        color: "var(--pt)",
                    }}
                >
                    Recently Played
                </span>
                <span className="seeAll" onClick={() => {
                    setLimit(20)
                }}>See all</span>
            </div>
            <div
                className="recentLists"
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-around",
                    alignItems: "center",
                    width: "100%",
                    flexWrap: "wrap",
                    paddingTop: 16,
                }}
            >
                {recentlyPlayed &&
                    recentlyPlayed.length > 0 &&
                    recentlyPlayed.map((item, index) => {
                        return (
                            <div className="searchResult">
                                <div className="coverPhoto">
                                    <img className="actual" src={item.albumArt} alt="AlbumArt" />
                                    <img className="reflection" src={item.albumArt} alt="AlbumArt" />
                                </div>
                                <div className="info">
                                    <div className="title">{item.name}</div>
                                    <div className="aa">
                                        <div className="album">{item.albumName}</div>
                                    </div>
                                </div>
                                <div
                                    className="playArrow playButton"
                                    style={{
                                        // height: 40,
                                        width: 60,
                                        marginRight: 8,
                                    }}
                                    onClick={() => setFavourite(item.sid, index)}
                                >
                                    <span
                                        className="material-icons-outlined"
                                        style={{
                                            color: item.favourite && "var(--red)",
                                        }}
                                    >
                                        favorite
                                    </span>
                                </div>
                                <div
                                    className="playArrow playButton"
                                    style={{
                                        // height: 40,
                                        width: 60,
                                    }}
                                    onClick={() => {
                                        // playSong(item)
                                        playByVid(item.sid)
                                    }}
                                >
                                    <span className="material-icons-outlined" style={{ fontSize: 32 }}>
                                        play_arrow
                                    </span>
                                </div>
                            </div>
                        )
                    })}
            </div>
        </div>
    )
}