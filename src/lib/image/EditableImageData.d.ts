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

import { HexColor } from "./EditableCanvas"

declare export class EditableImageData {
  private _pixels: number[][]
  private _counter: Map<HexColor, number>
  private readonly _imageData: ImageData

  constructor(_imageData: ImageData): void

  public get width(): number
  public get imageData(): ImageData
  public get height(): number

  public get counter(): ReadonlyMap<HexColor, number>
  public get pixels(): ReadonlyArray<ReadonlyArray<HexColor>>

  public draw(x: number, y: number, fillColor: HexColor): void
  public fill(x: number, y: number, fillColor: HexColor): DirtyArea | null
  public fillAll(x: number, y: number, fillColor: HexColor): DirtyArea | null
  public replaceColor(originalColor: HexColor, fillColor: HexColor): DirtyArea | null
  public toDataURL(): string
  public toPngBlob(): Promise<Blob>
  public toImg(): HTMLImageElement
  /**
   * NOTE: pick is a method that receives the x and y coordinates of the image and returns the color of the pixel in that position.
   */
  public pick(x: number, y: number): HexColor
  /**
   * NOTE: toIndex is a method that receives the x and y coordinates of the image and returns the index of the pixel in that position.
   */
  private toIndex(x: number, y: number): number
}
