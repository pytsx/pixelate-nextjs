
export type EditorReducerState = {
  name: string
  selectedColor: number,
  matrix: number[][]
}

export type EditorReducerActions =
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
  } | { type: "RESET_MATRIX" }

/**
 * @param {number} rowSize the matrix row size
 * @param {number} colSize the matrix column size
 */
export function getInitialState(rowSize: number, colSize: number): EditorReducerState

export function editorReducer(state: EditorReducerState, action: EditorReducerActions): EditorReducerState 