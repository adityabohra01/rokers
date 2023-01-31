import * as React from "react"
import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import Search from "../Search"

export default function NavBar() {


    const [searchOpen, setSearchOpen] = React.useState(false)

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="fixed">
                    <Toolbar>
                        <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                            <span className="material-icons">grid_view</span>
                        </IconButton>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: "center" }}>
                            Rokers
                        </Typography>
                        <IconButton color="inherit" onClick={() => setSearchOpen(true)}>
                            <span className="material-icons">search</span>
                        </IconButton>
                    </Toolbar>
                </AppBar>
            </Box>
            <Search searchOpen={searchOpen} setSearchOpen={setSearchOpen}/>
        </>
    )
}
