"use client"
import { useCanvas } from "@/provider";
import { colorsMap } from "@/provider/colorsMap";
import { darken, alpha } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

export function ColorPicker() {
  const { state, dispatch } = useCanvas()
  function selectColor(colorIndex: number) {
    dispatch({
      type: "SELECT_COLOR",
      payload: {
        value: colorIndex
      }
    })
  }

  return (
    <Box>
      <Stack sx={{ mt: 8, px: 2 }} gap={.4}>
        <Button
          key={`color-picker-${state.selectedColor}`}
          variant="contained"
          sx={{
            border: "1px solid",
            backgroundColor: alpha(colorsMap[state.selectedColor], .3),
            borderColor: darken(colorsMap[state.selectedColor], .3),
            marginBottom: 2,
            "&:hover": {
              backgroundColor: state.selectedColor,
              borderColor: state.selectedColor,
            },
            height: "2rem",
          }}
        />
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
    </Box>
  )
}