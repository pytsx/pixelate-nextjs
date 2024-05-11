"use client"

import React from "react"

import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import InputBase from "@mui/material/InputBase"
import Stack from "@mui/material/Stack"
import Toolbar from "@mui/material/Toolbar"

import { styled, getContrastRatio, alpha, darken, lighten } from "@mui/material/styles"


import { Palette, Trash } from "lucide-react"
import { useEditableCanvas } from "../../hooks"
import { Title } from "./Title"
import { ModeSwitcher } from "./ModeSwitcher"

const CanvasRoot = styled("canvas", {
  name: "canvas",
  slot: "root",
})(({ theme }) => ({
  border: "1px solid",
  borderColor: theme.palette.grey[700],
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden",
  cursor: "crosshair",
  margin: "auto",
}))

const Canvas = React.forwardRef<HTMLCanvasElement>((inProps, inRef) => {
  const {
    mouseDown,
    mouseMove,
    ref: canvasRef,
    height,
    width,
    reset,
    setColor,
    color,
    palette
  } = useEditableCanvas({
    cols: 40,
    rows: 40,
    size: 20
  })

  const iconTextColor = React.useCallback(() => getContrastRatio(color, "#000") > 4 ? darken(color, .6) : lighten(color, .6), [color])
  const iconStyle = {
    width: "1rem",
    height: "1rem",

  }

  return <React.Fragment>
    <AppBar
      sx={{
        height: "fit-content",
        backgroundColor: "transparent !important",
        zIndex: 1,
      }}
    >
      <Toolbar
        sx={(theme) => ({
          display: "flex",
          alignItems: "center",
          gap: 1,
          padding: ".25rem .25rem",
          height: "3.2rem",
          backgroundColor: "background.paper",
          justifyContent: "space-between",
          border: "1px solid",
          borderColor: theme.palette.grey[300],
          ...theme.applyStyles("dark", {
            borderColor: theme.palette.grey[900],
          })

        })}>

        <div style={{ width: "3.2rem" }} />

        <Title />
        <ModeSwitcher />

      </Toolbar>
    </AppBar>

    <Box sx={{
      width: "100%",
      height: "100%",
      display: "flex",
      paddingTop: "calc(3.2rem - 1px)"
    }}>
      <Toolbar sx={{
        display: "flex",
        width: "3.2rem",
        flexDirection: "column",
        gap: .5,
        backgroundColor: "background.paper",
        padding: ".32rem",
        zIndex: 10,
      }}>

        <Button
          disableFocusRipple
          disableTouchRipple
          disableElevation
          variant="contained"
          sx={{
            position: "relative",
            overflow: "clip",
            backgroundColor: color,
            "&:hover": {
              backgroundColor: alpha(color, .6),
            }
          }}>
          <InputBase
            onChange={(e) => {
              setColor(e.target.value)
            }}
            type="color"
            sx={{
              cursor: "pointer",
              position: "absolute",
              width: "100%",
              opacity: 0,
              zIndex: 100,
              "& .MuiInputBase-input": {
                backgroundColor: "red",
                minHeight: "3.5rem",
                cursor: "cell"
              }
            }}
          />
          <Palette style={{ ...iconStyle, color: iconTextColor() }} />
        </Button>


        <Stack
          gap={.25}
          direction={"column"}
          alignItems={"center"}
          width={"100%"}
          height={"100%"}
        >
          {
            Object.keys(palette).map((c, index) => (
              <Button
                variant="contained"
                key={`color-${index}=${c}`}
                onClick={() => setColor(c)}
                sx={{
                  backgroundColor: c,
                  border: "2px solid",
                  borderColor: darken(c, .3),
                  ":hover": {
                    backgroundColor: alpha(c, .6),
                  }
                }}
                disableElevation
              >
              </Button>
            ))
          }
        </Stack>

        <Button
          onClick={reset}
          color="error"
          variant="contained"
          disableElevation
        >
          <Trash style={iconStyle} />
        </Button>

      </Toolbar>

      <CanvasRoot
        ref={canvasRef}
        onMouseDown={mouseDown}
        onMouseMove={mouseMove}
        onContextMenu={(e) => {
          e.preventDefault()
        }}
        width={width}
        height={height}
      />
    </Box>
  </React.Fragment>
})

Canvas.displayName = "Canvas"

export {
  Canvas
}


