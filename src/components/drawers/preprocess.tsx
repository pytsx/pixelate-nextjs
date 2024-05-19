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


import Box from "@mui/material/Box"
import Drawer from "@mui/material/Drawer"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"

import { Mode, usePreprocess, useStore } from "@/lib"
import { Slider } from "../ui"

function PreprocessDrawer() {
  const {
    store,
    setMode,
  } = useStore()

  const {
    setTargetWidth,
    targetWidth,
    maxTargetWidth,
    setTargetColor,
    maxTargetColors,
    targetColors,
    targetHeight,
    realHeight,
    realWidth
  } = usePreprocess()


  function handleTargetWidthChange(e: any, newValue: number | number[]) {
    if (store.imageData) {
      setTargetWidth(typeof newValue == "number" ? newValue : 0)
    }
  }

  function handleTargetColorsChange(e: any, newValue: number | number[]) {
    if (store.imageData) {
      setTargetColor(typeof newValue == "number" ? newValue : 0)
    }
  }

  return (
    <Drawer
      open={store.mode === Mode.PREPROCESS}
      onClose={() => setMode(Mode.DRAW)}
      variant="persistent"
    >
      {
        store.imageData && <Box sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
          height: "100%",
          alignItems: "center",
          gap: 4,
          padding: "2rem 1rem",
          width: "fit-content",
        }}>
          <Slider
            orientation="vertical"
            onChangeCommitted={(e, value) => {
              handleTargetWidthChange(e, value)
            }}
            onChange={handleTargetWidthChange}
            value={targetWidth}
            min={8}
            max={maxTargetWidth()}
            step={1}
            valueLabelDisplay="auto"
          />
          <Slider
            orientation="vertical"
            onChangeCommitted={(e, value) => {
              handleTargetColorsChange(e, value)
            }}
            onChange={handleTargetColorsChange}
            value={targetColors}
            min={2}
            max={maxTargetColors()}
            step={1}
            valueLabelDisplay="auto"
          />

          <Stack alignItems={"center"} sx={{ minWidth: "6rem" }}>
            <Typography>
              {targetWidth} x {targetHeight()} <br />
            </Typography>
            <Typography variant="caption">
              {realWidth()}cm x {realHeight()}cm
            </Typography>
          </Stack>
        </Box >
      }
    </Drawer>
  )
}

PreprocessDrawer.displayName = "PreprocessDrawer"

export { PreprocessDrawer }