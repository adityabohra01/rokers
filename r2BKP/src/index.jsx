import React, { useEffect } from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import "./index.css"
import "material-icons"

const root = ReactDOM.createRoot(document.getElementById("root"))
const theme = createTheme({
    palette: {
        primary: {
            main: "#0E060F",
            // contrastText: "#FFF",
        },
        secondary: {
            main: "#ECECF4",
            // contrastText: "#888888"
        },
        neutral: {
            main: "#677092",
            contrastText: "#fff",
        },
        white: {
            main: "#ffffff",
        },
        black: {
            main: "#0E060F",
            dark: "#0E060F",
            light: "#0E060F",
        },
        contrastThreshold: 3,
        // mode: "dark",
    },
})

// document.body.style.backgroundColor = theme.palette.background.default

window.theme = theme


root.render(
    <ThemeProvider theme={theme}>
        <App />
    </ThemeProvider>
)