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
import TabContext from "@mui/lab/TabContext"

import { EditableCanvas, Mode, useEditor, useCanvas } from "@/lib"

import { useStore } from "@/lib"

import { CanvasBox, CanvasRoot } from "./ui"
import { AppAppBar } from "./AppAppbar"
import { DrawDrawer, PreprocessDrawer } from "./drawers"

const Canvas = React.forwardRef<HTMLCanvasElement>((inProps, inRef) => {
  const {
    store,
    setCanvas,
  } = useStore()

  const {
    openDrawMode,
  } = useEditor()

  const {
    mouseDown,
    mouseMove,
    mouseUp,
    ref,
  } = useCanvas()

  const imgRef = React.useRef<HTMLImageElement>(null)

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



  return <TabContext value={store.mode || Mode.PREPROCESS}>
    <AppAppBar />

    <PreprocessDrawer />
    <DrawDrawer />
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


