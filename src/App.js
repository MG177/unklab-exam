import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './page/login/Login';
import Getstarted from './page/login/Getstarted';
import ScoreCountdown from './page/score/ScoreCountdown';
import Exam from './page/Exam';
import Score from './page/score/Score';
import Testing from './page/testing';
import PageDashboard from './page/dashboard/PageDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/started' element={<Getstarted />} />
        <Route path='/score-countdown' element={<ScoreCountdown />} />
        <Route path='/exam/' element={<Exam />} />
        <Route path='/score' element={<Score />} />
        <Route path='/testing' element={<Testing />} />
        <Route path='/dashboard' element={<PageDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
