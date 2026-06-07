import { notFound } from 'next/navigation';
import { fetchQuestionBank } from '@/lib/dashboard/queries';
import QuestionEditorClient from './QuestionEditorClient';

export const dynamic = 'force-dynamic';

export default async function QuestionEditorPage({ params }) {
  const { questionId } = await params;
  const bank = await fetchQuestionBank(questionId);
  if (!bank) notFound();
  return <QuestionEditorClient initialBank={bank} />;
}
