import { triageGroups, triageQuestions, triageSeverityCopy } from './data';
import { parseTriageSession } from './schema';
import type {
  TriageAnswerOption,
  TriageAnswerRecord,
  TriageFlag,
  TriageGroupId,
  TriageQuestion,
  TriageResult,
  TriageSession,
  TriageSeverity,
} from './types';

const pharmacyEligibleGroups = new Set<TriageGroupId>([
  'travel_digestive',
  'travel_cold',
  'travel_head',
  'travel_skin',
  'travel_heat',
  'travel_eyes_ears',
  'travel_injury',
  'travel_mind_sleep',
  'travel_meds',
  'travel_unsure',
  'digestive',
  'skin',
  'musculoskeletal',
  'other',
]);

const emergencyFlags = new Set<TriageFlag>([
  'altered_consciousness',
  'respiratory_distress',
  'cyanosis',
  'active_seizure',
  'chest_pain_emergency',
  'stroke_sign',
  'sudden_vision_loss',
  'severe_bleeding',
  'allergic_airway',
  'pregnancy_emergency',
  'open_fracture_or_ischemia',
  'dehydration_severe',
]);

const questionMap = new Map<string, TriageQuestion>(triageQuestions.map((question) => [question.id, question]));

const reasonByFlag: Record<TriageFlag, string> = {
  altered_consciousness: 'Hay alteracion de la conciencia o desmayo reciente.',
  respiratory_distress: 'Hay dificultad respiratoria importante.',
  cyanosis: 'Se reporta coloracion azulada o morada.',
  active_seizure: 'Hay convulsion activa o muy reciente.',
  chest_pain_emergency: 'El dolor de pecho sugiere una urgencia mayor.',
  stroke_sign: 'Aparecen signos neurologicos agudos.',
  sudden_vision_loss: 'La vision disminuyo de forma brusca.',
  severe_bleeding: 'Hay sangrado importante o vomito con sangre.',
  allergic_airway: 'La alergia puede comprometer la respiracion.',
  pregnancy_emergency: 'Hay dolor o sangrado importante durante el embarazo.',
  open_fracture_or_ischemia: 'La lesion puede comprometer hueso, riego o sensibilidad.',
  dehydration_severe: 'Aparecen senales fuertes de deshidratacion o abdomen alarmante.',
  travel_risk_context: 'El contexto de viaje aumenta el umbral de precaucion.',
};

function createResult(
  severity: TriageSeverity,
  reason: string,
  terminatedEarly: boolean,
  selectedGroupId: TriageGroupId | null,
): TriageResult {
  const copy = triageSeverityCopy[severity];
  const recommendedResource =
    severity === 'emergency'
      ? 'hospital'
      : severity === 'urgent'
        ? 'center'
        : selectedGroupId && pharmacyEligibleGroups.has(selectedGroupId)
          ? 'pharmacy'
          : 'none';

  return {
    severity,
    title: copy.title,
    summary: copy.summary,
    action: copy.action,
    watchouts: copy.watchouts,
    reason,
    terminatedEarly,
    recommendedResource,
  };
}

function getSeverityFromScore(score: number): TriageSeverity {
  if (score >= 8) {
    return 'emergency';
  }

  if (score >= 4) {
    return 'urgent';
  }

  return 'non_urgent';
}

export function createInitialSession(): TriageSession {
  return parseTriageSession({
    selectedGroupId: null,
    currentQuestionId: null,
    answers: [],
    score: 0,
    flags: [],
    result: null,
  });
}

export function getQuestionById(questionId: string | null) {
  return questionId ? questionMap.get(questionId) ?? null : null;
}

export function selectGroup(session: TriageSession, groupId: TriageGroupId): TriageSession {
  return parseTriageSession({
    ...session,
    selectedGroupId: groupId,
    currentQuestionId: getEntryQuestionId(groupId),
    result: null,
  });
}

function buildAnswerRecord(questionId: string, option: TriageAnswerOption): TriageAnswerRecord {
  return {
    questionId,
    answerId: option.id,
    scoreDelta: option.score,
    flags: option.flags ?? [],
  };
}

export function answerCurrentQuestion(session: TriageSession, answerId: string): TriageSession {
  const currentQuestion = getQuestionById(session.currentQuestionId);

  if (!currentQuestion) {
    return session;
  }

  const selectedOption = currentQuestion.options.find((option) => option.id === answerId);

  if (!selectedOption) {
    return session;
  }

  const answerRecord = buildAnswerRecord(currentQuestion.id, selectedOption);
  const nextFlags = [...new Set([...session.flags, ...answerRecord.flags])];
  const nextScore = session.score + answerRecord.scoreDelta;
  const nextAnswers = [...session.answers, answerRecord];
  const emergencyFlag = nextFlags.find((flag) => emergencyFlags.has(flag));

  if (emergencyFlag) {
    return parseTriageSession({
      ...session,
      answers: nextAnswers,
      score: nextScore,
      flags: nextFlags,
      currentQuestionId: null,
      result: createResult('emergency', reasonByFlag[emergencyFlag], true, session.selectedGroupId),
    });
  }

  if (selectedOption.terminalSeverity) {
    return parseTriageSession({
      ...session,
      answers: nextAnswers,
      score: nextScore,
      flags: nextFlags,
      currentQuestionId: null,
      result: createResult(
        selectedOption.terminalSeverity,
        `La combinacion de respuestas en ${currentQuestion.title.toLowerCase()} orienta esta prioridad.`,
        true,
        session.selectedGroupId,
      ),
    });
  }

  const nextQuestionId =
    selectedOption.nextQuestionId ??
    (currentQuestion.id === 'universal_red_flags' && session.selectedGroupId
      ? getEntryQuestionId(session.selectedGroupId)
      : null);

  if (!nextQuestionId && currentQuestion.id === 'universal_red_flags' && !session.selectedGroupId) {
    return parseTriageSession({
      ...session,
      answers: nextAnswers,
      score: nextScore,
      flags: nextFlags,
      currentQuestionId: null,
      result: null,
    });
  }

  if (!nextQuestionId) {
    const severity = getSeverityFromScore(nextScore);

    return parseTriageSession({
      ...session,
      answers: nextAnswers,
      score: nextScore,
      flags: nextFlags,
      currentQuestionId: null,
      result: createResult(
        severity,
        'La prioridad final se calculo con la evidencia acumulada durante la entrevista.',
        false,
        session.selectedGroupId,
      ),
    });
  }

  return parseTriageSession({
    ...session,
    answers: nextAnswers,
    score: nextScore,
    flags: nextFlags,
    currentQuestionId: nextQuestionId,
    result: null,
  });
}

export function restartSession(): TriageSession {
  return createInitialSession();
}

function getEntryQuestionId(groupId: TriageGroupId) {
  return triageGroups.find((group) => group.id === groupId)?.entryQuestionId ?? 'unsure_start';
}
