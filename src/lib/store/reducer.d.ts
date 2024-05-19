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

import { Mode } from "../editor"
import { CanvasEditorState } from "../editor/reducer"
import { EditableCanvas, EditableImageData } from "../image"


export interface StoreState {
  mode: Mode
  canvasEditorState: CanvasEditorState
  imageData: EditableImageData | null
  originalImageData: EditableImageData | null
  canvas: EditableCanvas | null
  recovered: boolean
}

export const initialStoreState: StoreState

export type StoreActions =
  | {
    type: "LOAD_DATA"
    payload: {
      value: StoreState
    }
  } | {
    type: "SET_MODE",
    payload: {
      value: StoreState["mode"] | null
    }
  } | {
    type: "SET_IMAGE_DATA",
    payload: {
      value: StoreState["imageData"] | null
    }
  } | {
    type: "SET_CANVAS_EDITOR_STATE",
    payload: {
      value: StoreState["canvasEditorState"] | null
    }
  } | {
    type: "SET_CANVAS",
    payload: {
      value: StoreState["canvas"] | null
    }
  } | {
    type: "RESET"
  } | {
    type: "SET_CANVAS_IMAGE_DATA"
    payload: {
      value: StoreState["imageData"]
    }
  } | {
    type: "RESET_IMAGE_DATA"
  } | {
    type: "RECOVERED",
    payload: {
      value: boolean
    }
  }

export function storeReducer(state: StoreState, action: StoreActions): StoreState 