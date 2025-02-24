
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useState } from "react";
import Login from "./Login";
import Register from "./Register";


export default function Header() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  const handleLogin = (user) => {
    console.log(user);
    setIsLoggedIn(true);
    setUsername(user);
    setIsLoginOpen(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
  };
  console.log(isLoggedIn);

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Social Media Feed
        </Typography>
        {isLoggedIn ? (
          <Box>
            <Typography component="span" sx={{ mr: 2 }}>
              Welcome, {username}
            </Typography>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        ) : (
          <Box>
            <Button color="inherit" onClick={() => setIsLoginOpen(true)}>
              Login
            </Button>
            <Button color="inherit" onClick={() => setIsRegisterOpen(true)}>
              Register
            </Button>
          </Box>
        )}
      </Toolbar>
      <Login
        open={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLogin={handleLogin}
      />
      <Register
        open={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
      />
    </AppBar>
  );
}
