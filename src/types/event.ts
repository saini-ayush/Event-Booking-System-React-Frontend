export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  venue: string;
  total_tickets: number;
  available_tickets: number;
  price: number;
}

export interface CreateEventRequest {
  title: string;
  description: string;
  date: string;
  venue: string;
  total_tickets: number;
  price: number;
}

export interface UpdateEventRequest {
  title?: string;
  description?: string;
  date?: string;
  venue?: string;
  total_tickets?: number;
  price?: number;
}

export interface Booking {
  id: number;
  event_id: number;
  user_id: number;
  user_email: string;
  num_tickets: number;
  total_price: number;
  booking_date: string;
  event: Event;
}

export interface BookingRequest {
  number_of_tickets: number;
  event_id: number;
}

export interface BookingResponse {
  number_of_tickets: number;
  id: number;
  user_id: number;
  event_id: number;
  booking_date: string;
}
