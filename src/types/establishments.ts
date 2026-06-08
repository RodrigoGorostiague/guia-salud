import type { DimensionValue } from 'react-native';

export type EstablishmentCategory = 'centers' | 'pharmacies';

export type Establishment = {
  id: string;
  name: string;
  distance: string;
  eta: string;
  status: string;
  address: string;
  summary: string;
  markerLabel: string;
  rating: number;
  x: DimensionValue;
  y: DimensionValue;
};
