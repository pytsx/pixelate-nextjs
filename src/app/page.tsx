import React from "react";
import { AppAppbar } from "./components/AppAppbar";
import { Canvas } from "./components/Canvas";

import Box from "@mui/material/Box";

export default function Home() {


  return (
    <React.Fragment>
      <AppAppbar />
        <Box
          sx={{
          display: "flex",
          flexDirection: { xs: "column-reverse", md: "row" },
          width: "100%",
          height: "100vh",
          alignItems: "center",
          justifyContent: "space-between",
          }}>
        <Canvas />
      </Box>
    </React.Fragment>
  );
}
