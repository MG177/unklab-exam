import React, { Component } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./page/Login";
import Getstarted from "./page/Getstarted";
import Questions from "./components/Question";
import Option from "./components/Option";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Option />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
