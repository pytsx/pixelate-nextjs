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

import { Mode, PersistableState } from "../editor"
import { EditorState } from "../editor/reducer"
import { HexColor, createCanvas, getContext2D, hexToRgb, min, requireNonNull } from "../utils"
import { EditableImageData } from "./EditableImageData"

export * from "./EditableCanvas"
export * from "./EditableImageData"


export function getImageData(img: HTMLImageElement): ImageData {
  if (!img.complete) throw new Error("Image not loaded")
  if (!img.naturalWidth || !img.naturalHeight) throw new Error("Image has no dimensions")

  const canvas = createCanvas({
    height: img.naturalHeight,
    width: img.naturalWidth
  })

  const ctx = getContext2D(canvas)
  ctx.fillStyle = "#ffffff"
  ctx.fillRect(0, 0, img.naturalWidth, img.naturalHeight);
  ctx.drawImage(img, 0, 0);

  return ctx.getImageData(0, 0, img.naturalWidth, img.naturalHeight);
}

export function downscale(
  original: EditableImageData,
  target: EditableImageData,
  colorHint: number
) {
  const ratio = original.width / target.width;
  // TODO: When the input image is aliased, picking the n most common color
  // values is not ideal. There might be dozens of shades of one color, but
  // each one with only a small count.
  const originalColors = Array.from(original.counter).sort(
    ([, a], [, b]) => b - a
  );
  const selectedColors = Array.from(
    originalColors.slice(0, colorHint).map(([c]) => c)
  );

  // Divide the original image of width m into n blocks, where n ≤ m.
  // Then, sample the center color from each block and draw the closest
  // color to the target image.
  for (let y = 0; y < target.height; y++) {
    for (let x = 0; x < target.width; x++) {
      const originalColor = original.pick(
        Math.min(Math.trunc((x + .5) * ratio), original.width - 1),
        Math.min(Math.trunc((y + .5) * ratio), original.height - 1)
      );
      const color = requireNonNull(
        min(selectedColors, (c) => colorDistance(c, originalColor))
      );
      target.draw(x, y, color);
    }
  }
}


export function colorDistance(a: HexColor, b: HexColor) {
  const [ar, ag, ab] = hexToRgb(a);
  const [br, bg, bb] = hexToRgb(b);

  return Math.abs(ar - br) + Math.abs(ag - bg) + Math.abs(ab - bb);
}


export function hasImageData(state: PersistableState): state is EditorState {
  return (
    state.mode === Mode.DRAW ||
    state.mode === Mode.PREPROCESS ||
    state.mode === Mode.ASSEMBLE
  )
}
