'use client';

import React from 'react';
import { Download } from 'lucide-react';
import { saveAs } from 'file-saver';
import { Button } from '@/components/ui/button';

export default function DownloadTemplateButton() {
  const handleDownload = () => {
    const csvData = `No.,Id,Name\n1,S2200521,"MG"\n2,S2200521177,Dev`;
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, 'student_template.csv');
  };

  return (
    <Button variant="secondary" size="sm" onClick={handleDownload}>
      <Download className="h-4 w-4" />
      Download CSV Template
    </Button>
  );
}
