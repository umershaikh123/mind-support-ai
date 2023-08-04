"use client"

import React, { useState, useRef, useEffect, useCallback } from "react"
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
  Slider,
  Modal,
} from "@mui/material"
import PlayCircleIcon from "@mui/icons-material/PlayCircle"
import PauseCircleIcon from "@mui/icons-material/PauseCircle"
import PlayArrowIcon from "@mui/icons-material/PlayArrow"
import PauseIcon from "@mui/icons-material/Pause"
import { callElevenLabsTextToSpeechAPI } from "@/utils/SpeechApi"
import { RingLoader, BeatLoader } from "react-spinners"
import { theme } from "@/theme/theme"
import anime from "animejs"
import CustomizedAccordions from "./Accordion"
import { useApiContext, ApiProvider } from "@/hooks/ApiContext"

interface ApiProps {
  text: string
  model_id: string
  Accent: string
  stability: number
  similarity_boost: number
}

const AudioPlayer = (props: ApiProps) => {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isPlaying, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0.0)
  const [duration, setDuration] = useState(0.0)
  const [_loading, _setLoading] = useState(true) // Add the loading state
  const { loading, setLoading } = useApiContext()
  const [loaded, setLoaded] = useState(false) // Add the loaded state
  const ref = useRef<HTMLDivElement | null>(null)

  const Props: ApiProps = {
    text: props.text,
    model_id: props.model_id,
    Accent: props.Accent,
    stability: props.stability,
    similarity_boost: props.similarity_boost,
  }
  useEffect(() => {
    const Reveal = ref.current

    if (Reveal && loaded) {
      // Animation using anime.js, only when loaded
      anime({
        targets: Reveal,

        opacity: [0, 1],
        duration: 1200,
        easing: "easeOutSine",
      })
    }
  }, [loaded])

  useEffect(() => {
    // Update the loaded state when audioUrl is not null
    if (audioUrl) {
      setLoaded(true)
    }
  }, [audioUrl])

  useEffect(() => {
    // Fetch audio URL when the component mounts
    const fetchAudioUrl = async () => {
      try {
        setLoading(true)
        const url = await callElevenLabsTextToSpeechAPI(Props) // Replace with your API call
        setAudioUrl(url || null)
      } catch (error) {
        console.error("Error fetching audio URL:", error)
      } finally {
        _setLoading(false) // Once the API call is completed (success or error), set loading to false
        setLoading(false)
      }
    }
    fetchAudioUrl()
  }, [])

  const handlePlayPause = useCallback(() => {
    const audioElement = audioRef.current
    if (audioElement?.paused) {
      audioElement?.play()
    } else {
      audioElement?.pause()
    }
    setPlaying(!isPlaying)
  }, [isPlaying])

  const handleSliderChange = useCallback(
    (_event: Event, value: number | number[]) => {
      const newValue = value as number
      setCurrentTime(newValue)
      if (audioRef.current) {
        audioRef.current.currentTime = newValue
      }
    },
    []
  )

  useEffect(() => {
    const audioElement = audioRef.current

    const handleTimeUpdate = () => {
      setCurrentTime(audioElement?.currentTime || 0.0)
    }

    const handleLoadedMetadata = () => {
      setDuration(audioElement?.duration || 0.0)
    }

    const handleEnded = () => {
      setPlaying(false)
      setCurrentTime(0)
    }

    audioElement?.addEventListener("timeupdate", handleTimeUpdate)
    audioElement?.addEventListener("loadedmetadata", handleLoadedMetadata)
    audioElement?.addEventListener("ended", handleEnded)
    return () => {
      audioElement?.removeEventListener("timeupdate", handleTimeUpdate)
      audioElement?.removeEventListener("loadedmetadata", handleLoadedMetadata)
      audioElement?.removeEventListener("ended", handleEnded)
    }
  }, [audioUrl])

  if (_loading) {
    return (
      <div>
        <BeatLoader color="#ffffff" size={10} loading={_loading} className="ml-5" />
      </div>
    )
  }

  function formatTime(timeInSeconds: number): string {
    const minutes = Math.floor(timeInSeconds / 60)
    const seconds = (timeInSeconds % 60).toFixed(2)

    return `${String(minutes)}:${seconds.padStart(4, "0")}`
  }

  return (
    <div ref={ref}>
      <Box sx={{ width: "100%", overflow: "hidden" }}>
        <Stack
          spacing={2}
          direction="row"
          sx={{ ml: 0, pr: 5 }}
          alignItems="center"
        >
          <audio
            ref={audioRef}
            src={audioUrl || undefined}
            onEnded={() => setPlaying(false)}
          />
          {isPlaying ? (
            <PauseIcon
              fontSize="large"
              onClick={handlePlayPause}
              sx={{ color: "white" }}
            />
          ) : (
            <PlayArrowIcon
              fontSize="large"
              onClick={handlePlayPause}
              sx={{ color: "white" }}
            />
          )}

          <Slider
            sx={{ color: "white" }}
            value={currentTime}
            onChange={handleSliderChange}
            aria-labelledby="continuous-slider"
            min={0}
            max={duration}
          />
          {audioUrl && (
            <Typography
              variant="body2"
              sx={{
                fontSize: "16px",
                fontWeight: "regular",
                color: "white",
              }}
            >
              {formatTime(currentTime)} / {formatTime(duration)}
            </Typography>
          )}
        </Stack>
      </Box>
    </div>
  )
}

export default AudioPlayer
