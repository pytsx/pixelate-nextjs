
import { produce } from "immer"

export function getInitialState() {

  // let matrix = []
  // matrix.length = rowSize

  // const rows = []
  // rows.length = colSize
  // rows.fill(-1)

  // matrix.fill(rows)

  const initialState = {
    name: "Pixelate",
  }

  return initialState
}



export function editorReducer(state, action) {
  return produce(state, (draft) => {
    switch (action.type) {
      case "RENAME":
        draft.name = action.payload.value
        break
      default:
        break
    }
  })
}