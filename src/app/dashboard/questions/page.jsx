import { fetchQuestionBanks } from '@/lib/dashboard/queries';
import QuestionsClient from './QuestionsClient';

export const dynamic = 'force-dynamic';

export default async function DashboardQuestionsPage() {
  const banks = await fetchQuestionBanks();
  return <QuestionsClient initialBanks={banks} />;
}
