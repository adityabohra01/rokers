import React, { useState, useRef, useCallback } from "react";
import { debounce } from "debounce"
import bring from "../bring"
import './index.css'
import { useEffect } from "react";
import Speech from "../Speech";

export default function Navigation() {
    const [search, setSearch] = useState(false);
    const searchInput = useRef(null)
    const [searchData, setSearchData] = useState({})
    const [inTransit, setInTransit] = useState(false)
    const [controller, setController] = useState(new AbortController())
    const appTitle = useRef(null)
    // debounced search
    const debouncedSearch = useCallback(
        debounce(() => {
            Search(searchInput.current.value);
        }, 500),
        []
    );

    function Search(query) {
        if (query.length === 0) return
        // abort previous request
        if (inTransit)
            controller.abort();

        setInTransit(true)
        bring({
            path: "search/" + encodeURI(query),
            options: {
                signal: controller.signal,
            },
        })
            .then(data => data.json())
            .then(data => {
                setInTransit(false)
                setSearchData(data)
                console.log(data)
            })
    }

    function playSong (track) {
        bring({
            path: "play",
            options: {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({track}),
            },
        })
            .then(data => data.json())
            .then(data => {
                console.log(data)
                setSearch(false)
            })
    }

    return (
        <>
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "64px",
                    backgroundColor: "var(--bg)",
                    zIndex: 99,
                    opacity: 0.9,
                }}
            ></div>
            <nav
                className="topNav"
                style={{
                    position: "fixed",
                    // top: 0,
                    // left: 0,
                    // margin: "0 -8px",
                    width: "calc(100% - 32px)",
                    display: "flex",
                    height: "48px",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    minWidth: "346px",
                    maxWidth: "440px",
                    // width: "100%"
                    zIndex: 100,
                }}
            >
                <Speech />
                <div
                    className="appTitle"
                    ref={appTitle}
                    style={{
                        fontsize: "large",
                        fontWeight: "bold",
                        alignContent: "center",
                        fontSize: 24,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontVariant: "small-caps",
                        tectSpacing: "0.5em",

                    }}
                >
                    Rokers
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
                    onClick={() => {
                        setSearch(!search)
                        setTimeout(() => {
                            if (!search) searchInput.current.focus()
                        }, 100)
                    }}
                >
                    <span className="material-icons-outlined" style={{ fontSize: 32 }}>
                        search
                    </span>
                </div>
            </nav>
            {search && (
                <>
                    <div className="cover" onClick={() => setSearch(false)}></div>
                    <div className="search">
                        <div className="searchBox">
                            <input
                                type="text"
                                ref={searchInput}
                                placeholder="Search"
                                onKeyDown={e => {
                                    if (e.key === "Enter") {
                                        Search(searchInput.current.value)
                                    }
                                    // if alphanumeric key is pressed, call debouncedSearch()
                                    if (e.key.match(/^[a-z0-9]+$/i)) debouncedSearch()
                                }}
                            />
                            <span
                                className="material-icons-outlined"
                                style={{ fontSize: 32 }}
                                onClick={() => {
                                    if (searchInput.current.value.length > 0) searchInput.current.value = ""
                                    else setSearch(false)
                                }}
                            >
                                close
                            </span>
                        </div>
                        <hr></hr>
                        <div className="searchResults">
                            {searchData.tracks &&
                                searchData.tracks.items.map((item, index) => (
                                    <div key={index} className="searchResult">
                                        <div className="coverPhoto">
                                            <img className="actual" src={item.album.images[item.album.images.length - 1].url} alt="AlbumArt" />
                                            <img className="reflection" src={item.album.images[item.album.images.length - 1].url} alt="AlbumArt" />
                                        </div>
                                        <div className="info">
                                            <div className="title">{item.name.length > 30 ? item.name.substring(0, 30) + " ..." : item.name}</div>
                                            <div className="aa">
                                                <div className="artist">
                                                    {item.artists
                                                        .map(value => value.name)
                                                        .join(", ")
                                                        .substring(0, 15)}
                                                </div>
                                                <div className="album"> {item.album.name.substring(0, 15)}</div>
                                            </div>
                                        </div>
                                        <div className="playArrow playButton" onClick={() => {
                                            playSong(item)
                                        }}>
                                            <span className="material-icons-outlined" style={{ fontSize: 32 }}>
                                                play_arrow
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            {!searchData.tracks && <center>Search for something</center>}
                            {searchData.tracks && searchData.tracks.items.length === 0 && <center>No results found</center>}
                        </div>
                    </div>
                </>
            )}
            <div
                style={{
                    height: "36px",
                }}
            ></div>
        </>
    )
}