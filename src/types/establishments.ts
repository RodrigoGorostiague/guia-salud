export type EstablishmentCategory = 'centers' | 'pharmacies' | 'hospitals';

export type EstablishmentCoordinate = {
  latitude: number;
  longitude: number;
};

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
  coordinate: EstablishmentCoordinate;
};
