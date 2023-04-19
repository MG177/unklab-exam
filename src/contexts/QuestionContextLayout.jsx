import React from 'react';
import { Outlet } from 'react-router-dom';
import { QuestionProvider } from './QuestionContext';

export default function QuestionContextLayout() {
  return (
    <QuestionProvider>
      <Outlet />
    </QuestionProvider>
  );
}
