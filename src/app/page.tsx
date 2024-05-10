import React from "react";
import { AppAppbar } from "./components/AppAppbar";
import { Canvas } from "./components/Canvas";

import Container from "@mui/material/Container";
import { ColorPicker } from "./components/ColorPicker";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

export default function Home() {


  return (
    <React.Fragment>
      <AppAppbar />

      <Box sx={{ display: "flex" }}>

        <ColorPicker />
        <Box
          sx={{
            display: "flex",
            width: "100%",
            height: "100vh",
            alignItems: "center",
            justifyContent: "center"
          }}>
          <Canvas />
        </Box>
      </Box>
    </React.Fragment>
  );
}
