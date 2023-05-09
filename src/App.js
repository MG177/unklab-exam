import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './page/login/Login';
import Getstarted from './page/login/Getstarted';
import ScoreCountdown from './page/score/ScoreCountdown';
import Exam from './page/Exam';
import Score from './page/score/Score';
import Testing from './page/testing';
import PageDashboard from './page/dashboard/PageDashboard';

import ProtectedRoute from './utils/ProtectedRoute';
import AuthContextLayout from './contexts/AuthContextLayout';
import QuestionContextLayout from './contexts/QuestionContextLayout';

function App() {
  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route element={<AuthContextLayout />}>
          <Route path="/" element={<Login />} />
          <Route
            path="/started"
            element={
              <ProtectedRoute>
                <Getstarted />
              </ProtectedRoute>
            }
          />
          <Route
            path="/waiting"
            element={
              <ProtectedRoute>
                <ScoreCountdown />
              </ProtectedRoute>
            }
          />
          <Route
            path="/exam/:examId"
            element={
              <ProtectedRoute>
                <Exam />
              </ProtectedRoute>
            }
          />
          <Route
            path="/score"
            element={
              <ProtectedRoute>
                <Score />
              </ProtectedRoute>
            }
          />
          <Route
            path="/testing"
            element={
              <ProtectedRoute>
                <Testing />
              </ProtectedRoute>
            }
          />
          <Route element={<QuestionContextLayout />}>
            <Route
              path="/dashboard/:examId"
              element={
                <ProtectedRoute>
                  <PageDashboard />
                </ProtectedRoute>
              }
            />
          </Route>
          {/* <Route path='/login' element={<Login />} /> */}
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
