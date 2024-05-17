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

import { EditableCanvas, EditableImageData } from "../image"


export interface CanvasEditorState {
  activeColor: HexColor
  activeTool: Tool
  size: number
  maxScale: number
  enableFill: boolean
  palette: HexColor[]
  zoom: number
}
export interface EditorState {
  mode: Mode.PREPROCESS | Mode.DRAW | Mode.ASSEMBLE
  canvasEditorState: CanvasEditorState
  instructionsState: InstructionsState
  imageData: EditableImageData | null
  originalImageData: EditableImageData | null
  canvas: EditableCanvas | null
  history: EditorState[]
}

export type Actions =
  | {
    type: "SET_MODE",
    payload: {
      value: Mode
    }
  } | {
    type: "SET_IMAGE_DATA",
    payload: {
      value: ImageData
    }
  } | {
    type: "SET_CANVAS_EDITOR_STATE",
    payload: {
      value: CanvasEditorState
    }
  } | {
    type: "SET_CANVAS",
    payload: {
      value: EditableCanvas
    }
  } | {
    type: "SET_INSTRUCTIONS_STATE",
    payload: {
      value: InstructionsState
    }
  } | {
    type: "RESET"
  } | {
    type: "SET_CANVAS_IMAGE_DATA"
    payload: {
      value: EditableImageData
    }
  } | {
    type: "RESET_IMAGE_DATA"
  }

export function editorReducer(state: EditorState, action: Actions): EditorState 