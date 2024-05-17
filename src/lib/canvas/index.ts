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
import { DirtyArea, HexColor, Operation, getContext2D } from "@/lib/utils"

export function useCanvas() {
  const { setCanvasState, state, setImageData } = useEditor()
  const [operations, setOperations] = React.useState<Operation[]>([])
  const [currentOperation, setCurrentOperation] = React.useState<number>(0)

  const ref = React.useRef<HTMLCanvasElement>(null)

  const setEnableFill = (value: boolean) => {
    setCanvasState({
      ...state.canvasEditorState,
      enableFill: value
    })
  }

  const setColor = (value: string) => {
    setCanvasState({
      ...state.canvasEditorState,
      activeColor: value
    })
  }

  function mouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    e.preventDefault()
    if (!state.canvasEditorState.enableFill) return
    mouseHandler(e)
  }


  function setZoom(value: number) {
    if (!ref.current || !state.canvas) return
    ref.current.style.width = `${state.canvas.width * value}px`
    ref.current.style.height = `${state.canvas.height * value}px`
    setCanvasState({
      ...state.canvasEditorState,
      zoom: value
    })
  }

  function zoom(): number {
    if (!ref.current || !state.canvas) return 1
    return ref.current.offsetWidth / state.canvas.width;
  }

  function zoomIn() {
    setZoom(Math.min(state.canvasEditorState.maxScale, state.canvasEditorState.zoom + 1))

  }
  function zoomOut() {
    setZoom(Math.max(1, state.canvasEditorState.zoom - 1))
  }

  function zoomToFit() {
    setZoom(state.canvas ? Math.trunc(
      Math.max(
        1,
        Math.min(
          (window.innerWidth / state.canvas.width) * 0.9,
          (window.innerHeight / state.canvas.height) * 0.9,
          state.canvasEditorState.maxScale
        )
      )
    ) : state.canvasEditorState.zoom);
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


    const prevColor = state.canvas.pick(x, y)
    const prevOperation = operations.at(-1)

    if (e.buttons === 2) {
      setColor(prevColor)
      return
    }

    const newOperation = {
      color: state.canvasEditorState.activeColor,
      tool: state.canvasEditorState.activeTool,
      y,
      x,
    }
    if (
      prevOperation
      && prevOperation.x === newOperation.x
      && prevOperation.y === newOperation.y
      && prevOperation.color === newOperation.color
      && prevOperation.tool === newOperation.tool
    ) return

    if (operations.some(
      op => op
        && op.x === newOperation.x
        && op.y === newOperation.y
        && op.color === newOperation.color
        && op.tool === newOperation.tool
    )) return
    if (
      prevColor === state.canvasEditorState.activeColor
      && state.canvasEditorState.activeTool === Tool.DRAW
    ) return

    setOperations(prev => [...prev, newOperation])
  }


  React.useEffect(() => {
    requestAnimationFrame(processOperations);
  }, [operations])

  function processOperations() {
    if (operations.length > 0 && state.canvas) {
      for (let i = currentOperation; i < operations.length; i++) {

        const operation = operations[i]

        switch (operation.tool) {
          case Tool.DRAW:
            draw(operation.x, operation.y, operation.color);
            break;
          case Tool.FILL:
            fill(operation.x, operation.y);
            break;
          case Tool.FILL_ALL:
            fillAll(operation.x, operation.y);
            break;
          default:
            break;
        }
      }
      setCurrentOperation(operations.length)
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
    if (state.canvasEditorState.enableFill && state.mode === Mode.DRAW) {
      const ctx = getContext2D(ref.current)
      setImageData(ctx.getImageData(0, 0, state.canvas.width, state.canvas.height))
    }
    setEnableFill(false)
    setOperations([])
    setCurrentOperation(0)
  }

  function draw(x: number, y: number, color: HexColor = state.canvasEditorState.activeColor) {
    if (!ref.current || !state.canvas) return
    const ctx = getContext2D(ref.current)
    if (!ctx) return

    state.canvas.redraw(state.canvas.imageData.draw(x, y, color))
  }

  function fillAll(x: number, y: number) {
    if (!state.canvas) return
    const dirtyArea: DirtyArea | undefined = state.canvas.imageData.fillAll(x, y, state.canvasEditorState.activeColor)
    if (dirtyArea) {
      state.canvas.redraw(dirtyArea)
    }
  }

  function fill(x: number, y: number) {
    if (!state.canvas) return
    const dirtyArea: DirtyArea | undefined = state.canvas.imageData.fill(x, y, state.canvasEditorState.activeColor)
    if (dirtyArea) {
      state.canvas.redraw(dirtyArea)
    }
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

  function setTool(tool: Tool) {
    setCanvasState({
      ...state.canvasEditorState,
      activeTool: tool
    })
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
    ctx.fillRect(x * state.canvasEditorState.size, y * state.canvasEditorState.size, state.canvasEditorState.size, state.canvasEditorState.size)
  }

  React.useEffect(() => {
    if (state.mode === Mode.PREPROCESS) {
      zoomToFit()
    }
  }, [state.canvas])

  React.useEffect(() => {
    zoomToFit()
  }, [state.mode, state.originalImageData])

  return {
    mouseMove,
    mouseDown,
    ref,
    setColor,
    uploadImage,
    zoomIn,
    zoomOut,
    zoomToFit,
    mouseUp,
    setTool
  }
}
