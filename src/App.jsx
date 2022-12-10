import React, { useEffect, useState } from "react"
import Albums from "./components/Albums"
import FeaturedArtist from "./components/FeaturedArtist"
import Navigation from "./components/Navigation"
// import './App.css'


function App() {

  return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 24px',
        alignContent: 'center',
        width: '100vw',
        minWidth: '346px',
        maxWidth: '440px',
      }}>
        <Navigation />
        <br></br>
        <FeaturedArtist />
        <br></br>
        <Albums />
        <br></br>
        <br></br>
        <div>fdsgdfg</div>
        <div>fdsgdfg</div>
      </div>
  )
}

export default App
