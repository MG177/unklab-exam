export const EXAM_PHASE = {
  LOADING: 'loading',
  TAKING: 'taking',
  WAITING: 'waiting',
  WITHHELD: 'withheld',
  RESULTS: 'results',
};

/** Derive post-exam UI phase from server time and JWT flags. */
export function resolvePostExamPhase(timeRemaining, user) {
  if (!user?.isShowScore) {
    return EXAM_PHASE.WITHHELD;
  }
  if (timeRemaining != null && timeRemaining > 0) {
    return EXAM_PHASE.WAITING;
  }
  return EXAM_PHASE.RESULTS;
}

export function isPostExamPhase(phase) {
  return (
    phase === EXAM_PHASE.WAITING ||
    phase === EXAM_PHASE.WITHHELD ||
    phase === EXAM_PHASE.RESULTS
  );
}
