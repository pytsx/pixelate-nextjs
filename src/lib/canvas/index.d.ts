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

import React from "react"
import { HexColor } from "../utils"
import { Tool } from "../editor"

interface ICanvas {
  mouseMove(e: React.MouseEvent<HTMLCanvasElement>): void,
  mouseDown(e: React.MouseEvent<HTMLCanvasElement>): void,
  ref: React.RefObject<HTMLCanvasElement>,
  setColor(value: HexColor): void,
  uploadImage(event: React.ChangeEvent<HTMLInputElement>): void,
  zoomIn(): void,
  zoomOut(): void,
  zoomToFit(): void,
  mouseUp(e: React.MouseEvent<HTMLCanvasElement>): void,
  setTool(value: Tool): void
  undo(): void,
}

export function useCanvas(): ICanvas