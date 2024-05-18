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

import { produce } from "immer"
import { EditableImageData } from "../image"


export function storeReducer(state, action) {
  return produce(state, (draft) => {
    switch (action.type) {
      case "LOAD_DATA":
        draft = {
          ...draft,
          ...action.payload.value
        }
        break
      case "SET_MODE":
        draft.mode = action.payload.value
        break
      case "SET_IMAGE_DATA":
        const imageData = new EditableImageData(action.payload.value)
        if (!state.imageData || state.mode == "n") {
          draft.originalImageData = imageData
        }
        draft.imageData = imageData
        break
      case "SET_CANVAS":
        draft.canvas = action.payload.value
        break
      case "SET_CANVAS_EDITOR_STATE":
        draft.canvasEditorState = action.payload.value
        break
      case "RESET":
        draft.imageData = null
        draft.canvas = null
        draft.history = []
        draft.mode = "n"
        draft.canvasEditorState = initialStoreState.canvasEditorState
        draft.originalImageData = null
      case "RESET_IMAGE_DATA":
        draft.imageData = draft.originalImageData
        break
      case "SET_CANVAS_IMAGE_DATA":
        if (!draft.canvas) break
        draft.canvas.setImageData(action.payload.value)
        break;
      default:
        break;
    }
  })
}

export const initialStoreState = {
  mode: "n",
  canvasEditorState: {
    activeColor: "#000000",
    activeTool: "DRAW",
    maxScale: 23,
    size: 1,
    zoom: 1,
    palette: [],
    enableFill: false
  },
  imageData: null,
  canvas: null,
}
