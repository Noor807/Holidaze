export interface Media {
  url: string;
  alt?: string;
}

export interface Booking {
  id: string;
  dateFrom: string;
  dateTo: string;
  guests: number;
  created: string;
  updated: string;
}

export interface VenuePayload {
  name: string;
  description: string;
  media?: Media[];
  price: number;
  maxGuests: number;
  rating?: number;
  meta?: {
    wifi?: boolean;
    parking?: boolean;
    breakfast?: boolean;
    pets?: boolean;
  };
  location?: {
    address?: string;
    city?: string;
    zip?: string;
    country?: string;
    continent?: string;
    lat?: number;
    lng?: number;
  };
}

export interface Venue {
  data: any;
  id: string;
  owner: {
    avatar: any;
    id: string;
    name: string;
  };
  created: string;
  updated: string;
  bookings?: Booking[];

  // Required fields
  name: string;
  description: string;
  price: number;
  maxGuests: number;
  rating: number;
  media: Media[];
  meta: Required<VenuePayload["meta"]>;
  location: Required<VenuePayload["location"]>;
}
