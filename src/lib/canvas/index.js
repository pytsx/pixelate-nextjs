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

import { Mode, Tool } from ".."
import { getContext2D } from "@/lib/utils"
import { useStore } from "../store"

export function useCanvas() {
  const { store, setCanvasState, setImageData } = useStore()
  const [operations, setOperations] = React.useState([])
  const [currentOperation, setCurrentOperation] = React.useState(0)
  const ref = React.useRef(null)

  const setEnableFill = (value) => {
    setCanvasState({
      ...store.canvasEditorState,
      enableFill: value
    })
  }

  const setColor = (value) => {
    setCanvasState({
      ...store.canvasEditorState,
      activeColor: value
    })
  }

  function mouseMove(e) {
    e.preventDefault()
    if (!store.canvasEditorState.enableFill) return
    mouseHandler(e)
  }


  function setZoom(value) {
    if (!ref.current || !store.canvas) return
    ref.current.style.width = `${store.canvas.width * value}px`
    ref.current.style.height = `${store.canvas.height * value}px`
    setCanvasState({
      ...store.canvasEditorState,
      zoom: value
    })
  }

  function zoom() {
    if (!ref.current || !store.canvas) return 1
    return ref.current.offsetWidth / store.canvas.width;
  }

  function zoomIn() {
    setZoom(Math.min(store.canvasEditorState.maxScale, store.canvasEditorState.zoom + 1))

  }
  function zoomOut() {
    setZoom(Math.max(1, store.canvasEditorState.zoom - 1))
  }

  function zoomToFit() {
    setZoom(store.canvas ? Math.trunc(
      Math.max(
        1,
        Math.min(
          (window.innerWidth / store.canvas.width) * 0.9,
          (window.innerHeight / store.canvas.height) * 0.9,
          store.canvasEditorState.maxScale
        )
      )
    ) : store.canvasEditorState.zoom);
  }

  function mouseHandler(e) {
    e.preventDefault()
    if (!ref.current || !store.canvas) return

    const x = Math.min(
      store.canvas.width - 1,
      Math.trunc(e.nativeEvent.offsetX / zoom())
    );
    const y = Math.min(
      store.canvas.height - 1,
      Math.trunc(e.nativeEvent.offsetY / zoom())
    );


    const prevColor = store.canvas.pick(x, y)
    const prevOperation = operations.at(-1)

    if (e.buttons === 2) {
      setColor(prevColor)
      return
    }

    const newOperation = {
      color: store.canvasEditorState.activeColor,
      tool: store.canvasEditorState.activeTool,
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
      prevColor === store.canvasEditorState.activeColor
      && store.canvasEditorState.activeTool === Tool.DRAW
    ) return

    setOperations(prev => [...prev, newOperation])
  }

  function mouseDown(e) {
    e.preventDefault()
    if (store.mode === Mode.DRAW) {
      setEnableFill(true)
      mouseHandler(e)
    }
  }

  function mouseUp(e) {
    e.preventDefault()
    if (!ref.current || !store.canvas) return
    if (store.canvasEditorState.enableFill && store.mode === Mode.DRAW) {
      const ctx = getContext2D(ref.current)
      setImageData(ctx.getImageData(0, 0, store.canvas.width, store.canvas.height))
    }
    setEnableFill(false)
    setOperations([])
    setCurrentOperation(0)
  }

  function draw(x, y, color = store.canvasEditorState.activeColor) {
    if (!ref.current || !store.canvas) return
    const ctx = getContext2D(ref.current)
    if (!ctx) return

    store.canvas.redraw(store.canvas.imageData.draw(x, y, color))
  }

  function fillAll(x, y) {
    if (!store.canvas) return
    const dirtyArea = store.canvas.imageData.fillAll(x, y, store.canvasEditorState.activeColor)
    if (dirtyArea) {
      store.canvas.redraw(dirtyArea)
    }
  }

  function fill(x, y) {
    if (!store.canvas) return
    const dirtyArea = store.canvas.imageData.fill(x, y, store.canvasEditorState.activeColor)
    if (dirtyArea) {
      store.canvas.redraw(dirtyArea)
    }
  }


  function setTool(tool) {
    setCanvasState({
      ...store.canvasEditorState,
      activeTool: tool
    })
  }

  function uploadImage(event) {
    const file = event?.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const imageData = e.target?.result
      if (!imageData) return
      processImage(imageData)
    }
    reader.readAsDataURL(file)
  }

  function processImage(imageData) {
    if (!ref.current) return
    const ctx = getContext2D(ref.current)
    if (!ctx) return

    const image = new Image()
    image.src = imageData
    image.onload = () => {
      ctx.drawImage(image, 0, 0)
    }
  }

  function processOperations() {
    if (operations.length > 0 && store.canvas) {
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

  React.useEffect(() => {
    if (store.mode === Mode.PREPROCESS) {
      zoomToFit()
    }
  }, [store.canvas])

  React.useEffect(() => {
    zoomToFit()
  }, [store.mode, store.originalImageData])

  React.useEffect(() => {
    requestAnimationFrame(processOperations);
  }, [operations])

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
