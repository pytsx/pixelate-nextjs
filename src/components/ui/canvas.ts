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

import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";

export const CanvasRoot = styled("canvas", {
  name: "canvas",
  slot: "root",
})(({ theme }) => ({
  overflow: "hidden",
  // cursor: "crosshair",
  imageRendering: "pixelated",
  boxShadow: "0px 4px 6px 1px #2d2d2d24",
  borderRadius: "4px"
}))

export const CanvasBox = styled(Box)(() => ({
  maxHeight: "calc(100vh - 3.2rem)",
  maxWidth: "100vw",
  height: "100%",
  width: "100%",
  overflow: "auto",
  display: "flex",
  alignItems: "start",
  justifyContent: "center",
  scrollbarGutter: "stable",
  scrollbarWidth: "thin",
  padding: "2rem 0 ",
}))