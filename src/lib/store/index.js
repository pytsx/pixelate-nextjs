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

import { Mode } from "../editor"
import React from "react"
import { initialStoreState, storeReducer } from "./reducer"

export const StoreContext = React.createContext({})

export const StoreProvider = (props) => {
  const [store, dispatch] = React.useReducer(storeReducer, initialStoreState)

  function loadData(data) {
    dispatch({
      type: "LOAD_DATA",
      payload: {
        value: data
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
      reset()
    }
  }

  function setImageData(imageData) {
    dispatch({
      type: "SET_IMAGE_DATA",
      payload: {
        value: imageData
      }
    })
  }

  function setCanvas(canvas) {
    dispatch({
      type: "SET_CANVAS",
      payload: {
        value: canvas
      }
    })
  }

  function setCanvasState(state) {
    dispatch({
      type: "SET_CANVAS_EDITOR_STATE",
      payload: {
        value: state
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

  function reset() {
    dispatch({
      type: "RESET"
    })
  }

  function resetImageData() {
    dispatch({
      type: "RESET_IMAGE_DATA"
    })

  }

  return <StoreContext.Provider
    value={{
      store,
      loadData,
      reset,
      setCanvas,
      setImageData,
      setCanvasState,
      setMode,
      setCanvasImageData,
      resetImageData
    }}
    {...props}
  />
}

export function useStore() {
  const context = React.useContext(StoreContext)
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider")
  }
  return context
}