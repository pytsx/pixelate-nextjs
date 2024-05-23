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

import { EditableImageData, getImageData } from "../image";
import { isHexColor } from "./ColorManipulation";
import { decodeBase64, loadImageFile } from "../io"

const QUERY_KEYS = {
  activeColor: 'c',
  image: 'b',
  mode: 'm',
}

function parseNumberArray(str) {
  return str
    .split(',')
    .map((s) => Number(s))
    .filter((n) => !isNaN(n));
}

export async function deserializeState(
  str
) {
  const params = new URLSearchParams(str);

  const image = params.get(QUERY_KEYS['image']);
  const mode = params.get(QUERY_KEYS['mode']);
  const state = {
    // imageData,
    mode,
  };


  if (
    image &&
    image.startsWith('data:image/png;base64,')
  ) {
    const file = await decodeBase64(image);
    const img = await loadImageFile(file);
    const imageData = getImageData(img)
    state.imageData = imageData
  }

  const activeColor = params.get(QUERY_KEYS['activeColor']);
  if (activeColor && isHexColor(activeColor)) {
    state.canvasEditorState.activeColor = activeColor;
  }
  return state;
}

export function serializeState(state) {
  const result = new URLSearchParams({
    [QUERY_KEYS['activeColor']]: state.canvasEditorState.activeColor,
    [QUERY_KEYS['image']]: state.canvas?.imageData && state.canvas.imageData?.toDataURL() || new EditableImageData(new ImageData(80, 80)).toDataURL(),
    [QUERY_KEYS['mode']]: state.mode,
  }).toString();
  // console.log(result)
  return result
}