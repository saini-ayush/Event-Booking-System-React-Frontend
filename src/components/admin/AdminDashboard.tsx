import { useState, useEffect } from "react";
import { useAuth } from "@contexts/AuthContext";
import eventService from "@services/event.service";
import type { Event } from "@app-types/event";
import EventForm from "@components/admin/EventForm";
import EventList from "@components/admin/EventList";
import BookingList from "@components/admin/BookingList";
import { toast } from "react-toastify";

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"events" | "bookings" | "create">(
    "events"
  );
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await eventService.getAllEventsAdmin();
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Failed to load events. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (eventData: any) => {
    try {
      await eventService.createEvent(eventData);
      await fetchEvents();
      setActiveTab("events");
    } catch (error) {
      console.error("Error creating event:", error);
      throw error;
    }
  };

  const handleUpdateEvent = async (eventData: any) => {
    if (!selectedEvent) return;

    try {
      await eventService.updateEvent(selectedEvent.id, eventData);
      await fetchEvents();
      setSelectedEvent(null);
      setActiveTab("events");
    } catch (error) {
      console.error("Error updating event:", error);
      throw error;
    }
  };

  const handleDeleteEvent = async (id: number) => {
    try {
      await eventService.deleteEvent(id);
      await fetchEvents();
      toast.success("Event deleted successfully");
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event. Please try again.");
    }
  };

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    setActiveTab("create");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Admin Dashboard
          </h1>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <span className="text-sm text-gray-600 truncate max-w-[200px] sm:max-w-none">
              Logged in as: {user?.email}
            </span>
            <button
              onClick={logout}
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 w-full sm:w-auto"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6 overflow-x-auto">
          <nav className="-mb-px flex">
            <button
              className={`${
                activeTab === "events"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-3 sm:py-4 px-4 sm:px-6 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab("events")}
            >
              Events
            </button>
            <button
              className={`${
                activeTab === "bookings"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-3 sm:py-4 px-4 sm:px-6 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab("bookings")}
            >
              Bookings
            </button>
            <button
              className={`${
                activeTab === "create"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-3 sm:py-4 px-4 sm:px-6 border-b-2 font-medium text-sm`}
              onClick={() => {
                setSelectedEvent(null);
                setActiveTab("create");
              }}
            >
              {selectedEvent ? "Edit Event" : "Create Event"}
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-4 sm:p-6">
          {activeTab === "events" && (
            <EventList
              events={events}
              loading={loading}
              onDelete={handleDeleteEvent}
              onEdit={handleEditEvent}
            />
          )}

          {activeTab === "bookings" && <BookingList />}

          {activeTab === "create" && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                {selectedEvent ? "Edit Event" : "Create New Event"}
              </h2>
              <EventForm
                initialValues={selectedEvent || undefined}
                onSubmit={selectedEvent ? handleUpdateEvent : handleCreateEvent}
                isEditing={!!selectedEvent}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
