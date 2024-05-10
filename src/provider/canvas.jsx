"use client"

import * as React from "react"
import { canvasReducer } from "./canvasReducer"

const Context = React.createContext({})

let matrix = []
matrix.length = 32

const rows = []
rows.length = 32
rows.fill(-1)

matrix.fill(rows)

const initialState = {
  name: "teste",
  matrix,
  selectedColor: 0
}

export function CanvasProvider(props) {
  const { children } = props

  const [state, dispatch] = React.useReducer(canvasReducer, initialState)


  return (
    <Context.Provider value={{
      state,
      dispatch
    }}>
      {children}
    </Context.Provider>
  )
}


export function useCanvas() {
  const context = React.useContext(Context)

  if (!context) {
    throw new Error("useCanvas must be used within a CanvasProvider")
  }

  return context
}