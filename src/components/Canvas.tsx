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
import Image from "next/image"

import Logo from "../../public/logo.png"

import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Drawer from "@mui/material/Drawer"
import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import TabContext from "@mui/lab/TabContext"
import Typography from "@mui/material/Typography"
import ToggleButton from "@mui/material/ToggleButton"
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup"

import { getContrastRatio, alpha, darken, lighten } from "@mui/material/styles"
import { EditableCanvas, Mode, useEditor, useCanvas, usePreprocess, Tool } from "@/lib"
import { Fullscreen, PaintBucket, Paintbrush, Pencil, StopCircle, ZoomIn, ZoomOut } from "lucide-react"

import { useStore, HexColor } from "@/lib"

import { Slider, CanvasBox, CanvasRoot, ColorPicker } from "./ui"
import { AppAppBar } from "./AppAppbar"

const Canvas = React.forwardRef<HTMLCanvasElement>((inProps, inRef) => {
  const {
    store,
    setCanvas,
    setMode,
    resetImageData,
  } = useStore()

  const {
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

  // const [colorpickerAnchorEl, setColorpickerAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  // const handleClickColorpicker = (event: React.MouseEvent<HTMLButtonElement>) => {
  //   setColorpickerAnchorEl(event.currentTarget);
  // };

  // const handleCloseColorpicker = () => {
  //   setColorpickerAnchorEl(null);
  // };
  // const openColorPicker = Boolean(colorpickerAnchorEl);
  // const colorpickerPopoverId = openColorPicker ? 'colorpicker-popover' : undefined;


  const imgRef = React.useRef<HTMLImageElement>(null)

  function handleTargetWidthChange(e: any, newValue: number | number[]) {
    if (store.imageData && ref.current) {
      setTargetWidth(typeof newValue == "number" ? newValue : 0)
    }
  }

  function handleTargetColorsChange(e: any, newValue: number | number[]) {
    if (store.imageData && ref.current) {
      setTargetColor(typeof newValue == "number" ? newValue : 0)
    }
  }

  function plotImage(): void {
    if (store.imageData && ref.current) {
      const editableCanvas = new EditableCanvas(
        ref.current,
        store.imageData,
      )
      setCanvas(editableCanvas)
    }
  }

  React.useEffect(() => {
    plotImage()
  }, [store.imageData])

  function reset() {
    resetImageData()
    zoomToFit()
  }

  const iconTextColor = React.useCallback(() => {
    return getContrastRatio(
      store.canvasEditorState?.activeColor || "#fff", "#000") > 4
      ? darken(store.canvasEditorState?.activeColor || "#fff", .6)
      : lighten(store.canvasEditorState?.activeColor || "#fff", .6)
  }, [store.canvasEditorState?.activeColor || "#fff"])

  const iconStyle = {
    width: "1rem",
    height: "1rem",
  }

  const [bufferColor, setBufferColor] = React.useState<HexColor | null>(null)
  return <TabContext value={store.mode || Mode.PREPROCESS}>
    <AppAppBar />
    <Drawer
      open={store.mode === Mode.PREPROCESS}
      onClose={() => setMode(Mode.DRAW)}
      variant="persistent"
    >
      {
        store.imageData && <Box sx={{
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

    <CanvasBox sx={{ marginLeft: "4.4rem" }}>
      {
        store.mode === Mode.NEW
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
        store.imageData
        && store.mode !== Mode.NEW
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
              store.mode == Mode.DRAW
                ? "crosshair"
                : "default",
            width: store.canvas?.width
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


