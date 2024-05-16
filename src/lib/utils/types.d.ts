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

export function requireNonNull<T>(value: T | null | undefined, msg?: string): NonNullable<typeof value>
export function requireTruthy<T>(value: T | null | undefined, msg?: string): TruthyTypesOf<T | null | undefined>
export function assert<T>(value: T | null | undefined, msg?: string): asserts value is TruthyTypesOf<T>
export function assertTrue(value: boolean | null | undefined, msg?: string): asserts value is true

export function isEnum<T extends string>(value: string | null | undefined, enumType: StringEnum<T>): value is T

export interface StringEnum<T> {
  [id: string]: T | string
}

export type DeepPartial<T> = T extends Object ? {
  [P in keyof T]?: DeepPartial<T[P]>
} : T

