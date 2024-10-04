import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { RegisterUrl } from "../Constants";
import { UserRoleOptions } from "../helpers/enums";
import { MenuItem } from "@mui/material";

const defaultTheme = createTheme();

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState();
  const [username, setUsername] = useState();
  const [password1, setPassword1] = useState();
  const [password2, setPassword2] = useState();
  const [role, setRole] = useState("USER");
  const [email, setEmail] = useState();
  const [contactNo, setContactNo] = useState();
  const [registrationCode, setRegistrationCode] = useState("");
  const [acceptTnC, setAcceptTnC] = useState(false);
  const [message, setMessage] = useState();

  const submitRegister = (e) => {
    setRole("Officer");
    e.preventDefault();
    if (
      !(
        name &&
        username &&
        password1 &&
        role &&
        email &&
        contactNo &&
        registrationCode
      )
    ) {
      setMessage("Please complete all fields");
    } else if (!acceptTnC) {
      setMessage("Please accept the terms and conditions");
    } else if (isNaN(Number(contactNo))) {
      setMessage("Please enter a valid Contact no.");
    } else if (password1 !== password2) {
      setMessage("Passwords do not match. Please check again");
    } else {
      axios
        .post(RegisterUrl, {
          name,
          username,
          password: password1,
          role,
          email,
          contactNo,
          secretCode: registrationCode,
        })
        .then((response) => {
          setMessage("Registration Successful.");
          // console.log(response);
          navigate("/projects");
        })
        .catch((error) => {
          setMessage(error.response.data.message);
          console.log(error);
        });
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage:
              "url(https://source.unsplash.com/random?wallpapers)",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5}>
          <Box
            sx={{
              height: "100%",
              mx: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Register
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={submitRegister}
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                name="name"
                label="Name"
                autoFocus
                size="small"
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="Username"
                label="Username"
                autoFocus
                size="small"
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                size="small"
                onChange={(e) => {
                  setPassword1(e.target.value);
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Repeat Password"
                type="password"
                size="small"
                onChange={(e) => {
                  setPassword2(e.target.value);
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="email"
                label="Email Address"
                autoComplete="email"
                size="small"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="phone"
                label="Contact No"
                autoComplete="phone"
                size="small"
                value={contactNo}
                onChange={(e) => {
                  setContactNo(e.target.value);
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="registeration-code"
                label="Registeration Code"
                size="small"
                value={registerationCode}
                onChange={(e) => {
                  setRegistrationCode(e.target.value);
                }}
              />
              <TextField
                margin="normal"
                value={role}
                defaultValue={role}
                required
                fullWidth
                name="user-role"
                label="Role"
                size="small"
                select
                sx={{ bgcolor: "#fff" }}
                onChange={(e) => {
                  setRole(e.target.value);
                }}
              >
                {UserRoleOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={acceptTnC}
                    color="primary"
                    onChange={(e) => setAcceptTnC(e.target.checked)}
                  />
                }
                label="I accept the terms and conditions"
              />
              <Typography sx={{ color: "red" }}>{message}</Typography>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Register
              </Button>
              <Typography sx={{ color: "#008dcf" }}>
                <Link to="/login">{"Already have an account? Login"}</Link>
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
