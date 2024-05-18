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

import React from "react"

import Button from "@mui/material/Button"
import Popover from "@mui/material/Popover"

import { alpha, darken, getContrastRatio, lighten } from "@mui/material/styles"
import { SketchPicker } from "react-color"
import { Palette } from "lucide-react"

interface ColorPickerProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  color: string
  setColor: (color: string) => void
  presetColors?: string[]
}

const ColorPicker = React.forwardRef<HTMLDivElement, ColorPickerProps>(
  ({ color, setColor, presetColors }, ref) => {
    const [colorpickerAnchorEl, setColorpickerAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const [bufferColor, setBufferColor] = React.useState<string | null>(null)

    const handleClickColorpicker = (event: React.MouseEvent<HTMLButtonElement>) => {
      setColorpickerAnchorEl(event.currentTarget);
    };

    const handleCloseColorpicker = () => {
      setColorpickerAnchorEl(null);
    };
    const openColorPicker = Boolean(colorpickerAnchorEl);
    const colorpickerPopoverId = openColorPicker ? 'colorpicker-popover' : undefined;

    const iconTextColor = React.useCallback(() => {
      return getContrastRatio(
        color || "#fff", "#000") > 4
        ? darken(color || "#fff", .6)
        : lighten(color || "#fff", .6)
    }, [color || "#fff"])

    const iconStyle = {
      width: "1rem",
      height: "1rem",
    }


    return (
      <React.Fragment>
        <Button
          disableFocusRipple
          disableTouchRipple
          disableElevation
          variant="contained"
          aria-describedby={colorpickerPopoverId}
          onClick={handleClickColorpicker}
          sx={{
            position: "relative",
            overflow: "clip",
            backgroundColor: color || "#fff",
            "&:hover": {
              backgroundColor: alpha(color || "#fff", .6),
            }
          }}>
          <Palette style={{ ...iconStyle, color: iconTextColor() }} />
        </Button>
        <Popover
          open={openColorPicker}
          id={colorpickerPopoverId}
          anchorEl={colorpickerAnchorEl}
          onClose={handleCloseColorpicker}
          anchorOrigin={{
            vertical: 'center',
            horizontal: 'left',
          }}
        >

          <SketchPicker
            presetColors={presetColors ? presetColors : undefined}
            onChangeComplete={(e) => {
              setColor(e.hex)
              setBufferColor(null)
            }}
            onChange={(e) => {
              setBufferColor(e.hex)
            }}
            disableAlpha
            color={bufferColor || color || "#fff"}
          />
        </Popover>
      </React.Fragment>
    )
  })

ColorPicker.displayName = "ColorPicker"
export {
  ColorPicker
}