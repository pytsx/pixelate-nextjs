"use client"

import Appbar from "@mui/material/Appbar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { ModeSwitcher } from "./ModeSwitcher";
import { useCanvas } from "@/provider";

export function AppAppbar() {

  const { state, dispatch } = useCanvas()

  function rename(e: React.FocusEvent<HTMLSpanElement, Element>) {
    const context = e.target.innerText

    dispatch({
      type: "RENAME",
      payload: {
        value: context
      }
    })
  }

  return (
    <Appbar>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography
          style={{
            userSelect: "none",
            fontSize: "1.6rem",
            padding: "0 1rem"
          }}
          contentEditable
          dangerouslySetInnerHTML={{ __html: state.name }}
          onBlur={rename}
        />
        <ModeSwitcher />
      </Toolbar>
    </Appbar>
  )
}