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
import {InstructionsState as IS} from "@/lib/editor"

export interface InstructionsState {
  textClasses: Map<HexColor, string>
  indices: Map<HexColor, string>
  colors: { color: HexColor; index: string; count: number }[]
  instructions: IS
}

export type InstructionsActions =
  | {
    type: "TOGGLE_CROSSED_COLOR"
    payload: {
      value: HexColor
    }
  } | {
    type: "TOGGLE_CROSSED_ROW"
    payload: {
      value: number
    }
  } | {
    type: "TOGGLE_CROSSED_COLUMN"
    payload: {
      value: number
    }
  } | {
    type: "SET_INDICE"
    payload: {
      key: HexColor
      value: string
    }
  } | {
    type: "SET_TEXT_CLASS"
    payload: {
      key: HexColor
      value: string
    }
  } | {
    type: "SET_COLOR"
    payload: {
      value: { color: HexColor; index: string; count: number }
    }
  }

export function instructionsReducer(state: InstructionsState, action: InstructionsActions): InstructionsState
