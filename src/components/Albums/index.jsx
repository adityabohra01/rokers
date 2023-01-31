import React, { useEffect } from "react";
import bring from "../bring";
import "./index.css";

export default function Albums() {
    const [albums, setAlbums] = React.useState([])
    const albumContainer = React.useRef(null)
    const [open, setOpen] = React.useState(false)

    useEffect(() => {
        // fetch albums
        bring({path: "albums"})
        .then((data) => data.json())
        .then((albums) => {
            setAlbums(albums)
            console.log(albums)
        })
    }, [])

    function playAlbum (id) {
        bring({
            path: "playAlbum/" + id,
            options: {
                method: "GET",
            }
        }).then((res) => res.json())
        .then(toggleExpand)
    }

    function toggleExpand () {
        albumContainer.current.classList.toggle("expand")
        albumContainer.current.classList.toggle("albumContainer")
        setOpen(!open)
    }

    return (
        <div ref={albumContainer} className="albumContainer">
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                    padding: 16,
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
                {!open && (
                    <span className="seeAll" onClick={toggleExpand}>
                        See all
                    </span>
                )}
                {open && (
                    <span className="material-icons" onClick={toggleExpand}>
                        close
                    </span>
                )}
            </div>
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
                {albums &&
                    albums.length > 0 &&
                    albums.map((album, index) =>
                        !open && index > 1 ? null : (
                            <article key={album.albumID} className="albums" style={{ backgroundImage: `url(${album.albumImage})` }}>
                                <div className="albumControlWrapper">
                                    <div className="albumNameAndArtist">
                                        <span>{album.albumName}</span>
                                        {/* <span>{album.artist}</span> */}
                                    </div>
                                    <div className="playArrow" onClick={() => playAlbum(album.albumID)}>
                                        <span className="material-icons-outlined">play_arrow</span>
                                    </div>
                                </div>
                                <img className="albumReflection" src={album.albumImage} />
                            </article>
                        )
                    )}
            </div>
        </div>
    )
}