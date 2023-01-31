import React, { useContext } from "react";
import { useEffect } from "react";
import bring from "../bring";
import { ControlContext } from "../ControlContext";
import "./index.css"

export default function Controls() {
    const { changeVolume, next, prev, volumeRef } = useContext(ControlContext)

    return <div className="controls">
        <div className="playArrow" onClick={prev}>
            <span className="material-icons">skip_previous</span>
        </div>
        <input
            ref={volumeRef}
            type="range"
            className="seek" 
            min="0"
            max="255"
            defaultValue="255"
            onTouchEnd={changeVolume}
            onMouseUp={changeVolume}
        />
        <div className="playArrow" onClick={next}>
            <span className="material-icons">skip_next</span>
        </div>
    </div>
}