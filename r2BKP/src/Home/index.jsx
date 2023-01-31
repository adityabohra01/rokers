import React from "react";

import { useTheme } from "@mui/material/styles";
import NavBar from "../components/NavBar";
import FeaturedArtists from "../components/FeaturedArtists";


export default function Home() {
    const theme = useTheme();
    return (
        <div>
            <NavBar />

            <FeaturedArtists />
        </div>
    );
}
