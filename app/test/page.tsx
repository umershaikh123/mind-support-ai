"use client";
import React, { FormEvent } from "react";
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
import CustomizedAccordions from "../../components/Accordion";
import InputAdornment from "@mui/material/InputAdornment";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Theme, styled } from "@mui/material/styles";
import { RingLoader, BeatLoader } from "react-spinners";
import VolumeDown from "@mui/icons-material/VolumeDown";
import VolumeUp from "@mui/icons-material/VolumeUp";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import { callElevenLabsTextToSpeechAPI } from "@/utils/SpeechApi";
import AudioPlayer from "../../components/Audio";
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
import { useTheme } from "@mui/material/styles";
import ModeSelect from "@/components/ModeSelect";
import { Settings } from "@/components/Settings";
import { ChatRequestOptions, Message, UseChatOptions } from "ai";

interface PageProps {
  activeTheme: Theme;
}


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

export default function Chat(pageProps: PageProps) {
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
    api: 'api/personatest',
    initialMessages: [
      {
        id: "0",
        role: "assistant",
        content: `You will be asked a series of questions to determine your personality type.\n
        Please answer honestly and to the best of your ability.\n
        Your answer should be a number between 1 and 5, with 1 being strongly disagree and 5 being strongly agree.`,
      },
      {
        id: "1",
        role: "assistant",
        content: "To begin, type start",
      },
    ],
    initialInput: "Start",
    onFinish: async (message: any) => {
      async function setAudioText() {
        console.log("messages", message);
        if (message.role === "assistant") {
          setLatestMessageContent(message.content);
          // setLatestMessageContent((prevMessages) => [...prevMessages, message.content]);
          console.log("latest message content", message.content);
          console.log("latest message", latestMessageContent);
          
      setstreamComplete(true);
        }
      }

      await setAudioText();

    },
  });
  console.log("messages", messages);

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

 
  };

  const handleKeyDown = async (event: any) => {
    if (event.key === "Enter") {
      c_handleSubmit(event);
    }
  };

  useEffect(() => {
 
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  interface ApiProps {
    text: string;
    model_id: string;
    Accent: string;
    stability: number;
    similarity_boost: number;
  }

  const props: ApiProps = {
    text: "promptValue",
    model_id: model_id,
    Accent: Accent,
    stability: stability,
    similarity_boost: similarity_boost,
  };





  return (
    <div className="" ref={ref}>
      <ThemeProvider theme={theme}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={5}
          sx={{ mt: 5 }}
        >
          <div className="flex flex-col gap-[124px]">
            <Box
              className="rounded-lg shadow-lg"
              sx={{
                flexGrow: 0,
                flexBasis: "15rem",
                // flexShrink: 10,
                // display : "flex",
                display: { xs: "none", sm: "flex" },
                height: "250px",
                // background: theme.palette.secondary.main,
              }}
            >
              <Settings />
            </Box>
            <Box
              className="rounded-lg shadow-lg"
              sx={{
                flexGrow: 0,
                flexBasis: "15rem",
                // flexShrink: 10,
                // display : "flex",
                display: { xs: "none", sm: "flex" },
                height: "250px",
                // background: theme.palette.secondary.main,
              }}
            >
              <ModeSelect />
            </Box>
          </div>
          <Box
            className="rounded-lg shadow-lg"
            sx={{
              flexGrow: 2,
              flexBasis: "70rem",
              flexShrink: 3,

              height: "75vh",
              // background: theme.palette.secondary.main,
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontSize: "24px",
                whiteSpace: "nowrap",
              }}
            >
              <div>
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
                                {m.role === "user" ? (
                                  <div className="  ">
                                    <Stack
                                      direction="row"
                                      alignItems="center"
                                      justifyContent="flex-start"
                                      spacing={2}
                                      sx={{
                                        py: 1.5,
                                        backgroundColor:
                                          theme.palette.chatBackground.main,
                                        px: 2,
                                      }}
                                    >
                                      <div className=" ">
                                        <AccountCircleIcon
                                          sx={{
                                            width: 40,
                                            height: 40,
                                            color: theme.palette.secondary.main,
                                          }}
                                        />
                                      </div>

                                      <div className="w-full leading-relaxed text-sm max-w-fit overflow-auto text-white whitespace-normal">
                                        <p
                                          className="ml-8"
                                          style={{
                                            color: theme.palette.secondary.main,
                                          }}
                                        >
                                          {m.content}
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

                                        backgroundColor:
                                          theme.palette.chatBackground.main,
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
                                          style={{
                                            color:
                                            theme.palette.secondary.main,
                                          }}
                                          className=" ml-8 text-white whitespace-normal"
                                          ref={chatContainerRef}
                                        >
                                          {m.content}
                                        </div>
                                        <div className="mt-4">
                                          {streamComplete &&
                                            m.content ==
                                              latestMessageContent && (
                                              <div>
                                                <AudioPlayer
                                                  text={latestMessageContent}
                                                  model_id={props.model_id}
                                                  Accent={props.Accent}
                                                  stability={props.stability}
                                                  similarity_boost={
                                                    props.similarity_boost
                                                  }
                                                />
                                              </div>
                                            )}
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
                                  <Button
                                    type="submit"
                                    onClick={c_handleSubmit}
                                  >
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
              </div>
            </Typography>
            {/* {children} */}
          </Box>
        </Stack>
      </ThemeProvider>
    </div>
  );
}
