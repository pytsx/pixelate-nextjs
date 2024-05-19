/**
 * Copyright 2024 Henrique de Lima Pessoa
 * 
 * See the NOTICE file distributed with this work for 
 * additional information regarding copyright ownership.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *    https://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * 
 * This project is based on https://github.com/google/pixelate which is licensed under the Apache 2.0 License.
 * 
 * Copyright 2022 Google LLC
 */

"use client"

import React from "react"


import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Drawer from "@mui/material/Drawer"
import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import ToggleButton from "@mui/material/ToggleButton"
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup"

import { alpha, darken } from "@mui/material/styles"

import { Fullscreen, PaintBucket, Paintbrush, Pencil, StopCircle, ZoomIn, ZoomOut } from "lucide-react"

import { HexColor, Mode, Tool, useCanvas, useStore } from "@/lib"
import { ColorPicker } from "../ui"


function DrawDrawer() {
  const {
    store,
    resetImageData,
  } = useStore()

  const {
    setColor,
    zoomIn,
    zoomOut,
    zoomToFit,
    setTool,
  } = useCanvas()

  function reset() {
    resetImageData()
    zoomToFit()
  }

  return (

    <Drawer
      open={store.mode === Mode.DRAW}
      variant="persistent"
    >
      <Box sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        height: "100%",
        alignItems: "center",
        gap: .25,
        padding: ".5rem 0",
        width: "5rem"
      }}>
        <ToggleButtonGroup
          orientation="vertical"
          value={store.canvasEditorState.activeTool}
          exclusive
          onChange={(e, value) => setTool(value)}
        >
          <ToggleButton
            value={Tool.DRAW}
          >
            <Pencil />
          </ToggleButton >
          <ToggleButton
            value={Tool.FILL}
          >
            <Paintbrush />
          </ToggleButton >
          <ToggleButton
            value={Tool.FILL_ALL}
          >
            <PaintBucket />
          </ToggleButton >
        </ToggleButtonGroup>

        <ColorPicker
          presetColors={store.canvas ? [...store.canvas.counter.keys()].slice(0, 100) : undefined}
          setColor={(e) => {
            setColor(e as HexColor)
          }}
          color={store.canvasEditorState?.activeColor || "#fff"}
        />

        <Stack
          gap={.25}
          direction={"column"}
          alignItems={"center"}
          width={"100%"}
          height={"100%"}
          sx={{
            overflowY: "auto",
            scrollbarWidth: "thin",
            scrollbarGutter: "stable",
            padding: ".5rem 0",
          }}
        >
          {store.canvas &&
            [...store.canvas.counter.keys()].slice(0, 100).map((c, index) => (
              <Button
                variant="contained"
                key={`color-${index}=${c}`}
                onClick={() => setColor(c)}
                sx={{
                  backgroundColor: c,
                  border: "2px solid",
                  borderColor: darken(c, .3),
                  marginLeft: 1.25,
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

        <Stack sx={{
          padding: "0 .5rem",
        }}>
          <IconButton onClick={() => zoomIn()}><ZoomIn /></IconButton>
          <IconButton onClick={() => zoomToFit()}><Fullscreen /></IconButton>
          <IconButton onClick={() => zoomOut()}><ZoomOut /></IconButton>

        </Stack>
        <Button
          variant="contained"
          color="error"
          onClick={reset}
          disableElevation
          disableFocusRipple
          disableTouchRipple
          sx={{
            height: "2.2rem"
          }}
        >
          <StopCircle />
        </Button>
      </Box>
    </Drawer>
  )
}

DrawDrawer.displayName = "DrawDrawer"
export { DrawDrawer }