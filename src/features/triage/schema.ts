import { z } from 'zod';

import type { TriageGroup, TriageQuestion, TriageSession } from './types';

export const triageOptionSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  description: z.string().optional(),
  score: z.number().int().min(0).max(10),
  flags: z.array(z.string()).optional(),
  nextQuestionId: z.string().optional(),
  terminalSeverity: z.enum(['emergency', 'urgent', 'non_urgent']).optional(),
});

export const triageQuestionSchema = z.object({
  id: z.string().min(1),
  groupId: z.string().min(1),
  title: z.string().min(1),
  helperText: z.string().min(1),
  options: z.array(triageOptionSchema).min(1),
});

export const triageGroupSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  entryQuestionId: z.string().min(1),
});

export const triageSessionSchema = z.object({
  selectedGroupId: z.string().nullable(),
  currentQuestionId: z.string().nullable(),
  answers: z.array(
    z.object({
      questionId: z.string().min(1),
      answerId: z.string().min(1),
      scoreDelta: z.number().int().min(0).max(10),
      flags: z.array(z.string()),
    }),
  ),
  score: z.number().int().min(0),
  flags: z.array(z.string()),
  result: z
    .object({
      severity: z.enum(['emergency', 'urgent', 'non_urgent']),
      title: z.string().min(1),
      summary: z.string().min(1),
      action: z.string().min(1),
      watchouts: z.array(z.string()),
      reason: z.string().min(1),
      terminatedEarly: z.boolean(),
      recommendedResource: z.enum(['pharmacy', 'center', 'hospital', 'none']),
    })
    .nullable(),
});

export function parseTriageQuestions(questions: readonly TriageQuestion[]) {
  return z.array(triageQuestionSchema).parse(questions) as TriageQuestion[];
}

export function parseTriageGroups(groups: readonly TriageGroup[]) {
  return z.array(triageGroupSchema).parse(groups) as TriageGroup[];
}

export function parseTriageSession(session: TriageSession) {
  return triageSessionSchema.parse(session) as TriageSession;
}
