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

import { Mode, Tool, useEditor } from ".."
import { HexColor, getContext2D } from "@/lib/utils"


export function useCanvas() {
  const size = 1
  const MAX_SCALE = 23
  const { setCanvasState, state, setImageData } = useEditor()
  const [enableFill, _setEnableFill] = React.useState<boolean>(false)
  const [palette, setPalette] = React.useState<HexColor[]>([])
  const [_zoom, _setZoom] = React.useState<number>(1)

  const ref = React.useRef<HTMLCanvasElement>(null)

  const setEnableFill = (value: boolean) => _setEnableFill(value)
  const setColor = (value: string) => {
    setCanvasState({
      activeTool: state.canvasEditorState?.activeTool || Tool.DRAW,
      activeColor: value
    })
  }

  React.useEffect(() => {
    if (state.canvas) {
      setPalette([...state.canvas.counter.keys()])
    }
  }, [state.canvas?.counter, state.canvas])

  function mouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    e.preventDefault()
    if (!enableFill) return
    mouseHandler(e)
  }


  function setZoom(value: number) {
    if (!ref.current || !state.canvas) return
    ref.current.style.width = `${state.canvas.width * value}px`
    ref.current.style.height = `${state.canvas.height * value}px`
    _setZoom(value)
  }

  function zoom(): number {
    if (!ref.current || !state.canvas) return 1
    return ref.current.offsetWidth / state.canvas.width;
  }

  function zoomIn() {
    setZoom(Math.min(MAX_SCALE, _zoom + 1))
  }
  function zoomOut() {
    setZoom(Math.max(1, _zoom - 1))
  }

  function zoomToFit() {
    setZoom(state.canvas ? Math.trunc(
      Math.max(
        1,
        Math.min(
          (window.innerWidth / state.canvas.width) * 0.9,
          (window.innerHeight / state.canvas.height) * 0.9,
          MAX_SCALE
        )
      )
    ) : _zoom);
  }

  function mouseHandler(e: React.MouseEvent<HTMLCanvasElement>) {
    e.preventDefault()
    if (!ref.current || !state.canvas) return

    const x = Math.min(
      state.canvas.width - 1,
      Math.trunc(e.nativeEvent.offsetX / zoom())
    );
    const y = Math.min(
      state.canvas.height - 1,
      Math.trunc(e.nativeEvent.offsetY / zoom())
    );

    if (e.buttons === 1) {
      draw(x, y)
    } else if (e.buttons === 2) {
      // fill(x, y)
      setColor(state.canvas.pick(x, y))
    }
  }

  function mouseDown(e: React.MouseEvent<HTMLCanvasElement>) {
    e.preventDefault()
    if (state.mode === Mode.DRAW) {
      setEnableFill(true)
      mouseHandler(e)
    }
  }

  function mouseUp(e: React.MouseEvent<HTMLCanvasElement>) {
    e.preventDefault()
    if (!ref.current || !state.canvas) return
    if (enableFill && state.mode === Mode.DRAW) {
      const ctx = getContext2D(ref.current)
      setImageData(ctx.getImageData(0, 0, state.canvas.width, state.canvas.height))
    }
    setEnableFill(false)
  }

  function draw(x: number, y: number) {
    if (!ref.current) return
    const ctx = getContext2D(ref.current)
    if (!ctx) return

    if (state.canvasEditorState?.activeColor && !palette.includes(state.canvasEditorState?.activeColor)) {
      setPalette(prev => [...prev, state.canvasEditorState?.activeColor])
    }

    ctx.fillStyle = state.canvasEditorState?.activeColor
    ctx.fillRect(x * size, y * size, size, size)
  }

  function fill(x: number, y: number) {
    if (!state.canvas) return

    const queue = [[x, y]];
    const startColor = state.canvas.pick(x, y);
    const dirtyArea = { left: x, top: y, right: x, bottom: y };

    if (state.canvas.pick(x, y) === state.canvasEditorState.activeColor) {
      return null;
    }

    let cur: number[] | undefined = []
    while ((cur = queue.pop())) {
      if (!cur) break

      const [cx, cy] = cur;
      const currentColor = state.canvas.pick(cx, cy);

      if (currentColor !== startColor || currentColor === state.canvasEditorState.activeColor) {
        continue;
      }

      draw(cx, cy);
      dirtyArea.left = Math.min(dirtyArea.left, cx);
      dirtyArea.right = Math.max(dirtyArea.right, cx);
      dirtyArea.top = Math.min(dirtyArea.top, cy);
      dirtyArea.bottom = Math.max(dirtyArea.bottom, cy);

      if (cx > 0) {
        queue.push([cx - 1, cy]);
      }
      if (cx < state.canvas.imageData.width - 1) {
        queue.push([cx + 1, cy]);
      }
      if (cy > 0) {
        queue.push([cx, cy - 1]);
      }
      if (cy < state.canvas.imageData.height - 1) {
        queue.push([cx, cy + 1]);
      }
    }

    return dirtyArea;
  }

  function fillAll(x: number, y: number) {
    if (!state.canvas) return
    return replaceColor(state.canvas.pick(x, y));
  }

  function replaceColor(originalColor: HexColor) {
    if (!state.imageData || !state.canvas) return
    const dirtyArea = { left: 0, top: 0, right: 0, bottom: 0 };
    for (let x = 0; x < state.imageData.width; x++) {
      for (let y = 0; y < state.imageData.height; y++) {
        const color = state.canvas.pick(x, y);
        if (color === originalColor) {
          draw(x, y);
          dirtyArea.left = Math.min(dirtyArea.left, x);
          dirtyArea.right = Math.max(dirtyArea.right, x);
          dirtyArea.top = Math.min(dirtyArea.top, y);
          dirtyArea.bottom = Math.max(dirtyArea.bottom, y);
        }
      }
    }
    return dirtyArea;

  }


  function uploadImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event?.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const imageData = e.target?.result
      if (!imageData) return
      processImage(imageData as string)
    }
    reader.readAsDataURL(file)
  }

  function processImage(imageData: string) {
    if (!ref.current) return
    const ctx = getContext2D(ref.current)
    if (!ctx) return

    const image = new Image()
    image.src = imageData

    image.onload = () => {
      ctx.drawImage(image, 0, 0)
    }
  }

  function clear(x: number, y: number) {
    if (!ref.current || !state.canvas) return
    const ctx = getContext2D(ref.current)
    if (!ctx) return

    ctx.fillStyle = state.canvas.pick(x, y)
    ctx.fillRect(x * size, y * size, size, size)
  }

  React.useEffect(() => {
    if (state.mode === Mode.PREPROCESS) {
      zoomToFit()
    }
  }, [state.canvas])

  React.useEffect(() => {
    zoomToFit()
  }, [state.mode])

  return {
    mouseMove,
    mouseDown,
    ref,
    setColor,
    palette,
    uploadImage,
    zoomIn,
    zoomOut,
    zoomToFit,
    mouseUp
  }
}
