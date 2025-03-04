import type { Event } from "@app-types/event";
import { format } from "date-fns";

interface EventListProps {
  events: Event[];
  loading: boolean;
  onDelete: (id: number) => void;
  onEdit: (event: Event) => void;
}

const EventList: React.FC<EventListProps> = ({
  events,
  loading,
  onDelete,
  onEdit,
}) => {
  if (loading) {
    return <div className="text-center py-4">Loading events...</div>;
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-4">
        No events found. Create your first event!
      </div>
    );
  }

  const formatDate = (dateString: string): string => {
    try {
      return format(new Date(dateString), "PPP p"); // e.g., "April 29, 2023 at 2:30 PM"
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-4">Manage Events</h2>
      <div className="overflow-x-auto -mx-4 sm:mx-0">
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
                  Price
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
              {events.map((event) => (
                <tr key={event.id}>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <div className="text-xs sm:text-sm font-medium text-gray-900">
                      {event.title}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500 truncate max-w-[100px] sm:max-w-[150px] md:max-w-xs">
                      {event.description}
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <div className="text-xs sm:text-sm text-gray-900">
                      {formatDate(event.date)}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500 truncate max-w-[100px] sm:max-w-[150px] md:max-w-none">
                      {event.venue}
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <div className="text-xs sm:text-sm text-gray-900">
                      {event.available_tickets} / {event.total_tickets}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 max-w-[80px] sm:max-w-full">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{
                          width: `${
                            (event.available_tickets / event.total_tickets) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                    Rs.{event.price.toFixed(2)}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-right text-xs sm:text-sm font-medium">
                    <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4">
                      <button
                        onClick={() => onEdit(event)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              "Are you sure you want to delete this event?"
                            )
                          ) {
                            onDelete(event.id);
                          }
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
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

export default EventList;
