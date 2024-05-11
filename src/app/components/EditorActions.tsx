"use client"
import { useEditor } from "@/provider";
import { colorsMap } from "@/provider/colorsMap";
import { darken, alpha } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";


function ColorPicker() {
  const { state, dispatch } = useEditor()
  function selectColor(colorIndex: number) {
    dispatch({
      type: "SELECT_COLOR",
      payload: {
        value: colorIndex
      }
    })
  }

  return (
    <Stack gap={.4}>

      {
        Object.keys(colorsMap).map((color) => (
          <Button
            key={`color-picker-${color}`}
            variant="contained"
            onClick={() => selectColor(parseInt(color))}
            sx={{
              backgroundColor: colorsMap[color],
              border: "1px solid",
              borderColor: colorsMap[color],
              "&:hover": {
                backgroundColor: alpha(colorsMap[color], .3),
                borderColor: darken(colorsMap[color], .3),
              },
              height: "2rem",
            }}
          >
          </Button>
        ))
      }
    </Stack>
  )
}

function Eraser() {
  const { state, dispatch } = useEditor()


  function selectColor() {
    dispatch({
      type: "SELECT_COLOR",
      payload: {
        value: -1
      }
    })
  }

  return <Button
    onClick={selectColor}
    variant="outlined">
    🧼
  </Button>
}


function Reset() {
  const { dispatch } = useEditor()


  function resetMatrix() {
    dispatch({
      type: "RESET_MATRIX",
    })
  }

  return <Button
    onClick={resetMatrix}
    variant="contained"
    color="error"
  >
    reset
  </Button>

}

export function EditorActions() {
  const { state } = useEditor()

  return (
    <Box sx={{
      mt: 8,
      px: 2,
      display: "flex",
      flexDirection: "column",
      gap: 1,
      position: "absolute",
    }}>
      <Reset />
      <Eraser />
      {colorsMap[state.selectedColor] && <Button
        key={`color-picker-${state.selectedColor}`}
        variant="contained"
        sx={{
          border: "1px solid",
          backgroundColor: alpha(colorsMap[state.selectedColor], .3),
          borderColor: darken(colorsMap[state.selectedColor], .3),
          marginBottom: 1,
          "&:hover": {
            backgroundColor: colorsMap[state.selectedColor],
            borderColor: colorsMap[state.selectedColor],
          },
          height: "2rem",
        }}
      />}
      <ColorPicker />
    </Box>
  )
}