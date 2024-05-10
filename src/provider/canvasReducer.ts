
export type CanvasReducerState = {
  name: string
  selectedColor: number,
  matrix: number[][]
}

export type CanvasReducerActions =
  | {
    type: "RENAME",
    payload: {
      value: string
    }
  } | {
    type: "SELECT_COLOR",
    payload: {
      value: number
    }
  } | {
    type: "FILL_CELL",
    payload: {
      x: number
      y: number
      value: number
    }
  }


export function canvasReducer(state: CanvasReducerState, action: CanvasReducerActions): CanvasReducerState {
  switch (action.type) {
    case "RENAME":
      return {
        ...state,
        name: action.payload.value
      }
    case "SELECT_COLOR":
      return {
        ...state,
        selectedColor: action.payload.value
      }
    case "FILL_CELL":
      return {
        ...state,
        matrix: state.matrix.map((row, rowIndex) => {
          if (rowIndex === action.payload.y) {
            return row.map((cell, cellIndex) => {
              if (cellIndex === action.payload.x) {
                return action.payload.value
              }
              return cell
            })
          }
          return row
        })
      }
    default:
      return state
  }
}