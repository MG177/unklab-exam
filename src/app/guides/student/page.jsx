'use client';

import { useState } from 'react';
import GuideShell from '@/components/guides/GuideShell';
import { studentSteps } from '@/components/guides/guide-content';

export default function StudentGuidePage() {
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <GuideShell
      title="Student guide"
      subtitle="Log in, accept the rules, take the exam, and view your results."
      variant="student"
      steps={studentSteps}
      currentStep={currentStep}
      onStepChange={setCurrentStep}
    />
  );
}
