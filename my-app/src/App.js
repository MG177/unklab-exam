import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./page/Login";
import Getstarted from "./page/Getstarted";
// import Questions from "./components/Question";
// import Option from "./components/Option";
import ScoreCountdown from "./page/ScoreCountdown";
import Exam from "./page/Exam";
import Score from "./page/Score";
import Testing from "./page/Testing";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/started" element={<Getstarted />} />
        <Route path="/score-countdown" element={<ScoreCountdown />} />
        <Route path="/exam" element={<Exam />} />
        <Route path="/score" element={<Score />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
