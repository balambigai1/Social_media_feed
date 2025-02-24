import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  TextField,
  Button
} from "@mui/material";

function Register({ open, onClose }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await axios.post("http://localhost:8081/api/auth/register", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      // Redirect to login after successful registration
      navigate("/login");
    } catch (error) {
      setError(
        error.response?.data?.message || "An error occurred during registration"
      );
    }
  };

  return (
    <div>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Register</DialogTitle>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              required
              autoFocus
              margin="dense"
              label="Username"
              type="text"
              fullWidth
              variant="outlined"
              value={formData.username}
              onChange={handleChange}
            />
            <TextField
              required
              margin="dense"
              label="Email"
              type="email"
              fullWidth
              variant="outlined"
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              label="Password"
              type="password"
              fullWidth
              variant="outlined"
              value={formData.password}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              label="confirmPassword"
              type="password"
              fullWidth
              variant="outlined"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="submit">Register</Button>
          </DialogActions>
        </form>
        <div className="mx-auto text-center">
          <p className="text-gray-600 ">
            Already have an account?
            <span
              onClick={() => navigate("/login")}
              className="text-blue-500 cursor-pointer hover:underline"
            >
              Login here
            </span>
          </p>
        </div>
      </Dialog>
    </div>
  );
}

export default Register;
 