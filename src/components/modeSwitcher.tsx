"use client"

import IconButton from "@mui/material/IconButton"
import { useColorScheme } from "@mui/material/styles"
import React from "react"

export const ModeSwitcher = () => {
  const [mounted, setMounted] = React.useState<boolean>(false)
  const { setMode, mode } = useColorScheme()

  const toggleMode = () => setMode(mode == "dark" ? "light" : "dark")

  React.useEffect(() => setMounted(true), [])

  if (!mounted) {
    // for ssr
    return null
  }
  return (
    <IconButton onClick={toggleMode} >
      {mode == "dark" ? "🌞" : "🌜"}
    </IconButton>
  )
}