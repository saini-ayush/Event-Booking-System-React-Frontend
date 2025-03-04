import { useState } from "react";
import { useAuth } from "@contexts/AuthContext";
import EventCatalog from "@components/user/EventCatalog";
import BookingHistory from "@components/user/BookingHistory";

const UserDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<"events" | "history">("events");

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Event Booking
          </h1>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <span className="text-sm text-gray-600 truncate max-w-[200px] sm:max-w-none">
              Welcome, {user?.email}!
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
              Available Events
            </button>
            <button
              className={`${
                activeTab === "history"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-3 sm:py-4 px-4 sm:px-6 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab("history")}
            >
              My Bookings
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-4 sm:p-6">
          {activeTab === "events" && <EventCatalog />}
          {activeTab === "history" && <BookingHistory />}
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
