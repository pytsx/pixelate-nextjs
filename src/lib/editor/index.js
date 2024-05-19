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

import { downloadFile, loadImageFile, showFileDialog } from "../io"
import { getImageData, hasImageData } from "../image"
import { useStore } from "../store"
import { useCanvas } from "../canvas"

export const Mode = {
  NEW: "n",
  PREPROCESS: "p",
  DRAW: "d",
  ASSEMBLE: "a"
}

export const Tool = {
  DRAW: "DRAW",
  FILL: "FILL",
  FILL_ALL: "FILL_ALL"
}


export const useEditor = () => {
  const {
    store,
    setMode,
    setImageData,
    reset,
  } = useStore()


  async function openImageFile(file) {
    setMode("p")
    const img = await loadImageFile(file)
    const imageData = getImageData(img)
    setImageData(imageData)

  }

  function newFile() { reset() }
  function uploadFile() { showFileDialog((file) => openImageFile(file)) }
  function copyImage() { }

  function openDrawMode() {
    const image = new ImageData(80, 80)
    image.data.fill(255)

    setImageData(image)
    setMode("p")
  }


  async function downloadPng() {
    if (!hasImageData(store)) {
      throw new Error('copyImage requires imageData.');
    }
    const blob = await store.imageData.toPngBlob();
    const date = new Date().toISOString().slice(0, 10);
    const file = new File([blob], `pixelate-${date}.png`);
    downloadFile(file);
  }

  function undo() { }

  // getters 
  const isMobile = () => {
    getComputedStyle(document.documentElement)
      .getPropertyValue("--mobile")
      .trim() === '1'
  }
  const hasImage = () => hasImageData(store)


  return {
    openImageFile,
    newFile,
    openDrawMode,
    uploadFile,
    downloadPng,
    copyImage,
    isMobile,
    hasImage,
  }
}