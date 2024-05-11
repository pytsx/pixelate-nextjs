"use client"

import * as React from "react"
import { editorReducer, getInitialState } from "./editorReducer"

const Context = React.createContext({})

export function EditorProvider(props) {
  const { children } = props
  const initialState = getInitialState()
  const [state, dispatch] = React.useReducer(editorReducer, initialState)

  return (
    <Context.Provider value={{
      state,
      dispatch
    }}>
      {children}
    </Context.Provider>
  )
}


export function useEditor() {
  const context = React.useContext(Context)

  if (!context) {
    throw new Error("useCanvas must be used within a CanvasProvider")
  }

  return context
}