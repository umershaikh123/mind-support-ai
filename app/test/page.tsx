'use client'
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
import CustomizedAccordions from "../../components/Accordion";
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
import AudioPlayer from "../../components/Audio";
import anime from "animejs";
import { useApiContext } from "@/hooks/ApiContext";
// import {PersonalityTest} from "@/components/PersonalityTest";
 
 import Layout from "@/components/layout";
import styles from '@/styles/Home.module.css';
import { Message } from '@/types/chat';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import LoadingDots from '@/components/ui/LoadingDots';
import { Document } from 'langchain/document';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

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

function page() {
  const [query, setQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [messageState, setMessageState] = useState<{
    messages: Message[];
    pending?: string;
    history: [string, string][];
    pendingSourceDocs?: Document[];
  }>({
    messages: [
      {
        message: 'Hi, what would you like to learn about this document?',
        type: 'apiMessage',
      },
    ],
    history: [],
  });

  const { messages, history } = messageState;

  const messageListRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textAreaRef.current?.focus();
  }, []);

  //handle form submission
  async function handleSubmit(e: any) {
    e.preventDefault();

    setError(null);

    if (!query) {
      alert('Please input a question');
      return;
    }

    const question = query.trim();

    setMessageState((state) => ({
      ...state,
      messages: [
        ...state.messages,
        {
          type: 'userMessage',
          message: question,
        },
      ],
    }));

    setLoading(true);
    setQuery('');

    try {
      const response = await fetch('/api/personatest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          history,
        }),
      });
      const data = await response.json();
      console.log('data', data);

      if (data.error) {
        setError(data.error);
      } else {
        setMessageState((state) => ({
          ...state,
          messages: [
            ...state.messages,
            {
              type: 'apiMessage',
              message: data.text,
              sourceDocs: data.sourceDocuments,
            },
          ],
          history: [...state.history, [question, data.text]],
        }));
      }
      console.log('messageState', messageState);

      setLoading(false);

      //scroll to bottom
      messageListRef.current?.scrollTo(0, messageListRef.current.scrollHeight);
    } catch (error) {
      setLoading(false);
      setError('An error occurred while fetching the data. Please try again.');
      console.log('error', error);
    }
  }

  //prevent empty submissions
  const handleEnter = (e: any) => {
    if (e.key === 'Enter' && query) {
      handleSubmit(e);
    } else if (e.key == 'Enter') {
      e.preventDefault();
    }
  };

  return (
    <>
      <Layout>
        <div className="mx-auto flex flex-col gap-4">
          <h1 className="text-2xl font-bold leading-[1.1] tracking-tighter text-center">
            Chat With Your Docs
          </h1>
          <main className={styles.main}>
            <div className={styles.cloud}>
              <div ref={messageListRef} className={styles.messagelist}>
                {messages.map((message, index) => {
                  let icon;
                  let className;
                  if (message.type === 'apiMessage') {
                    icon = (
                      <Image
                        key={index}
                        src="/bot-image.png"
                        alt="AI"
                        width="40"
                        height="40"
                        className={styles.boticon}
                        priority
                      />
                    );
                    className = styles.apimessage;
                  } else {
                    icon = (
                      <Image
                        key={index}
                        src="/usericon.png"
                        alt="Me"
                        width="30"
                        height="30"
                        className={styles.usericon}
                        priority
                      />
                    );
                    // The latest message sent by the user will be animated while waiting for a response
                    className =
                      loading && index === messages.length - 1
                        ? styles.usermessagewaiting
                        : styles.usermessage;
                  }
                  return (
                    <>
                      <div key={`chatMessage-${index}`} className={className}>
                        {icon}
                        <div className={styles.markdownanswer}>
                          <ReactMarkdown linkTarget="_blank">
                            {message.message}
                          </ReactMarkdown>
                        </div>
                      </div>
                      {message.sourceDocs && (
                        <div
                          className="p-5"
                          key={`sourceDocsAccordion-${index}`}
                        >
                          <Accordion
                            type="single"
                            collapsible
                            className="flex-col"
                          >
                            {message.sourceDocs.map((doc, index) => (
                              <div key={`messageSourceDocs-${index}`}>
                                <AccordionItem value={`item-${index}`}>
                                  <AccordionTrigger>
                                    <h3>Source {index + 1}</h3>
                                  </AccordionTrigger>
                                  <AccordionContent>
                                    <ReactMarkdown linkTarget="_blank">
                                      {doc.pageContent}
                                    </ReactMarkdown>
                                    <p className="mt-2">
                                      <b>Source:</b> {doc.metadata.source}
                                    </p>
                                  </AccordionContent>
                                </AccordionItem>
                              </div>
                            ))}
                          </Accordion>
                        </div>
                      )}
                    </>
                  );
                })}
              </div>
            </div>
            <div className={styles.center}>
              <div className={styles.cloudform}>
                <form onSubmit={handleSubmit}>
                  <textarea
                    disabled={loading}
                    onKeyDown={handleEnter}
                    ref={textAreaRef}
                    autoFocus={false}
                    rows={1}
                    maxLength={512}
                    id="userInput"
                    name="userInput"
                    placeholder={
                      loading
                        ? 'Waiting for response...'
                        : 'type your questions here...'
                    }
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className={styles.textarea}
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className={styles.generatebutton}
                  >
                    {loading ? (
                      <div className={styles.loadingwheel}>
                        <LoadingDots color="#000" />
                      </div>
                    ) : (
                      // Send icon SVG in input field
                      <svg
                        viewBox="0 0 20 20"
                        className={styles.svgicon}
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                      </svg>
                    )}
                  </button>
                </form>
              </div>
            </div>
            {error && (
              <div className="border border-red-400 rounded-md p-4">
                <p className="text-red-500">{error}</p>
              </div>
            )}
          </main>
        </div>
 
      </Layout>
    </>
  );
}



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


function oldpage({}: Props) {
  const [streamComplete, setstreamComplete] = React.useState(false);
  const [latestMessageContent, setLatestMessageContent] = useState("");
  const ref = useRef<HTMLDivElement | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const {
    model_id,
    stability,
    similarity_boost,
    Accent,
  } = useApiContext();
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
        }
      }

      await setAudioText();
      setstreamComplete(true);
    },
    api: 'personality',
  });

  const c_handleSubmit = async (event: any) => {
    event.preventDefault();
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

  useEffect(() => {
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
  )
  
}





export default page