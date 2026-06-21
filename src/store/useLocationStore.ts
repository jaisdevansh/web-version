import { create } from 'zustand';

interface LocationState {
  city: string;
  lat: number | null;
  lng: number | null;
  setCity: (city: string) => void;
  setLocation: (lat: number, lng: number, city: string) => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  city: 'All Cities',
  lat: null,
  lng: null,
  setCity: (city) => set({ city }),
  setLocation: (lat, lng, city) => set({ lat, lng, city }),
}));
