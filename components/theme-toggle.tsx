"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Button } from "@mui/material"
import {WbSunny, WbTwilight} from "@mui/icons-material"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <Button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <WbSunny className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      {/* <WbTwilight className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" /> */}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
