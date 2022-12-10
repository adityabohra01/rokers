import React from "react";
import './index.css';

export default function Navigation() {

    return (
        <nav
            style={{
                position: "relative",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                // width: "100%"
                
            }}
        >
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
                    grid_view
                </span>
            </div>
            <div>
                Rokers
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
                    search
                </span>
            </div>
        </nav>
    )
}