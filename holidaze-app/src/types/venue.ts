/**
 * Represents a media file (image, video, etc.) associated with a venue.
 */
export interface Media {
  /** URL of the media */
  url: string;
  /** Optional alternative text for accessibility */
  alt?: string;
}

/**
 * Represents a booking made by a user.
 */
export interface Booking {
  /** Unique booking identifier */
  id: string;
  /** Start date of the booking (ISO string) */
  dateFrom: string;
  /** End date of the booking (ISO string) */
  dateTo: string;
  /** Number of guests for the booking */
  guests: number;
  /** ISO string when booking was created */
  created: string;
  /** ISO string when booking was last updated */
  updated: string;
}

/**
 * Payload used when creating or updating a venue.
 */
export interface VenuePayload {
  /** Venue name */
  name: string;
  /** Venue description */
  description: string;
  /** Optional media array */
  media?: Media[];
  /** Price per night */
  price: number;
  /** Maximum number of guests allowed */
  maxGuests: number;
  /** Optional rating (1-5) */
  rating?: number;
  /** Optional metadata flags */
  meta?: {
    wifi?: boolean;
    parking?: boolean;
    breakfast?: boolean;
    pets?: boolean;
  };
  /** Optional location details */
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

/**
 * Represents a fully fetched venue.
 */
export interface Venue {
  /** Unique venue ID */
  id: string;
  /** Owner information */
  owner: {
    /** Owner avatar (can be URL or object) */
    avatar: any;
    /** Owner ID */
    id: string;
    /** Owner name */
    name: string;
  };
  /** ISO string when venue was created */
  created: string;
  /** ISO string when venue was last updated */
  updated: string;
  /** Array of bookings associated with this venue */
  bookings?: Booking[];

  // Required fields for display
  name: string;
  description: string;
  price: number;
  maxGuests: number;
  rating: number;
  media: Media[];
  /** Required meta information (wifi, parking, etc.) */
  meta: Required<VenuePayload["meta"]>;
  /** Required location info */
  location: Required<VenuePayload["location"]>;
  /** Optional raw API data */
  data?: any;
}
