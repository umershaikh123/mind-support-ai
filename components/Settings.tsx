"use client";

import React, { useEffect } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  TextField,
  FormControl,
  FormHelperText,
  Button,
  Divider,
  makeStyles,
  Modal,
  Tooltip,
  Slider,
  Radio,
  NativeSelect,
  Fade,
  Stack,
} from "@mui/material";
import { ThemeProvider } from "@mui/material";
import { theme } from "@/theme/theme";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import SettingsIcon from "@mui/icons-material/Settings";
import TuneIcon from "@mui/icons-material/Tune";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import InfoIcon from "@mui/icons-material/Info";
import Select, { SelectChangeEvent } from "@mui/material/Select";

import { useApiContext, ApiProvider } from "@/hooks/ApiContext";
import anime from "animejs";
import { useRef } from "react";

import { styled } from "@mui/material";
import { Theme, useTheme } from "@mui/material/styles";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 150,
      background: "#002A42",
      color: theme.palette.primary.main,
    },
  },
};

export function BasicSelect() {
  const { Accent, setAccent } = useApiContext();

  // console.log(Accent)

  const handleChange = (event: SelectChangeEvent) => {
    setAccent(event.target.value as string);
  };

  const voiceIds = [
    {
      name: "Rachel",
      value: "21m00Tcm4TlvDq8ikWAM",
    },

    {
      name: "Clyde",
      value: "2EiwWnXFnvU5JabPnv8n",
    },

    {
      name: "Domi",
      value: "AZnzlk1XvdvUeBnXmlld",
    },

    {
      name: "Dave",
      value: "CYw3kZ02Hs0563khs1Fj",
    },

    {
      name: "Fin",
      value: "D38z5RcWu1voky8WS1ja",
    },

    {
      name: "Bella",
      value: "EXAVITQu4vr4xnSDxMaL",
    },

    {
      name: "Antoni",
      value: "ErXwobaYiN019PkySvjV",
    },

    {
      name: "Thomas",
      value: "GBv7mTt0atIp3Br8iCZE",
    },

    {
      name: "Charlie",
      value: "IKne3meq5aSn9XLyUdCD",
    },

    {
      name: "Emily",
      value: "LcfcDJNUP1GQjkzn1xUU",
    },
  ];

  return (
    <Box
      component="form"
      sx={{
        width: "20ch",
        "& .MuiTextField-root": {
          color: theme.palette.primary.main,
        },
        ".MuiSelect-icon": {
          color: theme.palette.primary.main,
        },

        "& label": {
          color: theme.palette.primary.main,
        },

        "& .MuiInputBase-input": {
          color: theme.palette.primary.main,
        },

        "& label.Mui-focused": {
          transition: "all 0.3s ease-in-out",
        },
        "& .MuiInput-underline:after": {
          transition: "all 0.3s ease-in-out",
          borderBottomColor: theme.palette.border.main,
        },

        "& fieldset": {
          transition: "all 0.3s ease-in-out",
          borderColor: theme.palette.border.main,
        },
      }}
    >
      <FormControl fullWidth required>
        <InputLabel id="demo-simple-select-label">Voice</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          variant="outlined"
          color="primary"
          value={Accent}
          label="accent"
          MenuProps={MenuProps}
          onChange={handleChange}
        >
          {voiceIds.map((voiceId, index) => (
            <MenuItem key={index} value={voiceId.value}>
              {voiceId.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}

const style = {
  position: "absolute" as "absolute",
  top: "40%",
  left: "55%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  bgcolor: theme.palette.secondary.main,
  color: theme.palette.primary.main,
  border: "2px solid #000",

  boxShadow: 24,
  p: 4,
};

function valuetext(value: number) {
  return `${value}%`;
}

export const Settings = () => {
  const Ref = useRef(null);

  const [age, setAge] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };
  const {
    model_id,
    setModel_id,
    stability,
    setStability,
    similarity_boost,
    setSimilarity_boost,
  } = useApiContext();

  // console.log(model_id)
  // console.log(stability)
  // console.log(similarity_boost)

  const [open2, setOpen2] = React.useState(false);
  const handleOpen2 = () => setOpen2(true);
  const handleClose2 = () => setOpen2(false);

  const handleChangeRadio = (event: React.ChangeEvent<HTMLInputElement>) => {
    setModel_id(event.target.value);
  };

  const handleChangeLow = (event: Event, newValue: number | number[]) => {
    setSimilarity_boost(newValue as number);
  };
  const handleChangeStability = (event: Event, newValue: number | number[]) => {
    setStability(newValue as number);
  };

  useEffect(() => {
    const ref = Ref.current;

    anime({
      targets: ref,

      opacity: [0, 1],
      easing: "easeInOutSine",
      duration: 1200,
      direction: "alternate",
    });
  }, []);
  return (
    <div className="w-full justify-evenly mx-auto mb-3 pb-3">
      <ThemeProvider theme={theme}>
        <div>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Fade in={open}>
              <Box sx={style}>
                <Typography
                  id="modal-modal-title"
                  sx={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    color: theme.palette.primary.main,
                  }}
                >
                  Voice Settings
                </Typography>
                <Divider
                  sx={{
                    mt: 1,
                    border: `1px solid ${theme.palette.border.main}`,
                  }}
                />
                <Stack
                  direction="column"
                  justifyContent="flex-start"
                  alignItems="flex-start"
                  spacing={5}
                  sx={{ mt: 1, width: "100%" }}
                >
                  <Stack
                    direction="column"
                    justifyContent="flex-start"
                    alignItems="flex-start"
                    spacing={1}
                    sx={{ mt: 1, width: "100%" }}
                  >
                    <Typography
                      id="modal-modal-description"
                      sx={{ fontSize: "20px", fontWeight: "bold" }}
                    >
                      Stability
                    </Typography>

                    <Slider
                      aria-label="Temperature"
                      value={stability}
                      getAriaValueText={valuetext}
                      onChange={handleChangeStability}
                      valueLabelDisplay="auto"
                      step={0.1}
                      marks
                      min={0}
                      max={1}
                    />

                    <div className="flex space-x-3">
                      <Typography
                        id="modal-modal-description"
                        sx={{ fontSize: "16px", fontWeight: "medium" }}
                      >
                        More Variable
                      </Typography>
                      <Tooltip title="Increasing variability can make speech more expressive with output varying between re-generations. It can also lead to instabilities.">
                        <InfoIcon />
                      </Tooltip>
                    </div>
                  </Stack>

                  <Stack
                    direction="column"
                    justifyContent="flex-start"
                    alignItems="flex-start"
                    spacing={1}
                    sx={{ mt: 1, width: "100%" }}
                  >
                    <Typography
                      id="modal-modal-description"
                      sx={{ fontSize: "20px", fontWeight: "bold" }}
                    >
                      Clarity + Similiarity Enhancement
                    </Typography>

                    <Slider
                      aria-label="similarity_boost"
                      value={similarity_boost}
                      getAriaValueText={valuetext}
                      onChange={handleChangeLow}
                      valueLabelDisplay="auto"
                      step={0.1}
                      marks
                      min={0}
                      max={1}
                    />

                    <div className="flex space-x-3">
                      <Typography
                        id="modal-modal-description"
                        sx={{ fontSize: "16px", fontWeight: "medium" }}
                      >
                        Low
                      </Typography>
                      <Tooltip title="Low values are recommended if background artifacts are present in generated speech.">
                        <InfoIcon />
                      </Tooltip>
                    </div>
                  </Stack>
                </Stack>
              </Box>
            </Fade>
          </Modal>
        </div>

        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
          textAlign="center"
          spacing={5}
          sx={{ border: "" }}
        >
          <div>
            <Typography
              variant="h3"
              className="mt-2"
              sx={{
                fontSize: "24px",
                whiteSpace: "nowrap",
                fontWeight: "bold",
                color: theme.palette.primary.main,
              }}
            >
              Settings
            </Typography>
          </div>

          <div className='flex flex-col gap-4 px-4'>
            <BasicSelect />

            <Button
              variant="outlined"
              color="primary"
              endIcon={<TuneIcon />}
              onClick={handleOpen}
              sx={{
                fontSize: "14px",
                textTransform: "capitalize",
                minWidth: "25ch",
              }}
            >
              Voice Settings
            </Button>

            <Button
              variant="outlined"
              color="primary"
              onClick={handleOpen2}
              endIcon={<SettingsIcon />}
              sx={{
                fontSize: "14px",
                textTransform: "capitalize",
                minWidth: "25ch",
              }}
            >
              Model
            </Button>
          </div>

          <Modal
            open={open2}
            onClose={handleClose2}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            sx={{ mt: 4 }}
          >
            <Fade in={open2}>
              <Box sx={style}>
                <Typography
                  id="modal-modal-title"
                  sx={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    color: theme.palette.primary.main,
                  }}
                >
                  Choose a Model
                </Typography>

                <Box
                  sx={{
                    border: `1px solid ${theme.palette.border.main}`,
                    padding: "10px",
                    borderRadius: "10px",
                    position: "relative",
                    py: 3,
                    mt: 3,
                    px: 5,
                  }}
                >
                  <Radio
                    checked={model_id === "eleven_monolingual_v1"}
                    onChange={handleChangeRadio}
                    value="eleven_monolingual_v1"
                    name="radio-buttons"
                    inputProps={{ "aria-label": "eleven_monolingual_v1" }}
                    sx={{
                      position: "absolute",
                      color: theme.palette.primary.main,
                      top: "30px",
                      right: "20px",
                      "& .MuiSvgIcon-root": {
                        fontSize: 28,
                      },
                    }}
                  />
                  <Stack
                    direction="column"
                    justifyContent="flex-start"
                    alignItems="flex-start"
                    spacing={5}
                    sx={{ mt: 1, width: "100%" }}
                  >
                    <Stack
                      direction="column"
                      justifyContent="flex-start"
                      alignItems="flex-start"
                      spacing={3}
                      sx={{ mt: 1, width: "100%" }}
                    >
                      <Typography
                        sx={{
                          fontSize: "16px",
                          fontWeight: "bold",
                          color: theme.palette.primary.main,
                        }}
                      >
                        Eleven English v1
                      </Typography>

                      <Typography
                        sx={{
                          fontSize: "14px",
                          fontWeight: "medium",
                          color: theme.palette.primary.main,
                        }}
                      >
                        Use our standard English language model to generate
                        speech in a variety of voices, styles and moods.
                      </Typography>

                      <div className="flex space-x-3 items-center ">
                        <Typography
                          sx={{
                            fontSize: "14px",
                            fontWeight: "semiBold",
                            color: theme.palette.primary.main,
                          }}
                        >
                          Tasks :
                        </Typography>

                        <Button
                          variant="outlined"
                          color="primary"
                          sx={{
                            minWidth: "5rem",
                            textTransform: "capitalize",
                            fontSize: "12px",
                          }}
                        >
                          Text to Speech
                        </Button>
                      </div>

                      <div className="flex space-x-3 items-center ">
                        <Typography
                          sx={{
                            fontSize: "14px",
                            fontWeight: "semiBold",
                            color: theme.palette.primary.main,
                          }}
                        >
                          Languages:
                        </Typography>

                        <Button
                          variant="outlined"
                          color="primary"
                          sx={{
                            minWidth: "5rem",
                            textTransform: "capitalize",
                            fontSize: "12px",
                          }}
                        >
                          English
                        </Button>
                      </div>
                    </Stack>
                  </Stack>
                </Box>

                <Box
                  sx={{
                    border: `1px solid ${theme.palette.border.main}`,
                    padding: "10px",
                    borderRadius: "10px",
                    position: "relative",
                    py: 3,
                    mt: 3,
                    px: 5,
                  }}
                >
                  <Radio
                    checked={model_id === "eleven_multilingual_v1"}
                    onChange={handleChangeRadio}
                    value="eleven_multilingual_v1"
                    name="radio-buttons"
                    inputProps={{ "aria-label": "eleven_multilingual_v1" }}
                    sx={{
                      position: "absolute",
                      top: "30px",
                      right: "20px",
                      color: theme.palette.primary.main,
                      "& .MuiSvgIcon-root": {
                        fontSize: 28,
                      },
                    }}
                  />
                  <Stack
                    direction="column"
                    justifyContent="flex-start"
                    alignItems="flex-start"
                    spacing={5}
                    sx={{ mt: 1, width: "100%" }}
                  >
                    <Stack
                      direction="column"
                      justifyContent="flex-start"
                      alignItems="flex-start"
                      spacing={3}
                      sx={{ mt: 1, width: "100%" }}
                    >
                      <Typography
                        sx={{
                          fontSize: "16px",
                          fontWeight: "bold",
                          color: theme.palette.primary.main,
                        }}
                      >
                        Eleven Multilingual v1
                      </Typography>

                      <Typography
                        sx={{
                          fontSize: "14px",
                          fontWeight: "medium",
                          color: theme.palette.primary.main,
                        }}
                      >
                        Use our standard English language model to generate
                        speech in a variety of voices, styles and moods.
                      </Typography>

                      <div className="flex space-x-3 items-center ">
                        <Typography
                          sx={{
                            fontSize: "14px",
                            fontWeight: "semiBold",
                            color: theme.palette.primary.main,
                          }}
                        >
                          Tasks :
                        </Typography>

                        <Button
                          variant="outlined"
                          color="primary"
                          sx={{
                            minWidth: "5rem",
                            textTransform: "capitalize",
                            fontSize: "12px",
                          }}
                        >
                          Text to Speech
                        </Button>
                      </div>

                      <div className="flex space-x-3 items-center ">
                        <Typography
                          sx={{
                            fontSize: "14px",
                            fontWeight: "semiBold",
                            color: theme.palette.primary.main,
                          }}
                        >
                          Languages:
                        </Typography>

                        <Button
                          variant="outlined"
                          color="primary"
                          sx={{
                            minWidth: "5rem",
                            textTransform: "capitalize",
                            fontSize: "12px",
                          }}
                        >
                          English
                        </Button>

                        <Button
                          variant="outlined"
                          color="primary"
                          sx={{
                            minWidth: "5rem",
                            textTransform: "capitalize",
                            fontSize: "12px",
                          }}
                        >
                          German
                        </Button>
                      </div>
                    </Stack>
                  </Stack>
                </Box>
                <Divider />
              </Box>
            </Fade>
          </Modal>
        </Stack>
      </ThemeProvider>
    </div>
  );
};
