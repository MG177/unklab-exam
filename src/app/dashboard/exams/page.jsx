import { fetchExamsList } from '@/lib/dashboard/queries';
import ExamsClient from './ExamsClient';

export const dynamic = 'force-dynamic';

export default async function DashboardExamsPage() {
  const exams = await fetchExamsList();
  return <ExamsClient initialExams={exams} />;
}
