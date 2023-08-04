import React from "react"
import SendIcon from "@mui/icons-material/Send"
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
  Alert ,
  AlertTitle,
  Slider,
  Modal,
} from "@mui/material"
import { ThemeProvider } from "@mui/material"
import { theme } from "@/theme/theme"
import { Children, useEffect, useRef ,useState} from "react"
import SmartToyIcon from "@mui/icons-material/SmartToy"
import { useCompletion, useChat } from "ai/react"
import { useRouter } from "next/navigation"
import { useParams } from "next/navigation"
import CustomizedAccordions from "./Accordion"
import InputAdornment from "@mui/material/InputAdornment"
import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import { styled } from "@mui/material/styles"
 
import VolumeDown from "@mui/icons-material/VolumeDown"
import VolumeUp from "@mui/icons-material/VolumeUp"
import PlayCircleIcon from "@mui/icons-material/PlayCircle"
import PauseCircleIcon from "@mui/icons-material/PauseCircle"
import PlayArrowIcon from "@mui/icons-material/PlayArrow"
import PauseIcon from "@mui/icons-material/Pause"
import { callElevenLabsTextToSpeechAPI } from "@/utils/SpeechApi"
import AudioPlayer from "./Audio"
import anime from "animejs"
import { useApiContext, ApiProvider } from "@/hooks/ApiContext"
import {
  useModelId,
  useAccent,
  useStability,
  useSimilarityBoost,
} from "@/hooks"
import { log } from "console"

const mainPrimary = theme.palette.primary.main
const darkGreen = theme.palette.border.main

const CssTextField = styled(TextField)({
  transition: "all 0.3s ease-in-out",
  backgroundColor: theme.palette.secondary.main,

  "& label": { color: theme.palette.border.main },
  "& helperText": { color: theme.palette.primary.main },
  "& .MuiInputBase-input": {
    color: theme.palette.primary.main,
    height: "3rem",
  },

  "& label.Mui-focused": {
    transition: "all 0.3s ease-in-out",
    color: mainPrimary,
  },
  "& .MuiInput-underline:after": {
    transition: "all 0.3s ease-in-out",
    borderBottomColor: mainPrimary,
  },

  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      transition: "all 0.3s ease-in-out",
      borderColor: mainPrimary,
    },
    "&:hover fieldset": {
      transition: "all 0.3s ease-in-out",
      borderColor: darkGreen,
    },
    "&.Mui-focused fieldset": {
      transition: "all 0.3s ease-in-out",
      borderColor: darkGreen,
    },
  },
})

interface UserMessage {
  role: "user"
  id: string
  content: string
}

interface AssistantMessage {
  role: "assistant"
  id: string
  usercontent: string
  // responsecontent: string
  
}

// Define the union type for messages
type Message = UserMessage | AssistantMessage

interface vercelMessage {
  id: string
  role: 'function' | 'user' | 'assistant' | 'system'
  content: string
}
const Messages: Message[] = [
  {
    role: "user",
    id: "1",
    content: "prompt",
  },
  {
    role: "assistant",
    id: "1",
    usercontent: "user prompt",
  },
]
// responsecontent: "Ai response ",

export function ContinuousSlider() {
  const [value, setValue] = React.useState<number>(0)
  const [paused, setPaused] = React.useState(false)

  const handleChange = (event: Event, newValue: number | number[]) => {
    setValue(newValue as number)
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ width: "100%", overflow: "hidden" }}>
        <Stack
          spacing={3}
          direction="row"
          sx={{ ml: 2, pr: 5 }}
          alignItems="center"
        >
          <IconButton
            aria-label={paused ? "play" : "pause"}
            onClick={() => setPaused(!paused)}
          >
            {paused ? (
              <PlayArrowIcon
                sx={{ fontSize: "3rem", width: 35, height: 35 }}
                htmlColor={theme.palette.primary.main}
              />
            ) : (
              <PauseIcon
                sx={{ fontSize: "3rem", width: 35, height: 35 }}
                htmlColor={theme.palette.primary.main}
              />
            )}
          </IconButton>

          <Slider aria-label="Volume" value={value} onChange={handleChange} />
        </Stack>
      </Box>
    </ThemeProvider>
  )
}

interface ApiProps {
  text: string
  model_id: string
  Accent: string
  stability: number
  similarity_boost: number
}

export const Body = () => {
  const {
    model_id,

    stability,
    loading,
    similarity_boost,
    Accent,
  } = useApiContext()
  const [streamComplete, setstreamComplete] = React.useState(false)
  const { messages, input, handleInputChange, handleSubmit, setMessages } = useChat({onFinish: () => {
    setstreamComplete(true);
 
  }})
  const [lastMessage, setLastMessage] = React.useState<vercelMessage | null>(null);
  // Custom hook to handle audio rendering
 
  // const [c_messages, setc_Messages] = React.useState<Message[]>([])
  

  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const Reveal = ref.current

    if (Reveal) {
      anime({
        targets: Reveal,
        opacity: [0, 1],
        duration: 1200,
        easing: "easeOutSine",
      })
    }
  }, [])

  // const handlePromptChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setPromptValue(event.target.value)
  // }

  const c_handleSubmit = async(event: any) => {
    
    event.preventDefault()
    // if (promptValue.trim() === "") {
    //   return // Don't submit empty messages
    // }
    try {
      setstreamComplete(false)
      await handleSubmit(event)
      setMessages(messages)
      setLastMessage(messages[messages.length - 1]);
      console.log("last message", lastMessage)
      console.log("message lenght", messages.length - 1)
    }
    catch(e){
      if(e){
        return  <Alert severity="error">
        <AlertTitle>Error</AlertTitle>
        Open Api key not Set 
      </Alert>
      }
    }


    // const userMessage: UserMessage = {
    //   role: "user",
    //   id: String(Date.now()), // You can use a better method to generate IDs
    //   content: promptValue.trim(),
    // }

    // const assistantMessage: AssistantMessage = {
    //   role: "assistant",
    //   id: String(Date.now()), // You can use a better method to generate IDs
    //   usercontent: promptValue.trim(), // Replace 'url' with the actual audio URL generated for the user's prompt
     
    // }

    // setc_Messages(prevMessages => [
    //   ...prevMessages,
    //   userMessage,
    //   assistantMessage,
    // ])
    // setPromptValue("")
  }
    
  

 
  const handleKeyDown = async (event: any) => {
    if (event.key === "Enter") {
      c_handleSubmit(event)
    }
  }

  const props: ApiProps = {
    text: "promptValue",
    model_id: model_id,
    Accent: Accent,
    stability: stability,
    similarity_boost: similarity_boost,
  }
   
  return (
    <div>
      <Box sx={{ px: 2, py: 2 }}>
        <Stack
          direction="column"
          alignItems="start"
          justifyContent="space-between"
          spacing={0}
          sx={{
            py: 2,
            maxHeight: "70vh",
            minHeight: "70vh",
            height: "100%",
            color : theme.palette.primary.main,
            overflow: "auto",
          }}
        >
          {/* conversation */}
          <Stack
            direction="column"
            justifyContent="flex-start"
            alignItems="start"
            spacing={3}
            sx={{
              overflow: "auto",

              width: "100%",
              maxWidth: "100%",
            }}
          >

            {messages ? (<>
              {messages.map((m, index) => (
              <div
                key={index}
                className=" justify-start bg-[#1A0B11]  w-full "
                ref={ref}
              >


                {m.role === "user" ? (
                  <div className="  ">
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="flex-start"
                      spacing={2}
                      sx={{
                        py: 1.5,
                        backgroundColor: theme.palette.chatBackground.main,
                        px: 2,
                      }}
                    >
                      <div className=" ">
                        <AccountCircleIcon sx={{ width: 40, height: 40 }} />
                      </div>

                      <div className=" w-full leading-relaxed text-sm   font-semibold ">
                        <p className=" ml-8">

                        {m ? (<>
                          {m.content}
                        </>) : (  
                          <>
        <Alert severity="error">
        <AlertTitle>Error</AlertTitle>
        Open Api key not Set 
          </Alert>
                          </>
                        )}
 
                          
                          

                          </p>
                      </div>
                    </Stack>
                  </div>
                ) : (
                  <div className="  ">
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="flex-start"
                      spacing={2}
                      sx={{
                        px: 2,
                        py: 1.5,

                        backgroundColor: theme.palette.chatBackground.main,
                      }}
                    >
                      <div className=" ">
                        <Avatar
                          alt="Remy Sharp"
                          src={"/Images/Bot2.svg"}
                          sx={{ width: 40, height: 40 }}
                        />
                      </div>

                      <div className=" w-full   leading-relaxed text-sm  font-medium">

                        <div className= " ml-8  text-white whitespace-normal">

                         {m.content}

                        </div>
                        <div className="mt-4">

                        {streamComplete &&  
                        


                        (<>

{/*                         
                     {loading ? (
                      <>
                      Loading audio
                      </>
                    ) 
                    : (<>
                          
                    </>) 
                    
                    } */}
   <AudioPlayer
                          text={m.content}
                          model_id={props.model_id}
                          Accent={props.Accent}
                          stability={props.stability}
                          similarity_boost={props.similarity_boost}
                        /> 
                        </>)  
                        
                        }
                        
                        
                        {/* // : (  
                        //   <>
                        //    ...
                        //   </>
                        // )} */}
 
                        </div>
                      </div>
                    </Stack>

                    {/* {loading ? (
                      <>
                      
                      </>
                    ) : (
                      <div className="  whitespace-pre-wrap " ref={ref}>
                        {/* <CustomizedAccordions />  
                      </div>
                    )} */}


                  </div>
                )}
              </div>
            ))}
            
            
            </>) 
            
            
            : (<>
            Loading Messages...
            </>)}

          </Stack>

          <Stack
            direction="column"
            justifyContent="flex-end"
            alignItems="center"
            spacing={2}
            sx={{
              mt: 4,

              width: "100%",
              maxWidth: "100%",
            }}
          >
            <form onSubmit={c_handleSubmit} className="w-full">
              <CssTextField
                label="Say something..."
                maxRows={10}
                fullWidth
                id="fullWidth"
                multiline
                // value={promptValue}
                // onChange={handlePromptChange}
                value={input} 
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                InputProps={{
                  endAdornment: (
                    <InputAdornment
                      position="end"
                      sx={{ color: theme.palette.primary.main }}
                    >
                      <Button type="submit" onClick={c_handleSubmit}>
                        <SendIcon />
                      </Button>
                    </InputAdornment>
                  ),
                }}
              />

              <Typography variant="subtitle2" sx={{ mt: 1 }}>
                Character Length : {input.length}
              </Typography>
            </form>
          </Stack>
        </Stack>
      </Box>
    </div>
  )
}
