export type TriageSeverity = 'emergency' | 'urgent' | 'non_urgent';

export type TriageGroupId =
  | 'travel_digestive'
  | 'travel_fever'
  | 'travel_cold'
  | 'travel_head'
  | 'travel_skin'
  | 'travel_heat'
  | 'travel_eyes_ears'
  | 'travel_injury'
  | 'travel_mind_sleep'
  | 'travel_meds'
  | 'travel_unsure'
  | 'respiratory'
  | 'circulation'
  | 'digestive'
  | 'neurologic'
  | 'eyes'
  | 'ears'
  | 'skin'
  | 'musculoskeletal'
  | 'pregnancy'
  | 'general'
  | 'other';

export type TriageFlag =
  | 'altered_consciousness'
  | 'respiratory_distress'
  | 'cyanosis'
  | 'active_seizure'
  | 'chest_pain_emergency'
  | 'stroke_sign'
  | 'sudden_vision_loss'
  | 'severe_bleeding'
  | 'allergic_airway'
  | 'pregnancy_emergency'
  | 'open_fracture_or_ischemia'
  | 'dehydration_severe'
  | 'travel_risk_context';

export type TriageAnswerOption = {
  id: string;
  label: string;
  description?: string;
  score: number;
  flags?: TriageFlag[];
  nextQuestionId?: string;
  terminalSeverity?: TriageSeverity;
};

export type TriageQuestion = {
  id: string;
  groupId: TriageGroupId | 'universal' | 'context';
  title: string;
  helperText: string;
  options: readonly TriageAnswerOption[];
};

export type TriageGroup = {
  id: TriageGroupId;
  title: string;
  description: string;
  entryQuestionId: string;
};

export type TriageAnswerRecord = {
  questionId: string;
  answerId: string;
  scoreDelta: number;
  flags: TriageFlag[];
};

export type TriageResult = {
  severity: TriageSeverity;
  title: string;
  summary: string;
  action: string;
  watchouts: string[];
  reason: string;
  terminatedEarly: boolean;
  recommendedResource: 'pharmacy' | 'center' | 'hospital' | 'none';
};

export type TriageSession = {
  selectedGroupId: TriageGroupId | null;
  currentQuestionId: string | null;
  answers: TriageAnswerRecord[];
  score: number;
  flags: TriageFlag[];
  result: TriageResult | null;
};
