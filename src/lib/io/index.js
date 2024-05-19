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

export function showFileDialog(callback) {
  const input = document.createElement("input")
  input.type = "file"
  input.accept = "image/*"
  input.addEventListener("change", () => {
    if (input.files.length > 0) {
      for (let i = 0; i < input.files.length; i++) {
        const file = input.files.item(i)
        if (file.type.startsWith("image/")) {
          callback(file)
          return
        }
      }
      callback(input.files[0])
    }
  })

  input.click()
}

export async function decodeBase64(base64Data) {
  const blob = await fetch(base64Data).then((res) => res.blob());
  return new File([blob], 'file.png', { type: 'image/png' });
}

export async function loadImageFile(imageFile) {
  const img = new Image()
  img.src = URL.createObjectURL(imageFile)
  return waitForImage(img)
}

export async function waitForImage(img) {
  return new Promise((resolve, reject) => {
    img.onerror = (e) => {
      reject(e)
    }
    if (img.complete) {
      resolve(img)
    } else {
      img.onload = () => {
        resolve(img)
      }
    }
  })
}

export function downloadFile(file) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(file);
  a.download = file.name;
  a.click();
}

const STORAGE_KEY = "image-editor-data"