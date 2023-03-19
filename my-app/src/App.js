import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./page/Login";
// import Getstarted from "./page/Getstarted";
// import Questions from "./components/Question";
// import Option from "./components/Option";
import ScoreCountdown from "./page/ScoreCountdown";
import Exam from "./page/Exam";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/score-countdown" element={<ScoreCountdown />} />
        <Route path="/exam" element={<Exam />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
