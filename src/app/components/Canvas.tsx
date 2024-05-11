"use client"

import React from "react"

import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Container from "@mui/material/Container"
import InputBase from "@mui/material/InputBase"
import Stack from "@mui/material/Stack"
import Toolbar from "@mui/material/Toolbar"

import { styled, getContrastRatio, alpha, darken, lighten } from "@mui/material/styles"


import { Palette, Trash } from "lucide-react"
import { useEditableCanvas } from "../../hooks"

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
    width: "1.2rem",
    height: "1.2rem"
  }

  return <React.Fragment>
    <AppBar position="relative"
      sx={(theme) => ({
        width: { xs: "100%", md: "fit-content" },
        height: { xs: "fit-content", md: "100%", },
        paddingTop: { xs: "", md: "3.6rem", },
      })}

    >
      <Container sx={{ padding: { xs: "", md: "0 .25rem !important" } }}>
        <Toolbar sx={{ padding: 0, display: "flex", flexDirection: "column" }}>
          <Button
            size="large"
            onClick={reset}
            color="error"
            variant="outlined"
            disableElevation
            sx={{
              borderRadius: 0,
              marginBottom: ".5rem"
            }}
          >
            <Trash style={iconStyle} />
          </Button>

          <Button
            size="large"
            disableFocusRipple
            disableTouchRipple
            sx={{
              position: "relative",
              overflow: "clip",
              borderRadius: 0,
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
                  aspectRatio: "1/1",
                  minHeight: "3.5rem",
                  cursor: "cell"
                }
              }}
            />
            <Palette style={{ ...iconStyle, color: iconTextColor() }} />
          </Button>

          <Stack sx={{ pt: 1, }} gap={.5}>
            {
              Object.keys(palette).map((c, index) => (
                <Button
                  key={`color-${index}=${c}`}
                  onClick={() => setColor(c)}
                  variant="contained"
                  sx={{
                    backgroundColor: c,
                    borderRadius: ".25rem",
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
        </Toolbar>
      </Container>
    </AppBar>

    <Box sx={{ width: "100%", height: "100%", display: "flex", padding: 1 }}>
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


