"use client" 

 
 import { useEffect, useRef } from "react"
 import anime from "animejs"
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
  Tooltip,
  TextField,
  Stack,
  Alert,
  AlertTitle,
  Slider,
  Modal,
} from "@mui/material";
export default function Layout({ children }: { children: React.ReactNode }) {
 
  const Ref = useRef(null)
  useEffect(() => {
    const element = Ref.current

    if (element) {
      anime({
        targets: element,

        opacity: [0, 1],
        duration: 700,
        easing: 'easeOutSine',
      })
    }
  }, [])

  return (
    <div ref={Ref}>
        <div className="flex w-full justify-start items-center">
          <div className="mt-4 text-xl ">
 
              Personality Test
           
            </div>
            </div>
      <div >{children}</div>
    </div>
  )
}

