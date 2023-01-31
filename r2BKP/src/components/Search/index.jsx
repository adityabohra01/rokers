import * as React from "react"
import Dialog from "@mui/material/Dialog"
import Slide from "@mui/material/Slide"
import { Autocomplete, IconButton, InputAdornment, TextField, useTheme } from "@mui/material"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import Divider from "@mui/material/Divider"
import ListItemText from "@mui/material/ListItemText"
import ListItemAvatar from "@mui/material/ListItemAvatar"
import Avatar from "@mui/material/Avatar"
import Typography from "@mui/material/Typography"
import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite"
import SnackbarUtils from "../SnackbarUtils"
import bring from "../../../../rokers/src/components/bring"
import { useState } from "react"
import { useCallback } from "react"
import { debounce } from "debounce"
import CloseIcon from "@mui/icons-material/Close"

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />
})


export default function Search({ searchOpen, setSearchOpen }) {
    const theme = useTheme()
    const [searchInput, setSearchInput] = useState("")
    const [searchData, setSearchData] = useState([])
    const [inTransit, setInTransit] = useState(false)
    const [controller, setController] = useState(new AbortController())
    // debounced search
    const debouncedSearch = useCallback(
        debounce((e) => {
            Search(e)
        }, 500),
        []
    )

    function Search(query) {
        if (query.length === 0) return
        // abort previous request
        if (inTransit) controller.abort()

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
                setSearchData(data.tracks.items)
                console.log(JSON.stringify(data.tracks.items))
            })
            .catch(err => {
                console.log(err)
                controller.abort()
                setInTransit(false)
            })
    }

    function playSong(track) {
        console.log(track)
        bring({
            path: "play",
            options: {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ track }),
            },
        })
            .then(data => data.json())
            .then(data => {
                if (track.name.length > 22) SnackbarUtils.success(track.name.substring(0, 19) + "... playing")
                else SnackbarUtils.success(track.name.substring(0, 22) + " playing")
                setSearchOpen(false)
                console.log(data)
            })
    }

    const handleClickOpen = () => {
        setSearchOpen(true)
    }

    const handleClose = () => {
        setSearchOpen(false)
    }

    return (
        <div>
            <Dialog
                open={searchOpen}
                TransitionComponent={Transition}
                keepMounted
                fullScreen
                onClose={handleClose}
                aria-describedby="Search area for songs"
                fullWidth
                maxWidth={"lg"}
                PaperProps={{
                    sx: {
                        // backgroundColor: theme.palette.black.main,
                        // maxHeight: 300,
                        padding: 1,
                        paddingTop: 3,
                        // height: "calc(100% - 80px)",
                    },
                }}
            >
                <TextField
                    variant="outlined"
                    // color="white"
                    value={searchInput}
                    onChange={event => {
                        console.log(event.target.value)
                        setSearchInput(event.target.value)
                        debouncedSearch(event.target.value)
                    }}
                    label="Search Music"
                    placeholder="Search Music"
                    InputProps={{
                        type: "text",
                        endAdornment:
                            <InputAdornment position="end" onClick={() => {
                                if (searchInput.length === 0) setSearchOpen(false)
                                else setSearchInput("")
                            }}>
                                <IconButton>
                                    <CloseIcon />
                                </IconButton>
                            </InputAdornment>
                    }}
                />
                {/* <Divider
                color="white"
                    sx={{
                        margin: 1,
                    }}
                /> */}

                {searchData?.length != 0 && (
                    <List sx={{ width: "100%", bgcolor: "background.paper" }}>
                        {searchData.map((track, index) => (
                            <>
                                <ListItem disablePadding alignItems="center">
                                    <ListItemAvatar>
                                        <Avatar alt={track.album.name} src={track.album.images[2].url} />
                                    </ListItemAvatar>
                                    <ListItemText
                                        sx={{
                                            "*": {
                                                lineHeight: "16px",
                                            },
                                        }}
                                        primary={track.name}
                                        secondary={
                                            <React.Fragment>
                                                <Typography sx={{ display: "inline", mt: 1 }} component="span" variant="body2" color="text.primary">
                                                    {track.artists[0].name}
                                                </Typography>
                                                <br></br>
                                                {track.album.name}
                                            </React.Fragment>
                                        }
                                    />
                                    <IconButton edge="end" size="large" onClick={() => playSong(track)}>
                                        <PlayCircleFilledWhiteIcon fontSize="large" />
                                    </IconButton>
                                </ListItem>
                                <Divider variant="fullWidth" component="li" />
                            </>
                        ))}
                    </List>
                )}
            </Dialog>
        </div>
    )
}
