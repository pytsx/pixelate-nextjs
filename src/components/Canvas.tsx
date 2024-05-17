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
import InputBase from "@mui/material/InputBase"
import Stack from "@mui/material/Stack"
import TabContext from "@mui/lab/TabContext"
import Typography from "@mui/material/Typography"

import { getContrastRatio, alpha, darken, lighten } from "@mui/material/styles"
import { EditableCanvas, Mode, useEditor, useCanvas, usePreprocess, Tool, waitForImage } from "@/lib"

import { Fullscreen, PaintBucket, Paintbrush, Palette, Pencil, StopCircle, ZoomIn, ZoomOut } from "lucide-react"

import { Slider, CanvasBox, CanvasRoot } from "./ui"
import { AppAppBar } from "./AppAppbar"
import Image from "next/image"
import Logo from "../../public/logo.png"
import { ToggleButton, ToggleButtonGroup } from "@mui/material"

const Canvas = React.forwardRef<HTMLCanvasElement>((inProps, inRef) => {
  const {
    state,
    uploadFile,
    setCanvas,
    setMode,
    resetImageData,
    openDrawMode
  } = useEditor()

  const {
    mouseDown,
    mouseMove,
    ref,
    setColor,
    zoomIn,
    zoomOut,
    zoomToFit,
    mouseUp,
    setTool
  } = useCanvas()

  const {
    setTargetWidth,
    targetWidth,
    maxTargetWidth,
    setTargetColor,
    maxTargetColors,
    targetColors,
    targetHeight,
    realHeight,
    realWidth
  } = usePreprocess()

  const imgRef = React.useRef<HTMLImageElement>(null)

  function handleTargetWidthChange(e: any, newValue: number | number[]) {
    if (state.imageData && ref.current) {
      setTargetWidth(typeof newValue == "number" ? newValue : 0)
    }
  }

  function handleTargetColorsChange(e: any, newValue: number | number[]) {
    if (state.imageData && ref.current) {
      setTargetColor(typeof newValue == "number" ? newValue : 0)
    }
  }

  function plotImage(): void {
    if (state.imageData && ref.current) {
      const editableCanvas = new EditableCanvas(
        ref.current,
        state.imageData,
      )
      setCanvas(editableCanvas)
    }
  }

  React.useEffect(() => {
    plotImage()
  }, [state.imageData])

  function reset() {
    resetImageData()
    zoomToFit()
  }

  const iconTextColor = React.useCallback(() => {
    return getContrastRatio(
      state.canvasEditorState?.activeColor || "#fff", "#000") > 4
      ? darken(state.canvasEditorState?.activeColor || "#fff", .6)
      : lighten(state.canvasEditorState?.activeColor || "#fff", .6)
  }, [state.canvasEditorState?.activeColor || "#fff"])

  const iconStyle = {
    width: "1rem",
    height: "1rem",
  }

  function getMainImage() {
    return imgRef.current
  }

  return <TabContext value={state.mode || Mode.PREPROCESS}>
    <AppAppBar />
    <Drawer
      open={state.mode === Mode.PREPROCESS}
      onClose={() => setMode(Mode.DRAW)}
      variant="persistent"
    >
      {
        state.imageData && <Box sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
          height: "100%",
          alignItems: "center",
          gap: 4,
          padding: "2rem 1rem",
          width: "fit-content",
        }}>
          <Slider
            orientation="vertical"
            onChangeCommitted={(e, value) => {
              handleTargetWidthChange(e, value)
            }}
            onChange={handleTargetWidthChange}
            value={targetWidth}
            min={8}
            max={maxTargetWidth()}
            step={1}
            valueLabelDisplay="auto"
          />
          <Slider
            orientation="vertical"
            onChangeCommitted={(e, value) => {
              handleTargetColorsChange(e, value)
            }}
            onChange={handleTargetColorsChange}
            value={targetColors}
            min={2}
            max={maxTargetColors()}
            step={1}
            valueLabelDisplay="auto"
          />

          <Stack alignItems={"center"} sx={{ minWidth: "6rem" }}>
            <Typography>
              {targetWidth} x {targetHeight()} <br />
            </Typography>
            <Typography variant="caption">
              {realWidth()}cm x {realHeight()}cm
            </Typography>
          </Stack>
        </Box >
      }
    </Drawer>

    <Drawer
      open={state.mode === Mode.DRAW}
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
          value={state.canvasEditorState.activeTool}
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
        <Button
          disableFocusRipple
          disableTouchRipple
          disableElevation
          variant="contained"
          sx={{
            position: "relative",
            overflow: "clip",
            backgroundColor: state.canvasEditorState?.activeColor || "#fff",
            "&:hover": {
              backgroundColor: alpha(state.canvasEditorState?.activeColor || "#fff", .6),
            }
          }}>
          <InputBase
            onChange={(e) => {
              setColor(e.target.value)
            }}
            value={state.canvasEditorState?.activeColor || "#fff"}
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
          sx={{
            overflowY: "auto",
            scrollbarWidth: "thin",
            scrollbarGutter: "stable",
            padding: ".5rem 0",
          }}
        >
          {state.canvas &&
            [...state.canvas.counter.keys()].slice(0, 100).map((c, index) => (
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

    <CanvasBox sx={{ marginLeft: "4.4rem" }}>
      {
        state.mode === Mode.NEW
        && <Button onClick={openDrawMode} sx={{ margin: "auto" }}>
          <Box
            sx={{
              margin: "auto",
              display: "flex",
              flexDirection: "column"
            }}
            >

            <Image
                ref={imgRef}
              src={Logo}
              height={80}
              width={80}
              alt="logo"
              />
            start
          </Box>
        </Button>

      }
      {
        state.imageData
        && state.mode !== Mode.NEW
        && <CanvasRoot
          ref={ref}
          onMouseDown={mouseDown}
          onMouseMove={mouseMove}
          onMouseUp={mouseUp}
          onMouseLeave={mouseUp}
          onContextMenu={(e) => {
            e.preventDefault()
          }}
          sx={{
            cursor:
              state.mode == Mode.DRAW
                ? "crosshair"
                : "default",
            width: state.canvas?.width
          }}
        />
      }
    </CanvasBox>
  </TabContext>
})

Canvas.displayName = "Canvas"

export {
  Canvas
}


