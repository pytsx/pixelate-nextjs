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

export * from "./types"
export * from "./ColorManipulation"

import { Tool } from "../editor"
import { HexColor } from "./ColorManipulation"
import { requireNonNull } from "./types"



export interface DirtyArea {
  left: number
  top: number
  right: number
  bottom: number
}

export interface Operation {
  tool: Tool
  color: HexColor
  x: number
  y: number
}

export function createCanvas({
  width,
  height
}: {
  width: number,
  height: number
}): HTMLCanvasElement {
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height

  return canvas
}

export function getContext2D(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  const ctx = requireNonNull(canvas.getContext('2d', {
    alpha: true,
    willReadFrequently: true,
  }));
  ctx.imageSmoothingEnabled = false;
  return ctx;
}

export function mergeDirtyAreas(a: DirtyArea | null, b: DirtyArea | null): DirtyArea | null {
  if (!a) {
    return b;
  } else if (!b) {
    return a;
  } else {
    return {
      left: Math.min(a.left, b.left),
      right: Math.max(a.right, b.right),
      top: Math.min(a.top, b.top),
      bottom: Math.max(a.bottom, b.bottom),
    };
  }
}

export function min<T>(iterable: Iterable<T>, comparator: (a: T) => number) {
  let minValue = undefined
  let minEntry = undefined

  for (const entry of iterable) {
    const value = comparator(entry)
    if (minValue === undefined || value < minValue) {
      minValue = value
      minEntry = entry
    }
  }

  return minEntry
}

