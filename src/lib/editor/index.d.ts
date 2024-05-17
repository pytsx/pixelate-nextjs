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
import { CanvasEditorState, EditorState } from "./reducer"

export interface EditorContextProps {
  openImageFile(file: File): Promise<void>
  newFile(): void
  openDrawMode(): void
  uploadFile(): void
  downloadPng(): Promise<void>
  copyImage(): Promise<void>
  setCanvas(editableCanvas: EditableCanvas): void
  setCanvasState(canvasState: CanvasEditorState): void
  setInstructionsState(instructionsState: InstructionsState): void
  setMode(mode: Mode): void
  setImageData(imageData: ImageData): void
  undo(): void
  setCanvasImageData(imageData: EditableImageData): void
  resetImageData(): void
  state: EditorState
  //getters
  isMobile: () => Boolean
  hasImage: () => Boolean
}

declare const EditorContext: React.Context<EditorContextProps>

export const EditorProvider: (props: { children: React.ReactNode }) => JSX.Element
export const useEditor: () => EditorContextProps

export enum Tool {
  DRAW,
  FILL,
  FILL_ALL
}

export enum Mode {
  NEW = "n",
  PREPROCESS = "p",
  DRAW = "d",
  ASSEMBLE = "a"
}

export interface InstructionsState {
  crossedOutColors: Set<HexColor>
  crossedOutRows: Set<number>
  crossedOutColumns: Set<number>
}



export type PersistableState = | { mode: Mode.NEW } | EditorState

export interface StateSerialize {
  save(state: EditorState): Promise<void>
  read(): Promise<DeepPartial<EditorState> | null>
  clear(): Promise<void>
}

declare const initialState: EditorState

