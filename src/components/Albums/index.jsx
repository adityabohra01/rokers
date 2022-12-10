import React from "react";
import weekend from "../../assets/weekend.avif";
import ashiqui2 from "../../assets/ashiqui.jpg";
import idiots from "../../assets/idiots.jpg";
import "./index.css";

export default function Albums() {
    const [albums, setAlbums] = React.useState([
        {
            name: "Ashiqui 2",
            featured: true,
            image: ashiqui2,
            artist: "Arjit Singh",
        },
        {
            name: "3 Idiots",
            featured: true,
            image: idiots,
            artist: "Amir Khan",
        },
    ])
    return (
        <div
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
                    Albums
                </span>
                <span className="seeAll">
                    See all
                </span>
            </div>
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-around",
                    alignItems: "center",
                    width: "100%",
                    flexWrap: "wrap",
                    paddingTop: 16,
                }}
            >
                {albums.map((album, index) => (
                    <article className="albums" style={{ backgroundImage: `url(${album.image})` }}>
                        <div className="albumControlWrapper">
                            <div className="albumNameAndArtist">
                                <span>{album.name}</span>
                                <span>{album.artist}</span>
                            </div>
                            <div className="playArrow">
                                <span className="material-icons-outlined">play_arrow</span>
                            </div>
                        </div>
                        <img className="albumReflection" src={album.image} />
                    </article>
                ))}
            </div>
        </div>
    )
}