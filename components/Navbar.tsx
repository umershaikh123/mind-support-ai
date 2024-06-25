"use client";

import React, { Dispatch, SetStateAction } from "react";
import Link from "next/link";
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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import { useTheme } from 'next-themes'
import { Theme, ThemeProvider } from "@mui/material";

import { NavbarLinks } from "@/constants/types";
import { NavList } from "@/constants";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { WbSunny, WbTwilight } from "@mui/icons-material";

export const Navbar = (
  toggleTheme: React.MouseEventHandler<HTMLButtonElement>
) => {
  const settings = [
    {
      name: "user",
      url: "/",
    },
  ];

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const {theme, setTheme} = useTheme();

  return (
    <>
        <AppBar
          className="mt-2 rounded-lg shadow-lg"
          position="static"
          color="transparent"
        >
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <Avatar
                alt="profile"
                src="/Images/Brain.svg"
                variant="square"
                sx={{
                  width: "35px",
                  height: "35px",
                  display: { xs: "none", md: "flex" },
                  mr: 1,
                }}
              />
              <Typography
                variant="h5"
                noWrap
                component="a"
                href="/"
                sx={{
                  mr: 5,
                  display: { xs: "none", md: "flex" },
                  fontWeight: 700,
                  color: "inherit",

                  textDecoration: "none",
                }}
              >
                MindSupportAi
              </Typography>

              {/* Moble Nav */}
              <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenNavMenu}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  MenuListProps={{
                    sx: {
                      // backgroundColor: theme.palette.background.default,
                    },
                  }}
                  sx={{
                    display: { xs: "block", md: "none" },
                  }}
                >
                  {NavList.map((page) => (
                    <MenuItem
                      key={page.pageName}
                      onClick={handleCloseNavMenu}
                      sx={{
                        // background: theme.palette.secondary.main,
                        // color: theme.palette.primary.main,
                      }}
                    >
                      <Link href={page.link}>
                        <Button
                          variant="outlined"
                          color="primary"
                          sx={{ minWidth: "7rem" }}
                        >
                          {page.pageName}
                        </Button>
                      </Link>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>

              <Button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                // size="sm"
              >
                <WbSunny  className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <WbTwilight  className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
              

              <Avatar
                alt="profile"
                src="/Images/Brain.svg"
                variant="square"
                sx={{
                  width: "35px",
                  height: "35px",
                  display: { xs: "flex", md: "none" },
                  mr: 1,
                }}
              />

              <Typography
                variant="h5"
                noWrap
                component="a"
                href="/"
                sx={{
                  mr: 2,
                  display: { xs: "flex", md: "none" },
                  flexGrow: 1,

                  fontWeight: 700,
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                MindSupportAi
              </Typography>
              <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
  
              </Box>

              <Box
                sx={{
                  flexGrow: 0,
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
           
                    <AccountCircleIcon
                      sx={{
                        width: "50px",
                        height: "50px",
                        color: (theme) => theme.palette.primary.main,
                      }}
                    />
                  </IconButton>
                </Tooltip>
    
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
    </>
  );
};
