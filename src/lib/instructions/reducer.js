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

export const instructionsReducer = (state, action) => {
  return produce(state, draft => {
    switch (action.type) {
      case 'TOGGLE_CROSSED_COLOR':
        if (draft.crossedOutColors.has(action.payload.value)) {
          draft.crossedOutColors.delete(action.payload.value)
        } else {
          draft.crossedOutColors.add(action.payload.value)
        }
        break
      case 'TOGGLE_CROSSED_ROW':
        if (draft.crossedOutRows.has(action.payload.value)) {
          draft.crossedOutRows.delete(action.payload.value)
        } else {
          draft.crossedOutRows.add(action.payload.value)
        }
        break
      case 'TOGGLE_CROSSED_COLUMN':
        if (draft.crossedOutColumns.has(action.payload.value)) {
          draft.crossedOutColumns.delete(action.payload.value)
        } else {
          draft.crossedOutColumns.add(action.payload.value)
        }
        break
      case 'SET_INDICE':
        draft.indices.set(action.payload.key, action.payload.value)
        break
      case 'SET_TEXT_CLASS':
        draft.textClasses.set(action.payload.key, action.payload.value)
        break
      case 'SET_COLOR':
      default:
        break
    }
  })
}