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

import { getContext2D } from "../utils";

export class EditableCanvas {
  constructor(
    canvas,
    imageData
  ) {
    this._imageData = imageData;
    this._canvas = canvas;
    this._canvas.width = this._imageData.width;
    this._canvas.height = this._imageData.height;
    this._ctx = getContext2D(this._canvas)
    this._ctx.fillStyle = "#ffffff"
    this._ctx.fillRect(0, 0, imageData.width, imageData.height);
    this.redraw();
  }

  get width() {
    return this._imageData.width;
  }

  get height() {
    return this._imageData.height;
  }
  get counter() {
    return this._imageData.counter;
  }
  get imageData() {
    return this._imageData;
  }

  setImageData(img) {
    this._imageData = img;
    this._canvas.width = this._imageData.width;
    this._canvas.height = this._imageData.height;
    this.redraw();
  }

  redraw(dirtyArea) {
    let temp = dirtyArea || {
      left: 0,
      top: 0,
      right: this.width - 1,
      bottom: this.height - 1,
    };
    this._ctx.putImageData(
      this._imageData.imageData,
      0,
      0,
      temp.left,
      temp.top,
      temp.right - temp.left + 1,
      temp.bottom - temp.top + 1
    );
  }

  pick(x, y) {
    return this._imageData.pick(x, y);
  }

  // applyMany(operations) {
  //   const dirty = operations.reduce(
  //     (dirtyArea, operation) =>
  //       mergeDirtyAreas(dirtyArea, this.apply(this._imageData, operation)), null
  //   );
  //   if (dirty) {
  //     this.redraw(dirty);
  //   }
  // }

  // apply(imageData, operation) {
  //   const { tool, color, x, y } = operation
  //   if (tool === Tool.DRAW) {
  //     return imageData.draw(x, y, color);
  //   } else if (tool === Tool.FILL) {
  //     return imageData.fill(x, y, color);
  //   } else if (tool === Tool.MAGIC_WAND) {
  //     return imageData.fillAll(x, y, color);
  //   } else {
  //     throw new Error(`Unknown tool ${tool}`);
  //   }
  // }
}