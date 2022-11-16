import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import { Link, useHistory } from "react-router-dom";
import { useSnackbar } from "notistack";

import "./Header.css";

const Header = ({ children, hasHiddenAuthButtons }) => {
  let history = useHistory();
  const { enqueueSnackbar } = useSnackbar();

  const logout = () => {
    localStorage.clear();
    history.push("/");
    window.location.reload();
    enqueueSnackbar("Logged Out", { variant: "success" });
  };

  return (
    <Box className="header">
      <Box className="header-title">
        <img src="logo_light.svg" alt="QKart-icon"></img>
      </Box>
      <Stack spacing={2} direction={"row"} alignItems={"center"}>
        {hasHiddenAuthButtons === "register/login" ? (
          <Link className="link" to="/">
            <Button startIcon={<ArrowBackIcon />} variant="text">
              Back to explore
            </Button>
          </Link>
        ) : (
          <></>
        )}
        {hasHiddenAuthButtons === "loggedIn" ? (
          <>
            <Avatar alt="crio.do" src="avatar.png" /> {children}
            <Button variant="text" onClick={logout}>
              Logout
            </Button>
          </>
        ) : (
          <></>
        )}
        {hasHiddenAuthButtons === "loggedOut" ? (
          <>
            <Link className="link" to="/login">
              <Button variant="text">Login</Button>
            </Link>
            <Link className="link" to="/register">
              <Button variant="contained">Register</Button>
            </Link>
          </>
        ) : (
          <></>
        )}
      </Stack>
    </Box>
  );
};

export default Header;
