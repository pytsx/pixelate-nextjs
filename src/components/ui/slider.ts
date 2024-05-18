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

import { default as MuiSlider } from "@mui/material/Slider";

import { styled } from "@mui/material/styles";

const Slider = styled(MuiSlider)(({ theme }) => ({
  height: "100%",
  cursor: "grab",
  '& .MuiSlider-track': {
    border: 'none',
  },
  '& .MuiSlider-thumb': {
    height: 12,
    width: 12,
    boxShadow: '0px 1px 2px 0px #1d1d1d80',
    transform: 'translate(-50%, 50%) scale(1)',
    transition: "all 150ms ease-out",
    '&:hover,  &.Mui-active': {
      transform: 'translate(-150%, 50%)',
      borderColor: 'transparent',
      backgroundColor: 'transparent',
      cursor: "grabbing",
    },
    '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
      boxShadow: 'inherit',
    },
    '&::before': {
      display: 'none',
    },
  },
  '& .MuiSlider-valueLabel': {
    lineHeight: 1.2,
    fontSize: 12,
    background: 'unset',
    padding: 0,
    width: 32,
    height: 32,
    borderRadius: '50%',
    transformOrigin: 'center center',
    backgroundColor: theme.palette.primary.main,
    transform: 'translate(100%, -50%) rotate(-45deg) scale(0)',
    transition: "all 150ms ease-in",
    '&::before': { display: 'none' },
    '&.MuiSlider-valueLabelOpen': {
      borderRadius: '50% 50% 0 50%',
      transform: 'translate(80%, -50%) rotate(-45deg) scale(1)',
    },
    '& > *': {
      transform: 'rotate(45deg)',
    },
  },
}));

Slider.displayName = "Slider"

export {
  Slider
}