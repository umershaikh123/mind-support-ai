"use client"

import React from "react"
import Link from "next/link"
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
} from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu"
import MenuItem from "@mui/material/MenuItem"
import AdbIcon from "@mui/icons-material/Adb"

import { Theme, ThemeProvider } from "@mui/material"
import { theme } from "@/theme/theme"

import { NavbarLinks } from "@/constants/types"
import { NavList } from "@/constants"
import AccountCircleIcon from "@mui/icons-material/AccountCircle"
export const Navbar = () => {
  const settings = [
    {
      name: "user",
      url: "/",
    },
  ]

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null)
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  )

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget)
  }

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  return (
    <>
      <ThemeProvider theme={theme}>
        <AppBar
          position="static"
          sx={{
            background: theme.palette.secondary.main,
            color: theme.palette.primary.main,
          }}
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
                      backgroundColor: theme.palette.background.default,
                    },
                  }}
                  sx={{
                    display: { xs: "block", md: "none" },
                  }}
                >
                  {NavList.map(page => (
                    <MenuItem
                      key={page.pageName}
                      onClick={handleCloseNavMenu}
                      sx={{
                        background: theme.palette.secondary.main,
                        color: theme.palette.primary.main,
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

                  fontWeight: 800,
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                MindSupportAi
              </Typography>
              <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                {NavList.map(page => (
                  <>
                    <Link href={page.link}>
                      <Button
                        key={page.pageName}
                        variant="outlined"
                        color="primary"
                        onClick={handleCloseNavMenu}
                        sx={{
                          my: 2,
                          px: 3,
                          ml: 3,
                          textTransform: "capitalize",
                          fontSize: "14px",
                          display: "block",
                        }}
                      >
                        {page.pageName}
                      </Button>
                    </Link>
                  </>
                ))}
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
                    {/* <Avatar
                      alt="profile"
                      src="/Images/Customer.svg"
                      // src={user?.picture || '/Images/Customer.svg'}
                      sx={{ width: "50px", height: "50px" }}
                    /> */}
                    <AccountCircleIcon
                      sx={{
                        width: "50px",
                        height: "50px",
                        color: theme.palette.primary.main,
                      }}
                    />
                  </IconButton>
                </Tooltip>
                {/* <Menu
                  MenuListProps={{
                    sx: {
                      backgroundColor: theme.palette.background.default,
                    },
                  }}
                  sx={{
                    mt: "45px",

                    "& .MuiMenuItem-root": {
                      backgroundColor: theme.palette.secondary.main, // Specify the desired background color
                    },
                    "& .MuiTypography-root": {
                      color: theme.palette.primary.main, // Specify the desired text color
                    },
                  }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                > 
                 {settings.map(setting => (
                    <MenuItem
                      key={setting.name}
                      onClick={handleCloseUserMenu}
                      sx={{
                        "& .MuiMenuItem-root": {
                          backgroundColor: theme.palette.secondary.main, // Specify the desired background color
                        },
                        "& .MuiTypography-root": {
                          color: theme.palette.primary.main, // Specify the desired text color
                        },
                      }}
                    >
                      <Button variant="text" color="primary" href={setting.url}>
                        {setting.name}
                      </Button>
                    </MenuItem>
                  ))}  
                </Menu> */}
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      </ThemeProvider>
    </>
  )
}
