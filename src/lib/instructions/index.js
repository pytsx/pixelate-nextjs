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

"use client"

import { produce } from "immer"
import { useEditor } from "../editor"



export function useInstructions() {
  const { state, setInstructionsState } = useEditor()

  const initialState = {
    instructions: state.instructionsState,
    indices: new Map(),
    colors: []
  }

  const [instructionsState, dispatchInstructions] = useReducer(instructionsReducer, initialState)

  const pixels = () => state.imageData.pixels
  const width = () => pixels()[0].length || 0
  const height = () => pixels().length
  const isHalf = (index, total) => Math.trunc(total / 2) === index

  const getIndex = (color) => {
    let index = instructionsState.indices.get(color)
    if (index === undefined) {
      index = String.fromCharCode('a'.charCodeAt(0) + this.indices.size);
      setIndice(color, index);
    }
    return index
  }

  const toggleCrossedColor = (color) => {
    dispatchInstructions({
      type: 'TOGGLE_CROSSED_COLOR',
      payload: { value: color }
    })
    setInstructionsState(instructionsState)
  }

  const toggleCrossedRow = (row) => {
    dispatchInstructions({
      type: 'TOGGLE_CROSSED_ROW',
      payload: { value: row }
    })
    setInstructionsState(instructionsState)
  }

  const toggleCrossedColumn = (column) => {
    dispatchInstructions({
      type: 'TOGGLE_CROSSED_COLUMN',
      payload: { value: column }
    })
    setInstructionsState(instructionsState)
  }

  const setIndice = (key, value) => {
    dispatchInstructions({
      type: 'SET_INDICE',
      payload: { key, value }
    })
  }


  return {
    toggleCrossedColumn,
    toggleCrossedRow,
    toggleCrossedColor
  }

}


