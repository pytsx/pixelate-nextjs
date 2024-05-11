import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { ModeSwitcher } from "./ModeSwitcher";
import React from "react";
import { Title } from "./Title";


export function AppAppbar() {
  return (
    <AppBar position="absolute" sx={{ height: "3.2rem" }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Title />
        <ModeSwitcher />
      </Toolbar>
    </AppBar>
  )
}