import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Register.css";
import { useHistory, Link } from "react-router-dom";

const Register = () => {
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const element = e.target.parentElement.textContent;

    if (element.startsWith("Username")) {
      setUsername(e.target.value.trim());
    } else if (element.startsWith("Password")) {
      setPassword(e.target.value.trim());
    } else {
      setConfirmPassword(e.target.value.trim());
    }
  };

  const cleanUp = () => {
    setUsername("");
    setPassword("");
    setConfirmPassword("");
  };

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement the register function
  /**
   * Definition for register handler
   * - Function to be called when the user clicks on the register button or submits the register form
   *
   * @param {{ username: string, password: string, confirmPassword: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/register"
   *
   * Example for successful response from backend for the API call:
   * HTTP 201
   * {
   *      "success": true,
   * }
   *
   * Example for failed response from backend for the API call:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Username is already taken"
   * }
   */
  const register = async () => {
    const url = `${config.endpoint}/auth/register`;
    const body = { username, password, confirmPassword };

    if (validateInput(body)) {
      setIsLoading(true);
      await axios
        .post(url, { username: body.username, password: body.password })
        .then((res) => {
          cleanUp();
          enqueueSnackbar("Registered Successfully", { variant: "success" });
          history.push("/login");
        })
        .catch((error) => {
          if (error.response.status === 400) {
            enqueueSnackbar(error.response.data.message, { variant: "error" });
          } else {
            enqueueSnackbar(
              "Something went wrong. Check if backend is running, reachable and return valid JSON / Check backend endpoint",
              {
                variant: "error",
              }
            );
          }
        });
      setIsLoading(false);
    }
  };

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement user input validation logic
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string, confirmPassword: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that username field is not less than 6 characters in length - "Username must be at least 6 characters"
   * -    Check that password field is not an empty value - "Password is a required field"
   * -    Check that password field is not less than 6 characters in length - "Password must be at least 6 characters"
   * -    Check that confirmPassword field has the same value as password field - Passwords do not match
   */
  const validateInput = (data) => {
    if (data.username.trim() === "") {
      enqueueSnackbar("Username is a required field", { variant: "warning" });
      return false;
    } else if (data.username.trim().length < 6) {
      enqueueSnackbar("Username must be at least 6 characters", { variant: "warning" });
      return false;
    } else if (data.password.trim() === "") {
      enqueueSnackbar("Password is a required field", { variant: "warning" });
      return false;
    } else if (data.password.trim().length < 6) {
      enqueueSnackbar("Password must be at least 6 characters", { variant: "warning" });
      return false;
    } else if (data.password !== data.confirmPassword) {
      enqueueSnackbar("Passwords do not match", { variant: "warning" });
      return false;
    } else {
      return true;
    }
  };

  return (
    <Box display="flex" flexDirection="column" justifyContent="space-between" minHeight="100vh">
      <Header hasHiddenAuthButtons={"register/login"} />
      <Box className="content">
        <Stack spacing={2} className="form">
          <h2 className="title">Register</h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            placeholder="Enter Username"
            fullWidth
            value={username}
            onChange={handleChange}
          />
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            helperText="Password must be atleast 6 characters length"
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
            value={password}
            onChange={handleChange}
          />
          <TextField
            id="confirmPassword"
            variant="outlined"
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            fullWidth
            value={confirmPassword}
            onChange={handleChange}
          />
          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <CircularProgress />
            </Box>
          ) : (
            <Button className="button" variant="contained" onClick={register}>
              Register Now
            </Button>
          )}
          <p className="secondary-action">
            Already have an account?{" "}
            <Link className="link" to="/login">
              Login here
            </Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;
