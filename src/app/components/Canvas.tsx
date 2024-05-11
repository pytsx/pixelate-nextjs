"use client"

import { useEditor } from "@/provider"
import { colorsMap } from "@/provider/colorsMap"
import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"

import { alpha, darken, styled } from "@mui/material/styles"
import React from "react"


const Cell = styled("div", {
  name: "Cell",
  slot: "root",
})(({ theme }) => ({
  width: "clamp(.8rem, 2vw, 2rem)",
  height: "clamp(.8rem, 2vw, 2rem)",
  display: "inline-block",
  boxShadow: `inset 0px 0px 0px 1px ${alpha(theme.palette.grey[400], .1)}`,
  ...theme.applyStyles("dark", {
    boxShadow: `inset 0px 0px 0px 1px ${alpha(theme.palette.grey[700], .1)}`,

  })
}))

export function Canvas() {
  const { state, dispatch } = useEditor()
  const [enableFill, setEnableFill] = React.useState<boolean>(false)

  function fillCell(x: number, y: number, forced: boolean = false) {
    if (!forced && !enableFill) return
    dispatch({
      type: "FILL_CELL",
      payload: {
        x,
        y,
        value: state.selectedColor
      }
    })
  }


  React.useEffect(() => {
    const enable = () => setEnableFill(true)
    const disable = () => setEnableFill(false)

    document.addEventListener("mousedown", enable)

    document.addEventListener("mouseup", disable)

    return () => {
      document.removeEventListener("mousedown", enable),
        document.removeEventListener("mouseup", disable)
    }
  }, [])

  return (
    <Box sx={(theme) => ({
      border: "1px solid",
      borderColor: theme.palette.grey[700],
      borderRadius: theme.shape.borderRadius,
      overflow: "clip",
      margin: 1,
      cursor: "crosshair"
    })}
    >
      <Stack direction={"row"} >
        {
          state.matrix.map((row, rIndex) => (
            <Stack key={`row-${rIndex}`} >
              {
                row.map((cell, index) => (
                  <Cell
                    draggable={false}
                    key={`cell-${cell}-${index}`}
                    onMouseOver={() => cell !== state.selectedColor && fillCell(index, rIndex)}
                    onMouseDown={() => cell !== state.selectedColor && fillCell(index, rIndex, true)}
                    sx={(theme) => ({
                      backgroundColor: colorsMap[cell] === null
                        ? "transparent"
                        : colorsMap[cell],
                      boxShadow:
                        cell !== -1 && colorsMap[cell] !== null
                          ? `inset 0px 0px 0px 1px ${darken(colorsMap[cell], .1)}`
                          : "",
                      userSelect: "none",
                      "&:hover": {
                        backgroundColor: colorsMap[state.selectedColor]
                      },
                    })}
                  >
                  </Cell>
                ))
              }
            </Stack>
          ))
        }
      </Stack>
    </Box>

  )
}