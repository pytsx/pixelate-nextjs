"use client"
import { useEditor } from "@/provider"
import Typography from "@mui/material/Typography"
import React from "react"

export function Title() {
  const { state, dispatch } = useEditor()

  function rename(e: React.FocusEvent<HTMLSpanElement, Element>) {
    const context = e.target.innerText

    dispatch({
      type: "RENAME",
      payload: {
        value: context
      }
    })
  }

  return (
    <Typography
      sx={{
        userSelect: "none",
        fontSize: "1rem",
        lineHeight: "2.4rem",
        padding: "0 1rem",
        maxWidth: "300px",
        lineClamp: 1,
        whiteSpace: "nowrap",
        overflow: "hidden",
        "&:focus": {
          maxWidth: "100%",

        }
      }}
      color="text.primary"
      contentEditable
      dangerouslySetInnerHTML={{ __html: state.name }}
      onBlur={rename}
    />
  )
}
