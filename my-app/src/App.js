import React, { Component } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Getstarted from "./page/Getstarted";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Getstarted />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
