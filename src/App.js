import React, { lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MoonLoader } from 'react-spinners';

import ScoreCountdown from './page/score/ScoreCountdown';

import ProtectedRoute from './utils/ProtectedRoute';
import AuthContextLayout from './contexts/AuthContextLayout';
import { Suspense } from 'react';

import Dashboard from './page/dashboard/Dashboard';
import DashboardHome from './page/dashboard/DashboardHome';
import DashboardQuestion from './page/dashboard/DashboardQuestion';
import QuestionEditor from './page/dashboard/QuestionEditor';
import ExamPage from './page/dashboard/ExamPage';

const Login = lazy(() => import('./page/login/Login'));
const Getstarted = lazy(() => import('./page/login/Getstarted'));
const Exam = lazy(() => import('./page/Exam'));
const Score = lazy(() => import('./page/score/Score'));

function App() {
  return (
    <Suspense
      fallback={
        <div className="h-[100vh] flex justify-center items-center">
          <MoonLoader color="#B55FFE" size={60} />
        </div>
      }
    >
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
                  <Score />
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
              path="/exam" // Include ":session" in the path
              element={
                <ProtectedRoute>
                  <Exam />
                </ProtectedRoute>
              }
            />
            <Route path="/dashboard" element={<Dashboard />}>
              <Route path="exams" element={<DashboardHome />} />
              <Route path="questions" element={<DashboardQuestion />} />
              <Route path="*" element={<Navigate to="exams" />} />
            </Route>
            <Route path="/dashboard">
              <Route path="exams/:examId" element={<ExamPage />} />
              <Route
                path="questions/:questionId"
                element={<QuestionEditor />}
              />
            </Route>

            <Route path="*" element={<Navigate to="/" />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Suspense>
  );
}

export default App;
