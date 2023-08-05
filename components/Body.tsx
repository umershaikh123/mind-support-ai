import React from "react";
import SendIcon from "@mui/icons-material/Send";
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
import { ThemeProvider } from "@mui/material";
import { theme } from "@/theme/theme";
import { Children, useEffect, useRef, useState } from "react";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import { useCompletion, useChat } from "ai/react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import CustomizedAccordions from "./Accordion";
import InputAdornment from "@mui/material/InputAdornment";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { styled } from "@mui/material/styles";
import { RingLoader, BeatLoader } from "react-spinners";
import VolumeDown from "@mui/icons-material/VolumeDown";
import VolumeUp from "@mui/icons-material/VolumeUp";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import { callElevenLabsTextToSpeechAPI } from "@/utils/SpeechApi";
import AudioPlayer from "./Audio";
import anime from "animejs";
import { useApiContext, ApiProvider } from "@/hooks/ApiContext";
import {
  useModelId,
  useAccent,
  useStability,
  useSimilarityBoost,
} from "@/hooks";
import { log } from "console";
import { text } from "stream/consumers";
import { kv } from "@vercel/kv";

const mainPrimary = theme.palette.primary.main;
const darkGreen = theme.palette.border.main;

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
});

interface ApiProps {
  text: string;
  model_id: string;
  Accent: string;
  stability: number;
  similarity_boost: number;
}

interface vercelMessage {
  id: string;
  role: "function" | "user" | "assistant" | "system";
  content: string;
}
const Messages: vercelMessage[] = [];


export function ContinuousSlider() {
  const [value, setValue] = React.useState<number>(0);
  const [paused, setPaused] = React.useState(false);

  const handleChange = (event: Event, newValue: number | number[]) => {
    setValue(newValue as number);
  };

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
  );
}



export const Body = () => {
  const {
    model_id,
    stability,
    similarity_boost,
    Accent,
  } = useApiContext();
  const [streamComplete, setstreamComplete] = React.useState(false);
  const [latestMessageContent, setLatestMessageContent] = useState("");
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
  } = useChat({
    onFinish: async (message: any) => {
      async function setAudioText() {
        console.log("messages", message);
        if (message.role === "assistant") {
          setLatestMessageContent(message.content);
          // setLatestMessageContent((prevMessages) => [...prevMessages, message.content]);
          console.log("latest message content", message.content);
          console.log("latest message", latestMessageContent);
        }
      }

      await setAudioText();

      setstreamComplete(true);
    },
    
    // onResponse: async (message: any) => {
    //   async function saveKV() {
    //       try {
    //           const value = await kv.get("messages");
    //           if (value) {
    //               const messages = JSON.parse(value);
    //               messages.push(message);
    //               await kv.set("messages", JSON.stringify(messages));
    //           } else {
    //             await kv.set("messages", JSON.stringify(message));
    //       }
    //   }catch(err) {
    //       console.log(err);
    //   }
    //   }
    //   await saveKV();
    // },
  });

  const ref = useRef<HTMLDivElement | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const Reveal = ref.current;

    if (Reveal) {
      anime({
        targets: Reveal,
        opacity: [0, 1],
        duration: 1200,
        easing: "easeOutSine",
      });
    }
  }, []);

  const c_handleSubmit = async (event: any) => {
    event.preventDefault();
    // if (promptValue.trim() === "") {
    //   return // Don't submit empty messages
    // }
    try {
      setstreamComplete(false);
      await handleSubmit(event);
    } catch (e) {
      if (e) {
        return (
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            Open Api key not Set
          </Alert>
        );
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
  };

  const handleKeyDown = async (event: any) => {
    if (event.key === "Enter") {
      c_handleSubmit(event);
    }
  };

  useEffect(() => {
    // Scroll to the bottom of the chat window when new messages arrive
    // This assumes you have a ref to the chat container element
    // Replace "chatContainerRef" with your actual ref
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const props: ApiProps = {
    text: "promptValue",
    model_id: model_id,
    Accent: Accent,
    stability: stability,
    similarity_boost: similarity_boost,
  };

  console.log("latestMessage hook", latestMessageContent);

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
            color: theme.palette.primary.main,
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
            {messages ? (
              <>
                {messages.map((m, index) => (
                  <div
                    key={index}
                    className=" justify-start bg-[#1A0B11]  w-full "
                    ref={ref}
                  >
                    {/* 
                {isLoading && (<>
                  <div>
        <BeatLoader color="#ffffff" size={10} loading={isLoading} className="ml-5" />
      </div>
                </>) } */}

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

                          <div className="w-full leading-relaxed text-sm font-semibold max-w-fit overflow-auto">
                            <p className="ml-8">
                              {m.content}
                              {/* {m ? (<>
                        </>) : (  
                          <>
                      <Alert severity="error">
                      <AlertTitle>Error</AlertTitle>
                      Open Api key not Set 
                        </Alert>
                        </>
                        )} */}
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
                            <div
                              className=" ml-8  text-white whitespace-normal"
                              ref={chatContainerRef}
                            >
                              {m.content}
                            </div>
                            <div className="mt-4">
                              {m.content && streamComplete && (
                                <>
                                  <AudioPlayer
                                    text={latestMessageContent}
                                    model_id={props.model_id}
                                    Accent={props.Accent}
                                    stability={props.stability}
                                    similarity_boost={props.similarity_boost}
                                  />
                                </>
                              )}

                              {/* {latestMessageContent === m.content && (
                        <AudioPlayer
                          text={latestMessageContent}
                          model_id={props.model_id}
                          Accent={props.Accent}
                          stability={props.stability}
                          similarity_boost={props.similarity_boost}
                          /> 
                        )} */}
                              {/* {streamComplete &&                          
                        (<>


                        <AudioPlayer
                          text={m.content}
                          model_id={props.model_id}
                          Accent={props.Accent}
                          stability={props.stability}
                          similarity_boost={props.similarity_boost}
                        /> 
                        </>)   } */}
                            </div>
                          </div>
                        </Stack>
                      </div>
                    )}
                  </div>
                ))}
              </>
            ) : (
              <>Loading Messages...</>
            )}
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
  );
};
