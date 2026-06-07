import { notFound } from 'next/navigation';
import { fetchExamDetail } from '@/lib/dashboard/queries';
import ExamDetailClient from './ExamDetailClient';

export const dynamic = 'force-dynamic';

export default async function ExamDetailPage({ params }) {
  const { examId } = await params;
  const detail = await fetchExamDetail(examId);
  if (!detail) notFound();

  return (
    <ExamDetailClient
      examId={examId}
      initialExam={detail.exam}
      initialDataGrid={detail.dataGrid}
      initialTime={detail.time}
    />
  );
}
