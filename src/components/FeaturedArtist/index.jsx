import React from "react";
import weekend from "../../assets/weekend.avif"
import "./index.css";

export default function FeaturedArtist() {
    const [artist, setArtist] = React.useState({
        name: "The Weeknd",
        featured: true,
        image: weekend,
    })
    return (
        <article className="featuredArtist" style={{ backgroundImage: `url(${artist.image})` }}>
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: 12,
                    width: "calc(100% - 16px)",
                    borderRadius: 16,
                    margin: 6,
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
                            style={{
                                fontSize: 24,
                                fontWeight: "bold",
                                color: "var(--lt)",
                            }}
                        >
                            {artist.name}
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
                    <div style={{
                        display: "flex",
                    }}>
                        <div
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
                        >
                            <span className="material-icons-outlined" style={{ fontSize: 32 }}>
                                play_arrow
                            </span>
                        </div>
                        <div
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
            <img className="artistReflection" src={artist.image} />
        </article>
    )
}