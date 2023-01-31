import { Dialog, DialogContent, DialogTitle, Fade, ImageListItem, ImageListItemBar, Slide, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import React, { useState } from "react";
import PlaylistPlayIcon from "@mui/icons-material/PlaylistPlay"
import weekend from "../../assets/weekend.avif"
import { useTheme } from "@mui/system";
import CloseIcon from '@mui/icons-material/Close';
import ImageList from "@mui/material/ImageList"

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />
})

function srcset(image, size, rows = 1, cols = 1) {
    return {
        src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
        srcSet: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format&dpr=2 2x`,
    }
}

export default function FeaturedArtists () {
    const theme = useTheme()
    const [open, setOpen] = useState(false)
    const [tracks, setTracks] = useState([
  {
    img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
    title: 'Breakfast',
    rows: 2,
    cols: 2,
  },
  {
    img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
    title: 'Burger',
  },
  {
    img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
    title: 'Camera',
  },
  {
    img: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
    title: 'Coffee',
    cols: 2,
  },
  {
    img: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
    title: 'Hats',
    cols: 2,
  },
  {
    img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
    title: 'Honey',
    author: '@arwinneil',
    rows: 2,
    cols: 2,
  },
  {
    img: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6',
    title: 'Basketball',
  },
  {
    img: 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f',
    title: 'Fern',
  },
  {
    img: 'https://images.unsplash.com/photo-1597645587822-e99fa5d45d25',
    title: 'Mushrooms',
    rows: 2,
    cols: 2,
  },
  {
    img: 'https://images.unsplash.com/photo-1567306301408-9b74779a11af',
    title: 'Tomato basil',
  },
  {
    img: 'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1',
    title: 'Sea star',
  },
  {
    img: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6',
    title: 'Bike',
    cols: 2,
  },
  {
    img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
    title: 'Breakfast',
    rows: 2,
    cols: 2,
  },
  {
    img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
    title: 'Burger',
  },
  {
    img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
    title: 'Camera',
  },
  {
    img: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
    title: 'Coffee',
    cols: 2,
  },
  {
    img: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
    title: 'Hats',
    cols: 2,
  },
  {
    img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
    title: 'Honey',
    author: '@arwinneil',
    rows: 2,
    cols: 2,
  },
  {
    img: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6',
    title: 'Basketball',
  },
  {
    img: 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f',
    title: 'Fern',
  },
  {
    img: 'https://images.unsplash.com/photo-1597645587822-e99fa5d45d25',
    title: 'Mushrooms',
    rows: 2,
    cols: 2,
  },
  {
    img: 'https://images.unsplash.com/photo-1567306301408-9b74779a11af',
    title: 'Tomato basil',
  },
  {
    img: 'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1',
    title: 'Sea star',
  },
  {
    img: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6',
    title: 'Bike',
    cols: 2,
  },
])

    function openFeaturedArtists() {
        setOpen(true)
    }

    return (
        <>
            <div>
                <ImageListItem key={"23werf"} onClick={openFeaturedArtists}>
                    <img src={weekend} alt="Artist" loading="lazy" />
                    <ImageListItemBar
                        title={"The Weekend"}
                        subtitle={"Featured Artists"}
                        actionIcon={
                            <IconButton sx={{ color: "rgba(255, 255, 255, 0.54)" }} aria-label={`info about ${"sdfvds"}`} onClick={openFeaturedArtists}>
                                <PlaylistPlayIcon />
                            </IconButton>
                        }
                    />
                </ImageListItem>
            </div>
            <Dialog
                PaperProps={{
                    sx: {
                        backgroundColor: theme.palette.primary.main,
                    },
                }}
                fullScreen
                open={open}
                onClose={() => setOpen(false)}
                TransitionComponent={Transition}
            >
                <DialogTitle
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                    }}
                >
                    <div>
                        <Typography variant="h6" color={theme.palette.white.main}>
                            The Weekend
                        </Typography>
                        <Typography variant="caption" color={theme.palette.neutral.main}>
                            Featured Songs
                        </Typography>
                    </div>
                    <IconButton onClick={() => setOpen(false)}>
                        <CloseIcon fontSize="large" color="neutral" />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <ImageList variant="quilted" cols={Math.round(window.innerWidth / 100)} rowHeight={Math.round(window.innerWidth / 4)}>
                        {tracks.map((item, index) => (
                            <ImageListItem key={index} cols={item.cols || 1} rows={item.rows || 1}>
                                <img {...srcset(item.img, 121, item.rows, item.cols)} alt={item.title} loading="lazy" />
                            </ImageListItem>
                        ))}
                    </ImageList>
                </DialogContent>
            </Dialog>
        </>
    )
}