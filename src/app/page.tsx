import React from "react";
import { AppAppbar } from "./components/AppAppbar";
import { Canvas } from "./components/Canvas";

import Box from "@mui/material/Box";

export default function Home() {


  return (
        <Box
          sx={{
          display: "flex",
        flexDirection: "column",
          width: "100%",
        height: "100vh",
          }}>
        <Canvas />
    </Box>
  );
}
