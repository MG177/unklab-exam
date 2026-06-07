export function examStatus(exam) {
  const now = Date.now();
  if (exam.endTime && new Date(exam.endTime).getTime() > now) return 'live';
  if (exam.endTime) return 'ended';
  return 'draft';
}

export function mergeExamScores(scores, exam) {
  const students = exam?.students ?? [];
  const list = Array.isArray(scores) ? scores : [];
  return students.map((item) => {
    const row = list.find((x) => x.studentId === item.studentId);
    if (!row) return { ...item, score: '', totalScore: '' };
    return {
      ...item,
      isSubmitted: row.isSubmitted,
      score: row.score,
      totalScore: Math.round(row.totalScore),
    };
  });
}
