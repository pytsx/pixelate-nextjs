"use client"
import Appbar from "@mui/material/Appbar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import { ModeSwitcher } from "@/components/modeSwitcher";

export default function Home() {

  return (
    <Appbar>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography variant="h1" sx={{ userSelect: "none", fontSize: "1.6rem" }}>
          Logo
        </Typography>
        <ModeSwitcher />
      </Toolbar>
    </Appbar>
  );
}
