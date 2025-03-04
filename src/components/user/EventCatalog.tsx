import { useState, useEffect } from "react";
import type { Event, BookingRequest } from "@app-types/event";
import eventService from "@services/event.service";
import { format } from "date-fns";
import { toast } from "react-toastify";

const EventCatalog: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [numTickets, setNumTickets] = useState<number>(1);
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await eventService.getAvailableEvents();
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Failed to load events. Please try again.");
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

  const handleBookEvent = async () => {
    if (selectedEvent) {
      const bookingData: BookingRequest = {
        number_of_tickets: numTickets,
        event_id: selectedEvent.id,
      };
      try {
        const booking = await eventService.bookEvent(
          selectedEvent.id,
          bookingData
        );
        toast.success("Booking successful!");
        console.log("Booking response:", booking);
        setShowBookingModal(false);
        fetchEvents(); // Refresh the events list
      } catch (error) {
        console.error("Error booking event:", error);
        toast.error("Failed to book event. Please try again.");
      }
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading events...</div>;
  }

  if (events.length === 0) {
    return <div className="text-center py-4">No events available.</div>;
  }

  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        Available Events
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-white shadow overflow-hidden rounded-lg border border-gray-200 p-4 sm:p-6 h-full flex flex-col"
          >
            <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">
              {event.title}
            </h3>
            <p className="text-sm text-gray-500 mb-2 flex-grow">
              {event.description}
            </p>
            <div className="mt-auto space-y-1">
              <p className="text-sm text-gray-700">
                <strong>Date:</strong> {formatDate(event.date)}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Venue:</strong> {event.venue}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Price:</strong> Rs. {event.price.toFixed(2)}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Available Tickets:</strong> {event.available_tickets} /{" "}
                {event.total_tickets}
              </p>
              <button
                className="mt-4 w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 text-sm"
                onClick={() => {
                  setSelectedEvent(event);
                  setNumTickets(1);
                  setShowBookingModal(true);
                }}
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {showBookingModal && selectedEvent && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white p-4 sm:p-6 rounded-lg w-full max-w-sm mx-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Book Tickets for {selectedEvent.title}
            </h3>
            <div className="mb-4">
              <label
                htmlFor="tickets"
                className="block text-sm font-medium text-gray-700"
              >
                Number of Tickets
              </label>
              <input
                type="number"
                id="tickets"
                min="1"
                max={selectedEvent.available_tickets}
                value={numTickets}
                onChange={(e) => setNumTickets(Number(e.target.value))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-end gap-2">
              <button
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-100 order-2 sm:order-1"
                onClick={() => setShowBookingModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 order-1 sm:order-2"
                onClick={handleBookEvent}
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventCatalog;
