// src/types/venue.ts

export interface Media {
  url: string;
  alt: string;
}

export interface Booking {
  id: string;
  dateFrom: string; // ISO string
  dateTo: string;   // ISO string
  guests: number;
  created: string;
  updated: string;
}

export interface Venue {
  id: string;
  name: string;
  description: string;
  media: Media[];
  price: number;
  maxGuests: number;
  rating: number;
  created: string;
  updated: string;
  meta: {
    wifi: boolean;
    parking: boolean;
    breakfast: boolean;
    pets: boolean;
  };
  location: {
    address: string;
    city: string;
    zip: string;
    country: string;
    continent: string;
    lat: number;
    lng: number;
  };
  bookings: Booking[]; // ✅ correct type
}
