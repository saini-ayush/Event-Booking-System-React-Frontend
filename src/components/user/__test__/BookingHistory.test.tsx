import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import BookingHistory from "../BookingHistory";
import eventService from "@services/event.service";
import { toast } from "react-toastify";

vi.mock("@services/event.service", () => ({
  default: {
    getBookingHistory: vi.fn(),
    cancelBooking: vi.fn(),
  },
}));

vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

window.confirm = vi.fn();

// Mock data
const mockBookings = [
  {
    id: 12,
    event_id: 3,
    user_id: 2,
    user_email: "ayush1@gmail.com",
    num_tickets: 20,
    total_price: 19980,
    booking_date: "2025-03-03T18:42:00.551209",
    event: {
      title: "Comedy",
      description: "Comedy Show",
      date: "2025-06-03T12:00:00",
      venue: "Delhi",
      total_tickets: 300,
      price: 999,
      id: 3,
      available_tickets: 224,
    },
  },
  {
    id: 10,
    event_id: 3,
    user_id: 2,
    user_email: "ayush1@gmail.com",
    num_tickets: 56,
    total_price: 55944,
    booking_date: "2025-03-03T18:33:54.197024",
    event: {
      title: "Comedy",
      description: "Comedy Show",
      date: "2025-06-03T12:00:00",
      venue: "Delhi",
      total_tickets: 300,
      price: 999,
      id: 3,
      available_tickets: 224,
    },
  },
];

describe("BookingHistory Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should show loading state initially", () => {
    // Mock the service to return a promise that doesn't resolve immediately
    vi.mocked(eventService.getBookingHistory).mockReturnValue(
      new Promise(() => {})
    );

    render(<BookingHistory />);

    expect(screen.getByText("Loading bookings...")).toBeInTheDocument();
  });

  it("should display bookings when data is loaded", async () => {
    // Mock successful API response
    vi.mocked(eventService.getBookingHistory).mockResolvedValue(mockBookings);

    render(<BookingHistory />);

    // Wait for the loading state to disappear
    await waitFor(() => {
      expect(screen.queryByText("Loading bookings...")).not.toBeInTheDocument();
    });

    // Check if the event title is displayed
    expect(screen.getAllByText("Comedy")).toHaveLength(4); // 2 in mobile view, 2 in table view

    // Check if the event description is displayed
    expect(screen.getAllByText("Comedy Show")).toHaveLength(4); // 2 in mobile view, 2 in table view

    // Check if the number of tickets is displayed
    expect(screen.getAllByText("20")).toHaveLength(2); // 1 in mobile view, 1 in table view
    expect(screen.getAllByText("56")).toHaveLength(2); // 1 in mobile view, 1 in table view
  });

  it("should show empty state when no bookings are found", async () => {
    // Mock empty response
    vi.mocked(eventService.getBookingHistory).mockResolvedValue([]);

    render(<BookingHistory />);

    // Wait for the loading state to disappear
    await waitFor(() => {
      expect(screen.queryByText("Loading bookings...")).not.toBeInTheDocument();
    });

    expect(screen.getByText("No bookings found.")).toBeInTheDocument();
  });

  it("should handle cancel booking when confirmed", async () => {
    // Mock successful API response
    vi.mocked(eventService.getBookingHistory).mockResolvedValue(mockBookings);
    vi.mocked(eventService.cancelBooking).mockResolvedValue(undefined);
    vi.mocked(window.confirm).mockReturnValue(true);

    render(<BookingHistory />);

    // Wait for the loading state to disappear
    await waitFor(() => {
      expect(screen.queryByText("Loading bookings...")).not.toBeInTheDocument();
    });

    // Find and click the cancel button (using the mobile view button for simplicity)
    const cancelButtons = screen.getAllByText("Cancel Booking");
    fireEvent.click(cancelButtons[0]);

    // Check if confirmation was shown
    expect(window.confirm).toHaveBeenCalledWith(
      "Are you sure you want to cancel this booking?"
    );

    // Check if the service was called
    expect(eventService.cancelBooking).toHaveBeenCalledWith(3);

    // Check if success toast was shown
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        "Booking cancelled successfully!"
      );
    });

    // Check if bookings were refreshed
    expect(eventService.getBookingHistory).toHaveBeenCalledTimes(2);
  });

  it("should not cancel booking when not confirmed", async () => {
    // Mock successful API response
    vi.mocked(eventService.getBookingHistory).mockResolvedValue(mockBookings);
    vi.mocked(window.confirm).mockReturnValue(false);

    render(<BookingHistory />);

    // Wait for the loading state to disappear
    await waitFor(() => {
      expect(screen.queryByText("Loading bookings...")).not.toBeInTheDocument();
    });

    // Find and click the cancel button
    const cancelButtons = screen.getAllByText("Cancel Booking");
    fireEvent.click(cancelButtons[0]);

    // Check if confirmation was shown
    expect(window.confirm).toHaveBeenCalledWith(
      "Are you sure you want to cancel this booking?"
    );

    // Check that the service was NOT called
    expect(eventService.cancelBooking).not.toHaveBeenCalled();
  });

  it("should handle error when fetching bookings fails", async () => {
    // Mock API error
    vi.mocked(eventService.getBookingHistory).mockRejectedValue(
      new Error("API error")
    );

    render(<BookingHistory />);

    // Wait for the loading state to disappear
    await waitFor(() => {
      expect(screen.queryByText("Loading bookings...")).not.toBeInTheDocument();
    });

    // Check if error toast was shown
    expect(toast.error).toHaveBeenCalledWith(
      "Failed to load bookings. Please try again."
    );
  });

  it("should handle error when cancelling booking fails", async () => {
    // Mock successful API response for getting bookings
    vi.mocked(eventService.getBookingHistory).mockResolvedValue(mockBookings);
    // Mock error for cancelling
    vi.mocked(eventService.cancelBooking).mockRejectedValue(
      new Error("API error")
    );
    vi.mocked(window.confirm).mockReturnValue(true);

    render(<BookingHistory />);

    // Wait for the loading state to disappear
    await waitFor(() => {
      expect(screen.queryByText("Loading bookings...")).not.toBeInTheDocument();
    });

    // Find and click the cancel button
    const cancelButtons = screen.getAllByText("Cancel Booking");
    fireEvent.click(cancelButtons[0]);

    // Check if error toast was shown
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Failed to cancel booking. Please try again."
      );
    });
  });
});
