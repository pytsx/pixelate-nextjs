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

import React from 'react';
import { EditableImageData, downscale } from '../image';
import { getContext2D, requireNonNull } from '../utils';
import { useStore } from '../store';

export function usePreprocess() {
  const { store, setCanvasImageData } = useStore()
  const minTargetWidth = 8

  const [targetColors, _setTargetColors] = React.useState(30)
  const [targetWidth, _setTargetWidth] = React.useState(minTargetWidth)

  React.useEffect(() => {
    if (store.imageData) {
      ngOnInit()
    }
  }, [store.imageData])

  React.useEffect(() => {
    if (store.imageData && store.canvas) {
      ngOnChanges()
    }
  }, [targetWidth, targetColors, store.canvas])


  const setTargetWidth = (value) => _setTargetWidth(value)
  const setTargetColor = (value) => _setTargetColors(value)

  const maxTargetColors = () => Math.min(30, store.imageData?.counter.size || 30);

  const targetHeight = () => {
    return Math.round(
      (store.imageData?.height / store.imageData?.width) * targetWidth
    );
  }

  const maxTargetWidth = () => {
    return Math.min(80, (store.imageData?.width || 80))
  }

  const realWidth = () => Math.floor(targetWidth * 7.6);
  const realHeight = () => Math.floor(targetHeight() * 7.6);

  const ngOnInit = () => {
    requireNonNull(store.imageData);
    let _targetWidth = store.imageData.width;

    if (_targetWidth === 0) {
      throw new Error('targetWidth is 0');
    }
    while (_targetWidth > maxTargetWidth()) {
      _targetWidth /= 2;
    }
    while (_targetWidth < minTargetWidth) {
      _targetWidth *= 2;
    }

    _setTargetWidth(Math.round(_targetWidth))
  }

  const ngOnChanges = () => {
    const canvas = document.querySelector('canvas')
    const ctx = getContext2D(canvas)
    if (!canvas || !ctx || !store.imageData) return;

    const _targetHeight = Math.round(
      (store.imageData?.height / store.imageData?.width) * targetWidth
    );

    ctx.canvas.width = targetWidth;
    ctx.canvas.height = _targetHeight;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, targetWidth, _targetHeight);

    const scaledImageData = new EditableImageData(
      ctx.getImageData(0, 0, targetWidth, _targetHeight)
    )

    downscale(store.imageData, scaledImageData, targetColors);

    ctx.putImageData(scaledImageData.imageData, 0, 0);

    setCanvasImageData(scaledImageData)
  }

  return {
    maxTargetColors,
    minTargetWidth,
    targetColors,
    realWidth,
    realHeight,
    ngOnInit,
    ngOnChanges,
    setTargetWidth,
    maxTargetWidth,
    setTargetColor,
    targetWidth,
    targetHeight
  }
} 