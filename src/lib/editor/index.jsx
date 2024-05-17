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
import { downloadFile, loadImageFile, showFileDialog, waitForImage } from "../io"
import { EditableCanvas, EditableImageData, getImageData, hasImageData } from "../image"
import { editorReducer, initialEditorState, Mode, Tool } from "./reducer"
import { createCanvas, getContext2D } from "../utils"
export { Mode, Tool }

const EditorContext = React.createContext({})


export const EditorProvider = (props) => {
  const [state, dispatch] = React.useReducer(editorReducer, initialEditorState)

  async function openImageFile(file) {
    dispatch({
      type: "SET_MODE",
      payload: {
        value: "p"
      }
    })
    const img = await loadImageFile(file)
    const imageData = getImageData(img)

    dispatch({
      type: "SET_IMAGE_DATA",
      payload: {
        value: imageData
      }
    })
  }


  function setImageData(imageData) {
    dispatch({
      type: "SET_IMAGE_DATA",
      payload: {
        value: imageData
      }
    })
  }

  function setCanvasImageData(imageData) {
    dispatch({
      type: "SET_CANVAS_IMAGE_DATA",
      payload: {
        value: imageData
      }
    })
  }

  function resetImageData() {
    dispatch({
      type: "RESET_IMAGE_DATA"
    })

  }

  function setCanvas(editableCanvas) {
    dispatch({
      type: "SET_CANVAS",
      payload: {
        value: editableCanvas
      }
    })
  }

  function newFile() {
    dispatch({ type: "RESET" })
  }

  function openDrawMode() {
    setImageData(new ImageData(80, 80))
    setMode(Mode.PREPROCESS)
  }

  function uploadFile() {
    showFileDialog((file) => openImageFile(file))
  }

  async function downloadPng() {
    if (!hasImageData(state)) {
      throw new Error('copyImage requires imageData.');
    }
    const blob = await state.imageData.toPngBlob();
    const date = new Date().toISOString().slice(0, 10);
    const file = new File([blob], `pixelate-${date}.png`);
    downloadFile(file);
  }

  function copyImage() { }

  function setCanvasState(state) {
    dispatch({
      type: "SET_CANVAS_EDITOR_STATE",
      payload: {
        value: state
      }
    })
  }

  function setInstructionsState(state) {
    dispatch({
      type: "SET_INSTRUCTIONS_STATE",
      payload: {
        value: state
      }
    })
  }

  function setMode(mode) {
    dispatch({
      type: "SET_MODE",
      payload: {
        value: mode
      }
    })
    if (mode === Mode.NEW) {
      newFile()
    }
  }

  function undo() {

  }

  // getters 
  const isMobile = () => {
    getComputedStyle(document.documentElement)
      .getPropertyValue("--mobile")
      .trim() === '1'
  }
  const hasImage = () => hasImageData(state)

  return (
    <EditorContext.Provider value={{
      openImageFile,
      newFile,
      openDrawMode,
      uploadFile,
      downloadPng,
      copyImage,
      isMobile,
      hasImage,
      state,
      setCanvas,
      setCanvasState,
      setMode,
      setInstructionsState,
      setImageData,
      undo,
      setCanvasImageData,
      resetImageData
    }}>
      {props.children}
    </EditorContext.Provider>
  )
}



export const useEditor = () => {
  const context = React.useContext(EditorContext)

  if (!context) {
    throw new Error("useEditor must be used within an EditorProvider")
  }

  return context
}