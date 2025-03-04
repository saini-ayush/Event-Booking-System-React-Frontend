// src/components/user/BookingHistory.tsx
import { useState, useEffect } from "react";
import type { Booking } from "@app-types/event";
import eventService from "@services/event.service";
import { format } from "date-fns";
import { toast } from "react-toastify";

const BookingHistory: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await eventService.getBookingHistory();
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to load bookings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string): string => {
    try {
      return format(new Date(dateString), "PPP p");
    } catch (error) {
      return dateString;
    }
  };

  const handleCancelBooking = async (eventId: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to cancel this booking?"
    );
    if (confirmDelete) {
      try {
        await eventService.cancelBooking(eventId);
        toast.success("Booking cancelled successfully!");
        fetchBookings(); // Refresh the bookings list
      } catch (error) {
        console.error("Error cancelling booking:", error);
        toast.error("Failed to cancel booking. Please try again.");
      }
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading bookings...</div>;
  }

  if (bookings.length === 0) {
    return <div className="text-center py-4">No bookings found.</div>;
  }

  // Mobile card view for small screens
  const renderMobileView = () => {
    return (
      <div className="space-y-4 md:hidden">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="bg-white border rounded-lg p-4 shadow-sm"
          >
            <div className="font-medium text-gray-900 mb-1">
              {booking.event?.title || `Event #${booking.event_id}`}
            </div>
            <div className="text-sm text-gray-500 mb-2 line-clamp-2">
              {booking.event?.description}
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm mb-3">
              <div>
                <span className="font-medium">Date:</span>{" "}
                {booking.event?.date ? formatDate(booking.event.date) : ""}
              </div>
              <div>
                <span className="font-medium">Venue:</span>{" "}
                {booking.event?.venue}
              </div>
              <div>
                <span className="font-medium">Tickets:</span>{" "}
                {booking.num_tickets}
              </div>
              <div>
                <span className="font-medium">Price:</span> Rs.
                {booking.total_price.toFixed(2)}
              </div>
              <div className="col-span-2">
                <span className="font-medium">Booked on:</span>{" "}
                {formatDate(booking.booking_date)}
              </div>
            </div>
            <button
              onClick={() => handleCancelBooking(booking.event_id)}
              className="w-full text-center py-2 text-red-600 border border-red-200 rounded-md hover:bg-red-50"
            >
              Cancel Booking
            </button>
          </div>
        ))}
      </div>
    );
  };

  // Table view for larger screens
  const renderTableView = () => {
    return (
      <div className="hidden md:block overflow-x-auto -mx-4 sm:mx-0">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Event
                </th>
                <th
                  scope="col"
                  className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date & Venue
                </th>
                <th
                  scope="col"
                  className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Tickets
                </th>
                <th
                  scope="col"
                  className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Total Price
                </th>
                <th
                  scope="col"
                  className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Booking Date
                </th>
                <th
                  scope="col"
                  className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <div className="text-xs sm:text-sm font-medium text-gray-900">
                      {booking.event?.title || `Event #${booking.event_id}`}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500 truncate max-w-[150px] md:max-w-xs">
                      {booking.event?.description}
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <div className="text-xs sm:text-sm text-gray-900">
                      {booking.event?.date
                        ? formatDate(booking.event.date)
                        : ""}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500 truncate max-w-[100px] md:max-w-[150px]">
                      {booking.event?.venue}
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                    {booking.num_tickets}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                    Rs.{booking.total_price.toFixed(2)}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                    {formatDate(booking.booking_date)}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-right text-xs sm:text-sm font-medium">
                    <button
                      onClick={() => handleCancelBooking(booking.event_id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-4">My Bookings</h2>
      {renderMobileView()}
      {renderTableView()}
    </div>
  );
};

export default BookingHistory;
