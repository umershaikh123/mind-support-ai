import { NavList } from "@/constants";
import { Button, Typography, Stack } from "@mui/material";
import Link from "next/link";
import React from "react";
import { ThemeProvider } from "@mui/material";
import { theme } from "@/theme/theme";
type Props = {};

function ModeSelect({}: Props) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
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

  let createdBy: string[] = ["@umershaikh123", "@Keyrxng"];

  return (
    <div className="text-center justify-center align-middle w-full mx-auto mb-3 pb-3">
      <ThemeProvider theme={theme}>
        <Stack direction="column" spacing={5} sx={{ border: "" }}>
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
              Mode Select
            </Typography>
          </div>
          {NavList.map((page) => (
              <Link key={page.pageName} href={page.link}>
                <Button
                  variant="outlined"
                  color="primary"
                  //   endIcon={<TuneIcon />}
                  onClick={handleOpen}
                  sx={{
                    fontSize: "14px",
                    textTransform: "capitalize",
                    minWidth: "25ch",
                  }}
                >
                  {page.pageName}
                </Button>
              </Link>
          ))}
          <div>
          <Typography
            variant="subtitle1"
            className="mb-2 mx-2"
            sx={{
                
                fontSize: "14px",
                whiteSpace: "nowrap",
                fontWeight: "light",
                color: theme.palette.primary.main,
                }}
            >
            Created by: {createdBy.map((name) => name + " & ").splice(0, 2).join("").slice(0, -2)}
            </Typography>
          </div>

                

          
        </Stack>
      </ThemeProvider>
    </div>
  );
}

export default ModeSelect;
