import React, { lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MoonLoader } from 'react-spinners';

import ScoreCountdown from './page/score/ScoreCountdown';
import Testing from './page/testing';
import PageDashboard from './page/dashboard/PageDashboard';

import ProtectedRoute from './utils/ProtectedRoute';
import AuthContextLayout from './contexts/AuthContextLayout';
import QuestionContextLayout from './contexts/QuestionContextLayout';
import { wait } from '@testing-library/user-event/dist/utils';
import { Suspense } from 'react';
import HomepageDashboard from './page/dashboard/HomepageDashboard';

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
              path="/exam/:examId" // Include ":session" in the path
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
              path="/dashboard/*"
              element={
                <ProtectedRoute>
                  <HomepageDashboard />
                </ProtectedRoute>
              }
            />
            {/* <Route element={<QuestionContextLayout />}>
              <Route
                path="/dashboard/:session/:examId" // Include ":session" in the path
                element={
                  <ProtectedRoute>
                    <PageDashboard />
                  </ProtectedRoute>
                }
              />
            </Route> */}
            {/* <Route path='/login' element={<Login />} /> */}
            <Route path="*" element={<Navigate to="/" />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Suspense>
  );
}

export default App;
