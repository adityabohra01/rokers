import React, { useState, useRef, useEffect } from "react"
import IconButton from "@mui/material/IconButton"
import { useTheme } from "@mui/material/styles"
import { SnackbarProvider } from "notistack"
import Snack from "./components/Snack"
import Loader from "./components/Loader"
import SnackbarUtils from "./components/SnackbarUtils"
import LoaderUtils from "./components/Loader/LoaderUtils"
import Home from "./Home"

function App() {
    const notistackRef = useRef()
    const theme = useTheme()

    useEffect(() => {
        LoaderUtils.unhalt()
    }, [])

    return (
        <SnackbarProvider
            dense
            preventDuplicate
            maxSnack={3}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
            }}
            ref={notistackRef}
            action={key => (
                <IconButton aria-label="Close" onClick={() => notistackRef.current.closeSnackbar(key)}>
                    <span className="material-icons" style={{ color: theme.palette.white.main }}>
                        close
                    </span>
                </IconButton>
            )}
        >
            <div className="App">
                <Snack></Snack>
                <Loader></Loader>
                <Home />
            </div>
        </SnackbarProvider>
    )
}

export default App
