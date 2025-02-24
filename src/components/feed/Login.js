import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";

function Login({ open, onClose, onLogin }) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post(
      "http://localhost:8081/api/auth/login",
      formData
    );
    login(response.data.token, response.data.user);
    onLogin(response.data.user); 
    navigate("/");
    setFormData({
      email: "",
      password: "",
    });
  } catch (error) {
    setError(error.response?.data?.message || "An error occurred during login");
  }

  onClose();
};


  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Login</DialogTitle>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Email"
              type="email"
              name="email" // ✅ Add this
              fullWidth
              variant="outlined"
              value={formData.email}
              onChange={handleChange}
            />

            <TextField
              required
              margin="dense"
              label="Password"
              type="password"
              name="password" // ✅ Add this
              fullWidth
              variant="outlined"
              value={formData.password}
              onChange={handleChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="submit">Login</Button>
          </DialogActions>
        </form>
        <div className="mt-4 text-center">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-blue-500 cursor-pointer hover:underline"
            >
              Register here
            </span>
          </p>
        </div>
      </Dialog>
    </>
  );
}

export default Login;
