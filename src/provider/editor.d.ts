import * as React from 'react'
import type { EditorReducerActions, EditorReducerState } from "./editorReducer"

interface IEditorContext {
  state: EditorReducerState
  dispatch: React.Dispatch<EditorReducerActions>
}

const Context = React.createContext<IEditorContext>

export function EditorProvider({ }: React.PropsWithChildren): React.JSX.Element

export function useEditor(): IEditorContext