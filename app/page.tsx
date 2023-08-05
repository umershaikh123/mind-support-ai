"use client"

import { useChat } from "ai/react"
import { useState, useRef, useEffect } from "react"
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  makeStyles,
  Stack,
  Tooltip,
  Paper,
} from "@mui/material"
import { ThemeProvider } from "@mui/material"
import { theme } from "@/theme/theme"
import { Body } from "@/components/Body"
import { Settings } from "@/components/Settings"
import { LoadingScreen } from "@/components/Loading"
import anime from "animejs"
import { Navbar } from "@/components/Navbar"
import { kv } from '@vercel/kv'

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat()
  const [isLoading, setIsLoading] = useState(true)
  const Ref = useRef(null)

  useEffect(() => {
    const ref = Ref.current

    anime({
      targets: ref,

      opacity: [0, 1],
      easing: "easeInOutSine",
      duration: 300,
    })
  }, [isLoading])

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false)
    }, 3400) // Adjust the duration as needed
  }, [])

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <div className="" ref={Ref}>
      <Navbar />
      <ThemeProvider theme={theme}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={5}
          sx={{ mt: 5 }}
        >
                    <Box
            sx={{
              flexGrow: 0,
              flexBasis: "15rem",
              flexShrink: 10,
              // display : "flex",
              display: { xs: "none", sm: "flex" },
              height: "75vh",
              background: theme.palette.secondary.main,
            }}
          >
            <Settings />
          </Box>
          <Box
            sx={{
              flexGrow: 2,
              flexBasis: "70rem",
              flexShrink: 3,

              height: "75vh",
              background: theme.palette.secondary.main,
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontSize: "24px",
                whiteSpace: "nowrap",
              }}
            >
              <Body />
            </Typography>
            {/* {children} */}
          </Box>
 
        </Stack>
      </ThemeProvider>
    </div>
  )
}
