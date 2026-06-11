## Flujo de triaje MVP

Base escalable para una evaluacion de sintomas en Expo/React Native.

### Dependencias incorporadas

- `zod`: validacion del modelo de preguntas, grupos y sesion.
- `react-hook-form`: manejo ligero de la respuesta activa por pantalla.
- `lucide-react-native`: iconografia clara para categorias y estados.
- `react-native-reanimated`: ya existia en el proyecto y se usa para transiciones suaves.

### Capas separadas

- `data.ts`: mapa de navegacion, copy y arboles base.
- `engine.ts`: scoring, corte temprano y clasificacion.
- `types.ts` + `schema.ts`: contrato estable para evolucionar a persistencia, analytics o estados mas complejos.

### Ruta de escalado

1. Agregar factores moduladores como edad, embarazo y comorbilidades.
2. Persistir sesiones e historial.
3. Sustituir el motor por `xstate` si aparecen ramas mas complejas.
4. Anadir analitica clinica y de abandono.
