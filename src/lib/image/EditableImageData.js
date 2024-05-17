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

import { rgbToHex, hexToRgb, createCanvas, getContext2D } from "../utils"

export class EditableImageData {
  constructor(imageData) {
    this._pixels = []
    this._counter = new Map()
    this._imageData = imageData

    for (let y = 0; y < this._imageData.height; y++) {
      const row = []
      for (let x = 0; x < this._imageData.width; x++) {
        const color = this.pick(x, y)
        row.push(color)
        const count = this._counter.get(color) || 0
        this._counter.set(color, count + 1)
      }
      this._pixels.push(row)
    }
  }
  get imageData() { return this._imageData }
  get width() { return this._imageData.width }
  get height() { return this._imageData.height }
  get counter() { return this._counter }
  get pixels() { return this._pixels }

  toIndex(x, y) {
    return (y * this.width + x) * 4
  }

  pick(x, y) {
    const i = this.toIndex(x, y) || 0
    try {
      return rgbToHex(
        this._imageData.data[i + 0],
        this._imageData.data[i + 1],
        this._imageData.data[i + 2]
      )
    } catch (error) {
      return "#1d1d1d"
    }
  }

  draw(x, y, fillColor) {
    const previous = this._pixels[y][x];
    if (previous === fillColor) {
      return null;
    }
    const rgb = hexToRgb(fillColor);
    const i = this.toIndex(x, y);
    this.imageData.data[i + 0] = rgb[0];
    this.imageData.data[i + 1] = rgb[1];
    this.imageData.data[i + 2] = rgb[2];

    // Set to full opacity to allow drawing over transparent pixels.
    this.imageData.data[i + 3] = 255;
    this._pixels[y][x] = fillColor;
    const previousCount = (this._counter.get(previous) || 0) - 1;

    if (previousCount <= 0) {
      this._counter.delete(previous);
    } else {
      this._counter.set(previous, previousCount);
    }
    this._counter.set(fillColor, (this._counter.get(fillColor) || 0) + 1);

    return { left: x, top: y, right: x, bottom: y };
  }

  fill(x, y, fillColor) {
    let cur = []
    const queue = [[x, y]];
    const startColor = this.pick(x, y);
    const dirtyArea = { left: x, top: y, right: x, bottom: y };

    if (this.pick(x, y) === fillColor) {
      return null;
    }

    while ((cur = queue.pop())) {
      const [cx, cy] = cur;
      const currentColor = this.pick(cx, cy);

      if (currentColor !== startColor || currentColor === fillColor) {
        continue;
      }

      this.draw(cx, cy, fillColor);
      dirtyArea.left = Math.min(dirtyArea.left, cx);
      dirtyArea.right = Math.max(dirtyArea.right, cx);
      dirtyArea.top = Math.min(dirtyArea.top, cy);
      dirtyArea.bottom = Math.max(dirtyArea.bottom, cy);

      if (cx > 0) {
        queue.push([cx - 1, cy]);
      }
      if (cx < this.imageData.width - 1) {
        queue.push([cx + 1, cy]);
      }
      if (cy > 0) {
        queue.push([cx, cy - 1]);
      }
      if (cy < this.imageData.height - 1) {
        queue.push([cx, cy + 1]);
      }
    }

    return dirtyArea;
  }

  fillAll(x, y, fillColor) { return this.replaceColor(this.pick(x, y), fillColor) }

  replaceColor(originalColor, fillColor) {
    const dirtyArea = { left: 0, top: 0, right: 0, bottom: 0 };
    for (let x = 0; x < this.imageData.width; x++) {
      for (let y = 0; y < this.imageData.height; y++) {
        const color = this.pick(x, y);
        if (color === originalColor) {
          this.draw(x, y, fillColor);
          dirtyArea.left = Math.min(dirtyArea.left, x);
          dirtyArea.right = Math.max(dirtyArea.right, x);
          dirtyArea.top = Math.min(dirtyArea.top, y);
          dirtyArea.bottom = Math.max(dirtyArea.bottom, y);
        }
      }
    }
    return dirtyArea;
  }

  toDataURL() {
    const canvas = createCanvas(this);
    const ctx = getContext2D(canvas);

    ctx.putImageData(this.imageData, 0, 0);
    return canvas.toDataURL('image/png');
  }
  toImg() {
    const img = new Image();
    img.src = this.toDataURL();
    // Caution: assertTrue(img.complete) might be false!
    return img;
  }
  async toPngBlob() {
    const canvas = createCanvas(this);
    const ctx = getContext2D(canvas);
    ctx.putImageData(this.imageData, 0, 0);

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Empty blob'));
        }
      }, 'image/png');
    });
  }
}
