import * as React from 'react'
import type { CanvasReducerActions, CanvasReducerState } from "./canvasReducer"

interface ICanvasContext {
  state: CanvasReducerState
  dispatch: React.Dispatch<CanvasReducerActions>
}

const Context = React.createContext<ICanvasContext>

export function CanvasProvider({ }: React.PropsWithChildren): React.JSX.Element

export function useCanvas(): ICanvasContext