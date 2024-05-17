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

export function toHex(a) {
  if (!a) return '00';
  return a.toString(16).padStart(2, '0');
}
export function rgbToHex(r, g, b) {
  if (r > 255 || g > 255 || b > 255) {
    throw new Error(`Invalid color component ${r}, ${g}, ${b}`);
  }
  return `#${toHex(r) + toHex(g) + toHex(b)}`;
}

const HEX_REGEX = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;

export function hexToRgb(hex) {
  const result = HEX_REGEX.exec(hex);
  if (!result) {
    throw new Error(`Invalid color ${hex}`);
  }
  return [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16),
  ];
}

export function isLightColor(rgb) { }
export function isHexColor(hex) { }