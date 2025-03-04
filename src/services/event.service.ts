import api from "./api";
import {
  CreateEventRequest,
  Event,
  UpdateEventRequest,
  Booking,
  BookingRequest,
  BookingResponse,
} from "@app-types/event";

class EventService {
  // Admin endpoints
  async createEvent(eventData: CreateEventRequest): Promise<Event> {
    const response = await api.post("/admin/events", eventData);
    return response.data;
  }

  async updateEvent(id: number, eventData: UpdateEventRequest): Promise<Event> {
    const response = await api.put(`/admin/events/${id}`, eventData);
    return response.data;
  }

  async deleteEvent(id: number): Promise<void> {
    await api.delete(`/admin/events/${id}`);
  }

  async getAllEventsAdmin(): Promise<Event[]> {
    const response = await api.get("/admin/events");
    return response.data;
  }

  async getAllBookingsAdmin(): Promise<Booking[]> {
    const response = await api.get("/admin/booking");
    return response.data;
  }

  // User endpoints
  async getAvailableEvents(): Promise<Event[]> {
    const response = await api.get("/events");
    return response.data;
  }

  async bookEvent(
    eventId: number,
    bookingData: BookingRequest
  ): Promise<BookingResponse> {
    const response = await api.post(`/events/${eventId}/book`, bookingData);
    return response.data;
  }

  async cancelBooking(eventId: number): Promise<void> {
    await api.delete(`/events/${eventId}/cancel`);
  }

  async getBookingHistory(): Promise<Booking[]> {
    const response = await api.post("/events/history");
    return response.data;
  }
}

export default new EventService();
