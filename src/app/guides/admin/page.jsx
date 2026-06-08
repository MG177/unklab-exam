'use client';

import { useState } from 'react';
import GuideShell from '@/components/guides/GuideShell';
import { adminSteps } from '@/components/guides/guide-content';

export default function AdminGuidePage() {
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <GuideShell
      title="Admin guide"
      subtitle="Set up question banks, create exams, start sessions, and review scores."
      variant="admin"
      steps={adminSteps}
      currentStep={currentStep}
      onStepChange={setCurrentStep}
    />
  );
}
