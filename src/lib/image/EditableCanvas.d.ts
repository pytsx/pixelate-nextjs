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

import { Tool } from "../state"
import { HexColor } from "../utils"
import { DirtyArea, Operation } from "../utils"
import { EditableImageData } from "./EditableImageData"

declare export class EditableCanvas {
  private _ctx: CanvasRenderingContext2D
  private readonly _canvas: HTMLCanvasElement
  private readonly _imageData: EditableImageData

  constructor(
    canvas: HTMLCanvasElement,
    imageData: EditableImageData
  ): void

  public get width(): number
  public get height(): number
  public get imageData(): EditableImageData
  public get counter(): readonlyMap<HexColor, number>
  public set setImageData(img: EditableImageData): void

  public redraw(dirtyArea?: DirtyArea): void
  /**
   * NOTE: pick is a method that receives the x and y coordinates of the canvas and returns the color of the pixel in that position.
   */
  public pick(x: number, y: number): HexColor

  // public applyMany(operations: Operation[]): void
  // private apply(imageData: EditableImageData, operation: Operation): DirtyArea | null
}