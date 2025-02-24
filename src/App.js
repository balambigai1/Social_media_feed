import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/feed/Home";
import { AuthProvider } from "./components/context/AuthContext";
import Login from "./components/feed/Login";
import Register from "./components/feed/Register";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
                <Home />  
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
