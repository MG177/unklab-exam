import React from 'react';
import { saveAs } from 'file-saver';

export default function DownloadTemplateButton() {
  const handleDownload = () => {
    const csvData = `No.,Id,Name\n1,S2200521,"MG"\n2,S2200521177,Dev`;
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, 'student_template.csv');
  };
  return (
    <button
      onClick={handleDownload}
      className="cursor-pointer flex items-center justify-center py-2 px-5 rounded-2xl bg-whitePlus border border-accent1 shadow-md z-50 h-fit self-end"
    >
      Download CSV Template
    </button>
  );
}
