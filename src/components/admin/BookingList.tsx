import { useState, useEffect } from "react";
import type { Booking } from "@app-types/event";
import eventService from "@services/event.service";
import { format } from "date-fns";
import { toast } from "react-toastify";

const BookingList: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await eventService.getAllBookingsAdmin();
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

  if (loading) {
    return <div className="text-center py-4">Loading bookings...</div>;
  }

  if (bookings.length === 0) {
    return <div className="text-center py-4">No bookings found.</div>;
  }

  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-4">All Bookings</h2>
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Booking ID
                </th>
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
                  User
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
                  Price
                </th>
                <th
                  scope="col"
                  className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                    #{booking.id}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <div className="text-xs sm:text-sm font-medium text-gray-900 truncate max-w-[100px] sm:max-w-[150px] md:max-w-none">
                      {booking.event?.title || `Event #${booking.event_id}`}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500">
                      {booking.event?.date
                        ? formatDate(booking.event.date)
                        : ""}
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <div className="text-xs sm:text-sm text-gray-900 truncate max-w-[100px] sm:max-w-[150px] md:max-w-none">
                      {booking.user_email}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500">
                      ID: {booking.user_id}
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BookingList;
