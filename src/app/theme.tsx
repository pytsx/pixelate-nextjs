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

import type { } from '@mui/material/themeCssVarsAugmentation';

import {
  alpha,
  createTheme,
  type PaletteMode
} from "@mui/material";

import {
  experimental_extendTheme as extendTheme
} from "@mui/material/styles";

const defaultTheme = createTheme()


function getDesignTokens(mode: PaletteMode) {
  return {
    palette: {
      ...defaultTheme.palette,
      mode,
      text: {
        primary: "#3d3d3d",
        secondary: "#1d1d1d",
        ...(mode == "dark" && {
          primary: "#9d9d9d",
          secondary: "#6d6d6d",
        })
      },
      background: {
        default: "#f5f5f5",
        paper: "#fff",
        ...(mode == "dark" && {
          default: "#1d1d1d",
          paper: "#1d1d1d",
        })
      }
    }
  }
}

const { palette: lightPalette, ...rest } = getDesignTokens("light")
const colorSchemes = {
  light: {
    palette: lightPalette
  },
  dark: {
    palette: getDesignTokens("dark").palette
  }
}

export default extendTheme({
  colorSchemes,
  ...rest,
  shape: {
    borderRadius: 2
  },
  components: {
    MuiAppBar: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: (({ theme }) => ({
          backgroundColor: "#fff",
          borderBottom: '1px solid',
          borderColor: theme.palette.grey[400],
          ...theme.applyStyles("dark", {
            backgroundColor: "#1d1d1d",
            borderColor: theme.palette.grey[700],
          })
        }))
      }
    },
    MuiToolbar: {
      defaultProps: {
        variant: "dense",
        disableGutters: true,
      },
      styleOverrides: {
        root: ({ theme }) => ({
          padding: ".125rem .75rem",
        })
      }
    },
    MuiDrawer: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        paper: ({ theme }) => ({
          paddingTop: "3.2rem",
          border: "none",
          backgroundColor: alpha("#ffffff", .5),
          backdropFilter: "blur(1rem)",
          ...theme.applyStyles("dark", {
            backgroundColor: alpha("#000000", .5),
          })
        })
      },
    },
    MuiButton: {
      styleOverrides: {
        root: () => ({
          width: "fit-content",
          minWidth: "2.4rem",
          padding: ".8rem",
        })
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: ({ theme }) => ({
          backgroundColor: "#fff",
          boxShadow: "none",
          ...theme.applyStyles("dark", {
            backgroundColor: "#000",
          })
        })
      }
    },
    MuiIconButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.grey[800],
          ...theme.applyStyles("dark", {
            color: theme.palette.grey[400],
          })
        })
      }
    }
  }
})