"use client"

import IconButton from "@mui/material/IconButton"
import { useColorScheme } from "@mui/material/styles"
import React from "react"

export const ModeSwitcher = () => {
  const [mounted, setMounted] = React.useState<boolean>(false)
  const { setMode, mode } = useColorScheme()

  const toggleMode = () => setMode(mode !== "dark" ? "dark" : "light")

  React.useEffect(() => setMounted(true), [])

  if (!mounted) {
    // for ssr
    return <div style={{ height: "3rem", width: "3rem" }} />
  }
  return (
    <IconButton onClick={toggleMode} >
      {mode == "dark" ? "🌞" : "🌜"}
    </IconButton>
  )
}