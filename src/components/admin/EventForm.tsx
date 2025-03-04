import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import type { CreateEventRequest, Event } from "@app-types/event";
import { toast } from "react-toastify";

interface EventFormProps {
  initialValues?: Event;
  onSubmit: (values: CreateEventRequest) => Promise<void>;
  isEditing?: boolean;
}

const EventForm: React.FC<EventFormProps> = ({
  initialValues,
  onSubmit,
  isEditing = false,
}) => {
  const defaultValues: CreateEventRequest = {
    title: "",
    description: "",
    date: new Date().toISOString().split("T")[0] + "T00:00",
    venue: "",
    total_tickets: 0,
    price: 0,
  };

  const formValues = initialValues
    ? {
        title: initialValues.title,
        description: initialValues.description,
        date: initialValues.date.split(".")[0], // Remove milliseconds
        venue: initialValues.venue,
        total_tickets: initialValues.total_tickets,
        price: initialValues.price,
      }
    : defaultValues;

  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    date: Yup.string().required("Date is required"),
    venue: Yup.string().required("Venue is required"),
    total_tickets: Yup.number()
      .min(1, "Must have at least 1 ticket")
      .required("Total tickets is required"),
    price: Yup.number()
      .min(0, "Price cannot be negative")
      .required("Price is required"),
  });

  return (
    <Formik
      initialValues={formValues}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        try {
          await onSubmit(values);
          toast.success(
            `Event ${isEditing ? "updated" : "created"} successfully!`
          );
          if (!isEditing) resetForm();
        } catch (error) {
          console.error("Event submission error:", error);
          toast.error(
            `Failed to ${
              isEditing ? "update" : "create"
            } event. Please try again.`
          );
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <Field
              id="title"
              name="title"
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <ErrorMessage
              name="title"
              component="div"
              className="text-red-500 text-xs mt-1"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <Field
              as="textarea"
              id="description"
              name="description"
              rows={4}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <ErrorMessage
              name="description"
              component="div"
              className="text-red-500 text-xs mt-1"
            />
          </div>

          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700"
            >
              Date and Time
            </label>
            <Field
              id="date"
              name="date"
              type="datetime-local"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <ErrorMessage
              name="date"
              component="div"
              className="text-red-500 text-xs mt-1"
            />
          </div>

          <div>
            <label
              htmlFor="venue"
              className="block text-sm font-medium text-gray-700"
            >
              Venue
            </label>
            <Field
              id="venue"
              name="venue"
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <ErrorMessage
              name="venue"
              component="div"
              className="text-red-500 text-xs mt-1"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="total_tickets"
                className="block text-sm font-medium text-gray-700"
              >
                Total Tickets
              </label>
              <Field
                id="total_tickets"
                name="total_tickets"
                type="number"
                min="1"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <ErrorMessage
                name="total_tickets"
                component="div"
                className="text-red-500 text-xs mt-1"
              />
            </div>

            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700"
              >
                Price
              </label>
              <Field
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <ErrorMessage
                name="price"
                component="div"
                className="text-red-500 text-xs mt-1"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isSubmitting
                ? "Processing..."
                : isEditing
                ? "Update Event"
                : "Create Event"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default EventForm;
