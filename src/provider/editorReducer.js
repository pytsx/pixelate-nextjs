
import { produce } from "immer"

export function getInitialState(rowSize = 32, colSize = 32) {

  let matrix = []
  matrix.length = rowSize

  const rows = []
  rows.length = colSize
  rows.fill(-1)

  matrix.fill(rows)

  const initialState = {
    name: "Pixelate",
    matrix,
    selectedColor: 0
  }

  return initialState
}



export function editorReducer(state, action) {
  return produce(state, (draft) => {
    switch (action.type) {
      case "RENAME":
        draft.name = action.payload.value
        break
      case "SELECT_COLOR":
        draft.selectedColor = action.payload.value
        break
      case "FILL_CELL":
        draft.matrix[action.payload.y][action.payload.x] = action.payload.value
        break
      case "RESET_MATRIX":
        draft.matrix = getInitialState(draft.matrix.length, draft.matrix[0].length).matrix
        break
      default:
        break
    }
  })
}