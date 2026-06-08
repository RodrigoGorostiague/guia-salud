import type { Establishment, EstablishmentCategory } from '@/types/establishments';

type EstablishmentScreenContent = {
  title: string;
  subtitle: string;
  mapLabel: string;
  ctaLabel: string;
  items: Establishment[];
};

export const establishmentContent: Record<EstablishmentCategory, EstablishmentScreenContent> = {
  centers: {
    title: 'Centros de atencion',
    subtitle: 'Opciones cercanas para recibir apoyo medico y orientacion inicial.',
    mapLabel: 'Mapa interactivo placeholder de centros de atencion',
    ctaLabel: 'Ver ruta en el futuro',
    items: [
      {
        id: 'center-1',
        name: 'Centro Medico Norte',
        distance: '1.2 km',
        eta: '6 min',
        status: 'Abierto 24 h',
        address: 'Av. Central 245',
        summary: 'Urgencias leves, orientacion general y consulta prioritaria.',
        markerLabel: '1',
        rating: 4.7,
        x: '18%',
        y: '28%',
      },
      {
        id: 'center-2',
        name: 'Clinica Santa Maria',
        distance: '2.4 km',
        eta: '10 min',
        status: 'Abierto hasta 22:00',
        address: 'Calle Salud 88',
        summary: 'Consulta ambulatoria, pediatria y apoyo al viajero.',
        markerLabel: '2',
        rating: 4.5,
        x: '62%',
        y: '38%',
      },
      {
        id: 'center-3',
        name: 'Unidad Medica Sur',
        distance: '3.1 km',
        eta: '13 min',
        status: 'Turnos disponibles',
        address: 'Paseo del Rio 310',
        summary: 'Atencion general, laboratorio basico y derivacion rapida.',
        markerLabel: '3',
        rating: 4.3,
        x: '40%',
        y: '66%',
      },
    ],
  },
  pharmacies: {
    title: 'Farmacias cercanas',
    subtitle: 'Puntos de apoyo rapido para medicamentos y articulos esenciales.',
    mapLabel: 'Mapa interactivo placeholder de farmacias cercanas',
    ctaLabel: 'Preparar busqueda futura',
    items: [
      {
        id: 'pharmacy-1',
        name: 'Farmacia Central',
        distance: '450 m',
        eta: '5 min',
        status: 'Abierta ahora',
        address: 'Plaza Mayor 14',
        summary: 'Medicamentos generales, guardia nocturna y articulos basicos.',
        markerLabel: '1',
        rating: 4.8,
        x: '22%',
        y: '34%',
      },
      {
        id: 'pharmacy-2',
        name: 'Farmacia del Viajero',
        distance: '1.1 km',
        eta: '7 min',
        status: 'Abierta hasta 23:00',
        address: 'Av. Estacion 102',
        summary: 'Enfoque en primeros auxilios, higiene y recetas frecuentes.',
        markerLabel: '2',
        rating: 4.6,
        x: '64%',
        y: '24%',
      },
      {
        id: 'pharmacy-3',
        name: 'Farmacia Barrio Verde',
        distance: '1.9 km',
        eta: '9 min',
        status: 'Entrega en el dia',
        address: 'Calle Parque 57',
        summary: 'Medicacion comun, insumos y asesoramiento breve.',
        markerLabel: '3',
        rating: 4.4,
        x: '46%',
        y: '68%',
      },
    ],
  },
};
