import type { TriageSeverity } from './types';
import { parseTriageGroups, parseTriageQuestions } from './schema';

export const triageSeverityCopy: Record<
  TriageSeverity,
  {
    title: string;
    summary: string;
    action: string;
    watchouts: string[];
  }
> = {
  non_urgent: {
    title: 'Parece leve por ahora',
    summary: 'Por mis respuestas, no aparecen senales claras de gravedad en este momento.',
    action: 'Puedo empezar con autocuidado, observar como evoluciona y consultar si no mejora.',
    watchouts: ['empeora', 'aparece fiebre alta', 'aparece sangre', 'el dolor se vuelve fuerte'],
  },
  urgent: {
    title: 'Conviene consultar',
    summary: 'No parece una emergencia inmediata, pero mis respuestas sugieren que seria prudente pedir orientacion profesional.',
    action: 'Puedo consultar en farmacia, teleconsulta o consulta medica segun disponibilidad y evolucion.',
    watchouts: ['dura mas de lo esperado', 'me limita mucho', 'no puedo hidratarme bien', 'aparecen nuevos sintomas'],
  },
  emergency: {
    title: 'Busco atencion urgente',
    summary: 'Aparecio una senal de mayor gravedad relacionada con este cuadro.',
    action: 'No conviene seguir manejandolo solo. Tengo que buscar guardia, urgencias o ayuda inmediata.',
    watchouts: ['dificultad para respirar', 'confusion', 'desmayo', 'sangrado o dolor intenso'],
  },
};

export const triageGroups = parseTriageGroups([
  {
    id: 'travel_digestive',
    title: 'Me duele la panza o tengo diarrea',
    description: 'Diarrea, dolor abdominal, retorcijones o cambios al ir al bano.',
    entryQuestionId: 'digestive_start',
  },
  {
    id: 'travel_fever',
    title: 'Tengo fiebre o malestar general',
    description: 'Fiebre, escalofrios, cuerpo cortado, cansancio o decaimiento.',
    entryQuestionId: 'fever_start',
  },
  {
    id: 'travel_head',
    title: 'Me duele la cabeza o estoy mareado',
    description: 'Dolor de cabeza, mareo, debilidad, cansancio o vision rara.',
    entryQuestionId: 'head_start',
  },
  {
    id: 'travel_cold',
    title: 'Tengo tos, garganta o resfrio',
    description: 'Tos, mocos, congestion, dolor de garganta o malestar respiratorio leve.',
    entryQuestionId: 'cold_start',
  },
  {
    id: 'travel_injury',
    title: 'Me lastime o tuve un golpe',
    description: 'Caida, corte, golpe, torcedura o dificultad para apoyar.',
    entryQuestionId: 'injury_start',
  },
  {
    id: 'other',
    title: 'Otros sintomas',
    description: 'Si no aparece en esta primera lista, veo mas opciones.',
    entryQuestionId: 'other_symptoms_start',
  },
] as const);

export const triageQuestions = parseTriageQuestions([
  {
    id: 'other_symptoms_start',
    groupId: 'other',
    title: 'Que otra cosa me esta pasando?',
    helperText: 'Esta segunda lista agrupa sintomas frecuentes que no entraron en la pantalla inicial.',
    options: [
      { id: 'vomit', label: 'Tengo nauseas o vomitos', score: 0, nextQuestionId: 'vomit_start' },
      { id: 'skin', label: 'Me pasa algo en la piel', score: 0, nextQuestionId: 'skin_start' },
      { id: 'allergy', label: 'Tengo una picadura o alergia', score: 0, nextQuestionId: 'allergy_start' },
      { id: 'heat', label: 'Me queme con el sol o tengo mucho calor', score: 0, nextQuestionId: 'heat_start' },
      { id: 'more', label: 'No aparece aca', score: 0, nextQuestionId: 'other_symptoms_more' },
    ],
  },
  {
    id: 'other_symptoms_more',
    groupId: 'other',
    title: 'Veo una lista mas',
    helperText: 'Si todavia no encuentro mi caso, uso estas opciones mas generales.',
    options: [
      { id: 'muscle', label: 'Me duele un musculo o articulacion', score: 0, nextQuestionId: 'muscle_start' },
      { id: 'mind', label: 'Me siento ansioso, debil o raro', score: 0, nextQuestionId: 'mind_start' },
      { id: 'eyes_ears', label: 'Me pasa algo en ojos u oidos', score: 3, terminalSeverity: 'urgent' },
      { id: 'meds', label: 'Tengo dudas con medicacion', score: 3, terminalSeverity: 'urgent' },
      { id: 'still_unsure', label: 'No se bien que tengo', score: 0, nextQuestionId: 'unsure_start' },
    ],
  },
  {
    id: 'digestive_start',
    groupId: 'travel_digestive',
    title: 'Que es lo principal?',
    helperText: 'Empiezo por lo mas frecuente y despues reviso intensidad, duracion y senales de alarma.',
    options: [
      { id: 'diarrhea', label: 'Tengo diarrea', score: 1, nextQuestionId: 'digestive_frequency' },
      { id: 'belly_pain', label: 'Me duele la panza', score: 2, nextQuestionId: 'digestive_pain_intensity' },
      { id: 'both', label: 'Tengo diarrea y dolor', score: 3, nextQuestionId: 'digestive_frequency' },
      { id: 'mild_cramps', label: 'Son retorcijones leves', score: 1, nextQuestionId: 'digestive_duration' },
    ],
  },
  {
    id: 'digestive_frequency',
    groupId: 'travel_digestive',
    title: 'Cuantas veces fui al bano en el ultimo dia?',
    helperText: 'La cantidad ayuda a estimar si puedo manejarlo con hidratacion o conviene consultar.',
    options: [
      { id: 'few', label: '1 a 3 veces', score: 1, nextQuestionId: 'digestive_blood' },
      { id: 'medium', label: '4 a 6 veces', score: 3, nextQuestionId: 'digestive_blood' },
      { id: 'many', label: 'Mas de 6 veces', score: 5, nextQuestionId: 'digestive_blood' },
    ],
  },
  {
    id: 'digestive_blood',
    groupId: 'travel_digestive',
    title: 'Hay sangre o color negro en la materia fecal?',
    helperText: 'Esto es una senal importante en cuadros digestivos.',
    options: [
      { id: 'yes', label: 'Si', score: 9, flags: ['severe_bleeding'] },
      { id: 'unsure', label: 'No estoy seguro', score: 4, terminalSeverity: 'urgent' },
      { id: 'no', label: 'No', score: 0, nextQuestionId: 'digestive_liquids' },
    ],
  },
  {
    id: 'digestive_liquids',
    groupId: 'travel_digestive',
    title: 'Puedo tomar liquidos?',
    helperText: 'Si puedo hidratarme, muchas diarreas leves se pueden observar al inicio.',
    options: [
      { id: 'yes', label: 'Si, tomo y orino normal', score: 0, nextQuestionId: 'digestive_duration' },
      { id: 'less', label: 'Tomo poco u orino menos', score: 4, terminalSeverity: 'urgent' },
      { id: 'no', label: 'Casi no puedo tomar o casi no orino', score: 9, flags: ['dehydration_severe'] },
    ],
  },
  {
    id: 'digestive_pain_intensity',
    groupId: 'travel_digestive',
    title: 'Que tan fuerte es el dolor?',
    helperText: 'El dolor intenso o que no deja moverme cambia la prioridad.',
    options: [
      { id: 'mild', label: 'Leve, va y viene', score: 1, nextQuestionId: 'digestive_duration' },
      { id: 'moderate', label: 'Moderado y molesto', score: 3, nextQuestionId: 'digestive_duration' },
      { id: 'severe', label: 'Muy fuerte o la panza esta dura', score: 9, flags: ['dehydration_severe'] },
    ],
  },
  {
    id: 'digestive_duration',
    groupId: 'travel_digestive',
    title: 'Hace cuanto empezo?',
    helperText: 'Duracion y evolucion ayudan a decidir si alcanza autocuidado o conviene consultar.',
    options: [
      { id: 'today', label: 'Hoy o ayer y no empeora', score: 0, terminalSeverity: 'non_urgent' },
      { id: 'two_days', label: 'Hace 2 a 3 dias', score: 3, terminalSeverity: 'urgent' },
      { id: 'worse', label: 'Esta empeorando', score: 4, terminalSeverity: 'urgent' },
    ],
  },
  {
    id: 'vomit_start',
    groupId: 'travel_digestive',
    title: 'Puedo retener liquidos?',
    helperText: 'Con vomitos, lo mas importante es evitar deshidratacion.',
    options: [
      { id: 'yes', label: 'Si, aunque me da nausea', score: 1, nextQuestionId: 'vomit_duration' },
      { id: 'sometimes', label: 'A veces, pero vomite varias veces', score: 4, terminalSeverity: 'urgent' },
      { id: 'no', label: 'No puedo retener nada', score: 9, flags: ['dehydration_severe'] },
    ],
  },
  {
    id: 'vomit_duration',
    groupId: 'travel_digestive',
    title: 'Hay dolor fuerte, fiebre o sangre?',
    helperText: 'Esas combinaciones hacen que convenga consultar antes.',
    options: [
      { id: 'none', label: 'No, solo nauseas o vomitos leves', score: 0, terminalSeverity: 'non_urgent' },
      { id: 'fever_pain', label: 'Si, fiebre o dolor fuerte', score: 5, terminalSeverity: 'urgent' },
      { id: 'blood', label: 'Si, sangre o vomito oscuro', score: 9, flags: ['severe_bleeding'] },
    ],
  },
  {
    id: 'fever_start',
    groupId: 'travel_fever',
    title: 'Como me siento con la fiebre o malestar?',
    helperText: 'No toda fiebre es urgente, pero intensidad y acompanantes importan.',
    options: [
      { id: 'mild', label: 'Algo decaido, pero puedo moverme', score: 1, nextQuestionId: 'fever_duration' },
      { id: 'bad', label: 'Me siento bastante mal', score: 4, nextQuestionId: 'fever_alarm' },
      { id: 'very_bad', label: 'Me siento muy mal o confundido', score: 9, flags: ['altered_consciousness'] },
    ],
  },
  {
    id: 'fever_duration',
    groupId: 'travel_fever',
    title: 'Hace cuanto empezo?',
    helperText: 'Si es reciente y leve puedo observar, pero si persiste conviene consultar.',
    options: [
      { id: 'short', label: 'Menos de 24 horas', score: 1, nextQuestionId: 'fever_alarm' },
      { id: 'two_days', label: 'Mas de 24 a 48 horas', score: 3, nextQuestionId: 'fever_alarm' },
      { id: 'long', label: 'Mas de 2 dias o empeora', score: 5, terminalSeverity: 'urgent' },
    ],
  },
  {
    id: 'fever_alarm',
    groupId: 'travel_fever',
    title: 'Tengo alguno de estos sintomas?',
    helperText: 'Estas senales hacen que la fiebre necesite mas atencion.',
    options: [
      { id: 'neck', label: 'Cuello duro o dolor de cabeza muy fuerte', score: 9, flags: ['stroke_sign'] },
      { id: 'breathing', label: 'Me cuesta respirar o tengo dolor fuerte', score: 9, flags: ['respiratory_distress'] },
      { id: 'rash', label: 'Manchas en la piel o mucho decaimiento', score: 5, terminalSeverity: 'urgent' },
      { id: 'none', label: 'Ninguno de estos', score: 0, terminalSeverity: 'non_urgent' },
    ],
  },
  {
    id: 'head_start',
    groupId: 'travel_head',
    title: 'Como es el dolor de cabeza o mareo?',
    helperText: 'Primero vemos si parece cansancio, calor o algo que requiere consulta.',
    options: [
      { id: 'mild', label: 'Leve o moderado, empezo de a poco', score: 1, nextQuestionId: 'head_context' },
      { id: 'sudden', label: 'Empezo de golpe y muy fuerte', score: 9, flags: ['stroke_sign'] },
      { id: 'dizzy', label: 'Estoy mareado o debil', score: 2, nextQuestionId: 'head_context' },
      { id: 'hit', label: 'Empezo despues de un golpe', score: 5, terminalSeverity: 'urgent' },
    ],
  },
  {
    id: 'head_context',
    groupId: 'travel_head',
    title: 'Puede estar relacionado con cansancio, calor, alcohol o poco sueno?',
    helperText: 'Esto ayuda a no sobrediagnosticar dolores comunes.',
    options: [
      { id: 'yes', label: 'Si, probablemente', score: 0, nextQuestionId: 'head_alarm' },
      { id: 'no', label: 'No lo relaciono con eso', score: 2, nextQuestionId: 'head_alarm' },
      { id: 'worse', label: 'Esta empeorando rapido', score: 5, terminalSeverity: 'urgent' },
    ],
  },
  {
    id: 'head_alarm',
    groupId: 'travel_head',
    title: 'Tengo confusion, vision rara o perdida de fuerza?',
    helperText: 'Estas senales cambian la recomendacion aunque el dolor haya empezado leve.',
    options: [
      { id: 'yes', label: 'Si', score: 9, flags: ['stroke_sign'] },
      { id: 'vomit_fever', label: 'Tengo vomitos repetidos o fiebre alta', score: 5, terminalSeverity: 'urgent' },
      { id: 'no', label: 'No', score: 0, terminalSeverity: 'non_urgent' },
    ],
  },
  {
    id: 'cold_start',
    groupId: 'travel_cold',
    title: 'Que me molesta mas?',
    helperText: 'Tos, garganta y resfrio suelen ser leves, pero revisamos respiracion y evolucion.',
    options: [
      { id: 'throat', label: 'Dolor de garganta', score: 1, nextQuestionId: 'cold_breathing' },
      { id: 'cough', label: 'Tos o mocos', score: 1, nextQuestionId: 'cold_breathing' },
      { id: 'fever', label: 'Resfrio con fiebre', score: 3, nextQuestionId: 'cold_breathing' },
      { id: 'breath', label: 'Me cuesta respirar', score: 9, flags: ['respiratory_distress'] },
    ],
  },
  {
    id: 'cold_breathing',
    groupId: 'travel_cold',
    title: 'Como respiro?',
    helperText: 'Si respiro bien, suele poder empezar con autocuidado.',
    options: [
      { id: 'normal', label: 'Respiro normal', score: 0, nextQuestionId: 'cold_duration' },
      { id: 'walking', label: 'Me falta el aire al caminar', score: 4, terminalSeverity: 'urgent' },
      { id: 'rest', label: 'Me cuesta respirar estando quieto', score: 9, flags: ['respiratory_distress'] },
    ],
  },
  {
    id: 'cold_duration',
    groupId: 'travel_cold',
    title: 'Cuanto tiempo llevo asi?',
    helperText: 'Duracion y empeoramiento orientan si conviene consultar.',
    options: [
      { id: 'short', label: 'Menos de 3 dias y no empeora', score: 0, terminalSeverity: 'non_urgent' },
      { id: 'days', label: '3 a 7 dias', score: 3, terminalSeverity: 'urgent' },
      { id: 'worse', label: 'Empeora rapido o tengo fiebre persistente', score: 5, terminalSeverity: 'urgent' },
    ],
  },
  {
    id: 'skin_start',
    groupId: 'travel_skin',
    title: 'Que veo en la piel?',
    helperText: 'Buscamos si parece irritacion leve o algo que crece, duele o se infecta.',
    options: [
      { id: 'irritated', label: 'Piel roja o irritada leve', score: 1, nextQuestionId: 'skin_evolution' },
      { id: 'rash', label: 'Sarpullido o manchas', score: 2, nextQuestionId: 'skin_evolution' },
      { id: 'wound', label: 'Herida o corte', score: 2, nextQuestionId: 'skin_wound' },
      { id: 'painful', label: 'Duele mucho, crece o tiene pus', score: 5, terminalSeverity: 'urgent' },
    ],
  },
  {
    id: 'skin_evolution',
    groupId: 'travel_skin',
    title: 'Esta creciendo rapido o tengo fiebre?',
    helperText: 'Si se expande o aparece fiebre, conviene consultar.',
    options: [
      { id: 'no', label: 'No', score: 0, terminalSeverity: 'non_urgent' },
      { id: 'yes', label: 'Si', score: 5, terminalSeverity: 'urgent' },
      { id: 'unsure', label: 'No estoy seguro', score: 3, terminalSeverity: 'urgent' },
    ],
  },
  {
    id: 'allergy_start',
    groupId: 'travel_skin',
    title: 'La reaccion afecta mi respiracion, labios, lengua o garganta?',
    helperText: 'Esta es la pregunta clave en alergias.',
    options: [
      { id: 'yes', label: 'Si', score: 9, flags: ['allergic_airway'] },
      { id: 'no', label: 'No, es picazon o ronchas', score: 1, nextQuestionId: 'allergy_evolution' },
      { id: 'unsure', label: 'No estoy seguro', score: 5, terminalSeverity: 'urgent' },
    ],
  },
  {
    id: 'allergy_evolution',
    groupId: 'travel_skin',
    title: 'Esta avanzando rapido o se extendio por todo el cuerpo?',
    helperText: 'Una reaccion leve localizada puede observarse; si avanza, conviene consultar.',
    options: [
      { id: 'no', label: 'No, esta localizada', score: 0, terminalSeverity: 'non_urgent' },
      { id: 'yes', label: 'Si, avanza o es extensa', score: 4, terminalSeverity: 'urgent' },
    ],
  },
  {
    id: 'skin_wound',
    groupId: 'travel_skin',
    title: 'Como es la herida?',
    helperText: 'La profundidad, suciedad y sangrado cambian la recomendacion.',
    options: [
      { id: 'surface', label: 'Superficial y limpia', score: 1, terminalSeverity: 'non_urgent' },
      { id: 'deep', label: 'Profunda, sucia o por mordida', score: 5, terminalSeverity: 'urgent' },
      { id: 'bleeding', label: 'Sangra y no cede', score: 9, flags: ['severe_bleeding'] },
    ],
  },
  {
    id: 'heat_start',
    groupId: 'travel_heat',
    title: 'Que me pasa con el sol o calor?',
    helperText: 'Primero vemos si es molestia leve, quemadura o deshidratacion.',
    options: [
      { id: 'sunburn', label: 'Me queme con el sol', score: 1, nextQuestionId: 'heat_sunburn' },
      { id: 'thirst', label: 'Tengo mucha sed o boca seca', score: 2, nextQuestionId: 'heat_liquids' },
      { id: 'weak', label: 'Estoy agotado por calor', score: 3, nextQuestionId: 'heat_liquids' },
      { id: 'confused', label: 'Estoy confundido o muy debil', score: 9, flags: ['dehydration_severe'] },
    ],
  },
  {
    id: 'heat_sunburn',
    groupId: 'travel_heat',
    title: 'La quemadura tiene ampollas o es muy extensa?',
    helperText: 'Las quemaduras extensas o con ampollas conviene valorarlas.',
    options: [
      { id: 'no', label: 'No, solo roja y dolorida', score: 1, terminalSeverity: 'non_urgent' },
      { id: 'yes', label: 'Si, ampollas o zona grande', score: 4, terminalSeverity: 'urgent' },
    ],
  },
  {
    id: 'heat_liquids',
    groupId: 'travel_heat',
    title: 'Puedo tomar liquidos y orinar?',
    helperText: 'Esto separa calor manejable de deshidratacion que requiere ayuda.',
    options: [
      { id: 'yes', label: 'Si', score: 0, terminalSeverity: 'non_urgent' },
      { id: 'little', label: 'Poco', score: 4, terminalSeverity: 'urgent' },
      { id: 'none', label: 'Casi nada', score: 9, flags: ['dehydration_severe'] },
    ],
  },
  {
    id: 'muscle_start',
    groupId: 'travel_injury',
    title: 'Como es el dolor?',
    helperText: 'Dolores por esfuerzo suelen mejorar, pero importa si limitan mucho.',
    options: [
      { id: 'mild', label: 'Leve o cansancio muscular', score: 1, terminalSeverity: 'non_urgent' },
      { id: 'moderate', label: 'Me limita pero puedo moverme', score: 3, terminalSeverity: 'urgent' },
      { id: 'severe', label: 'No puedo mover o apoyar bien', score: 5, nextQuestionId: 'injury_deformity' },
    ],
  },
  {
    id: 'injury_start',
    groupId: 'travel_injury',
    title: 'Que paso?',
    helperText: 'Buscamos si parece golpe menor, torcedura o lesion que requiere valoracion.',
    options: [
      { id: 'minor_hit', label: 'Golpe leve o raspadura', score: 1, terminalSeverity: 'non_urgent' },
      { id: 'sprain', label: 'Torcedura con dolor', score: 3, nextQuestionId: 'injury_use' },
      { id: 'cut', label: 'Corte o herida', score: 2, nextQuestionId: 'skin_wound' },
      { id: 'fall', label: 'Caida fuerte o no puedo apoyar', score: 5, nextQuestionId: 'injury_deformity' },
    ],
  },
  {
    id: 'injury_use',
    groupId: 'travel_injury',
    title: 'Puedo usar esa zona?',
    helperText: 'Si puedo usarla, suele ser menos preocupante.',
    options: [
      { id: 'yes', label: 'Si', score: 1, terminalSeverity: 'non_urgent' },
      { id: 'pain', label: 'Si, pero con bastante dolor', score: 3, terminalSeverity: 'urgent' },
      { id: 'no', label: 'No puedo', score: 5, nextQuestionId: 'injury_deformity' },
    ],
  },
  {
    id: 'injury_deformity',
    groupId: 'travel_injury',
    title: 'Hay deformidad, sangrado o falta de sensibilidad?',
    helperText: 'Estas senales necesitan atencion mas rapida.',
    options: [
      { id: 'yes', label: 'Si', score: 9, flags: ['open_fracture_or_ischemia'] },
      { id: 'no', label: 'No', score: 4, terminalSeverity: 'urgent' },
    ],
  },
  {
    id: 'mind_start',
    groupId: 'travel_mind_sleep',
    title: 'Que siento principalmente?',
    helperText: 'Ansiedad, cansancio, falta de sueno o estar fuera de rutina pueden sentirse intensos.',
    options: [
      { id: 'sleep', label: 'No puedo dormir o tengo jet lag', score: 1, terminalSeverity: 'non_urgent' },
      { id: 'anxiety', label: 'Estoy ansioso o raro', score: 2, nextQuestionId: 'mind_alarm' },
      { id: 'weak', label: 'Me siento debil o agotado', score: 2, nextQuestionId: 'mind_alarm' },
      { id: 'harm', label: 'Siento que puedo hacerme dano', score: 9, flags: ['altered_consciousness'] },
    ],
  },
  {
    id: 'mind_alarm',
    groupId: 'travel_mind_sleep',
    title: 'Tengo dolor fuerte en el pecho, desmayo o falta de aire real?',
    helperText: 'Si aparece algo fisico intenso, no lo trato como ansiedad comun.',
    options: [
      { id: 'yes', label: 'Si', score: 9, flags: ['chest_pain_emergency'] },
      { id: 'no', label: 'No', score: 1, terminalSeverity: 'non_urgent' },
      { id: 'repeat', label: 'No, pero se repite o no puedo funcionar', score: 4, terminalSeverity: 'urgent' },
    ],
  },
  {
    id: 'unsure_start',
    groupId: 'travel_unsure',
    title: 'Que se parece mas a lo que me pasa?',
    helperText: 'Si no lo tengo claro, busco nivel de molestia y evolucion.',
    options: [
      { id: 'mild', label: 'Molestia leve y puedo seguir mi dia', score: 1, terminalSeverity: 'non_urgent' },
      { id: 'moderate', label: 'Me limita o me preocupa bastante', score: 4, terminalSeverity: 'urgent' },
      { id: 'worse', label: 'Esta empeorando rapido', score: 6, terminalSeverity: 'urgent' },
      { id: 'bad', label: 'Me siento muy mal o algo no esta bien', score: 9, flags: ['altered_consciousness'] },
    ],
  },
] as const);
