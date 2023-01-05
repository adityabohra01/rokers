import React from "react";
import "./index.css"
import photo from "../../assets/ashiqui.jpg"

export default function RecentlyPlayed() {
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
                <span className="seeAll">See all</span>
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
                <div className="searchResult">
                    <div className="coverPhoto">
                        <img className="actual" src={photo} alt="AlbumArt" />
                        <img className="reflection" src={photo} alt="AlbumArt" />
                    </div>
                    <div className="info">
                        <div className="title">Song name</div>
                        <div className="aa">
                            <div className="artist">amankrokx</div>|<div className="album">Bohra and tb</div>
                        </div>
                    </div>
                    <div className="playArrow playButton">
                        <span className="material-icons-outlined" style={{ fontSize: 32 }}>
                            more_vert
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}