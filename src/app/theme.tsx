"use client"

import type { } from '@mui/material/themeCssVarsAugmentation';

import {
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
          default: "#3d3d3d",
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
        position: "absolute"
      },
      styleOverrides: {
        root: {
        }
      }
    },
    MuiToolbar: {
      defaultProps: {
        variant: "dense",
        disableGutters: true
      },
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: theme.shape.borderRadius,
          padding: ".125rem .75rem",
        })
      }
    }
  }
})