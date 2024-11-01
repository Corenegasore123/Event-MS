"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/modal"; // Import the modal component
import { Input } from "@/components/ui/input"; // Assuming you have an Input component

interface Booking {
  name: string;
  location: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  availableSeats: number;
  bookings?: Booking[];
}

const LoadingSkeleton = () => (
  <div className="flex-1 min-w-[300px] animate-pulse">
    <Card className="border rounded-lg p-4">
      <CardHeader className="bg-gray-200 mb-3 rounded-t-lg h-6"></CardHeader>
      <CardContent className="space-y-2">
        <div className="bg-gray-200 h-4 w-3/4"></div>
        <div className="bg-gray-200 h-4 w-1/2"></div>
        <div className="bg-gray-200 h-4 w-2/3"></div>
      </CardContent>
    </Card>
  </div>
);

export default function AdminDashboard() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    availableSeats: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);
  const router = useRouter();

  const fetchEvents = async () => {
    setLoading(true);
    const response = await fetch("/api/events");
    if (response.ok) {
      const data = await response.json();
      setEvents(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleLogout = async () => {
    const response = await fetch("/api/admin/logout", { method: "POST" });
    if (response.ok) {
      router.push("/");
    }
  };

  const handleDelete = async (id: string) => {
    const response = await fetch(`/api/events/${id}`, { method: "DELETE" });
    if (response.ok) {
      fetchEvents();
      setIsDeleteModalOpen(false);
      setEventToDelete(null);
    } else {
      console.error("Failed to delete event");
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEvent),
    });

    if (response.ok) {
      setNewEvent({ title: "", description: "", date: "", availableSeats: 0 });
      fetchEvents();
      setIsModalOpen(false);
    }
  };

  const handleEditEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch(`/api/events/${editingEvent?.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEvent), // Use newEvent for updating
    });

    if (response.ok) {
      fetchEvents();
      setEditingEvent(null);
      setIsModalOpen(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingEvent(null);
    setNewEvent({ title: "", description: "", date: "", availableSeats: 0 });
    setIsModalOpen(false);
  };

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-teal-800">Admin Dashboard</h1>
        <Button onClick={handleLogout} className="bg-teal-700 hover:bg-teal-800 text-white">
          Logout
        </Button>
      </div>

      <div className="flex justify-between mb-4">
        <Input
          type="text"
          placeholder="Search Events"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-1/2"
        />
        <Button
          onClick={() => {
            setIsModalOpen(true);
            setEditingEvent(null);
            setNewEvent({ title: "", description: "", date: "", availableSeats: 0 });
          }}
          className="bg-teal-700 text-white hover:bg-teal-800"
        >
          Create Event
        </Button>
      </div>

      <div className="flex flex-wrap gap-6">
        {loading ? (
          // Show loading skeletons while fetching events
          Array.from({ length: 3 }).map((_, index) => <LoadingSkeleton key={index} />)
        ) : filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <div key={event.id} className="flex-1 min-w-[300px]">
              <Card className="hover:shadow-lg transition-shadow duration-200 border rounded-lg p-4">
                <CardHeader className="bg-gray-100 mb-3 rounded-t-lg">
                  <CardTitle className="text-xl font-semibold text-teal-700">{event.title}</CardTitle>
                  <CardDescription className="text-gray-600">{event.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-gray-800">Date: {event.date}</p>
                  <p className="text-gray-800">Available Seats: {event.availableSeats}</p>
                  <h3 className="font-semibold mt-4">Bookings:</h3>
                  {event.bookings && event.bookings.length > 0 ? (
                    <ul className="list-disc pl-5">
                      {event.bookings.map((booking, index) => (
                        <li key={index} className="text-gray-700">
                          {booking.name} - {booking.location}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No bookings yet.</p>
                  )}
                </CardContent>
                <CardFooter className="space-x-2">
                  <Button
                    onClick={() => {
                      setEditingEvent(event);
                      setNewEvent({
                        title: event.title,
                        description: event.description,
                        date: event.date,
                        availableSeats: event.availableSeats,
                      });
                      setIsModalOpen(true);
                    }}
                    className="bg-teal-600 hover:bg-teal-700 text-white"
                  >
                    Edit
                  </Button>
                  <Button
                    className="bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => {
                      setEventToDelete(event.id);
                      setIsDeleteModalOpen(true);
                    }}
                  >
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            </div>
          ))
        ) : (
          <p className="text-red-500">Event not found</p> // Message when no events match the search
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCancelEdit}>
        <form onSubmit={editingEvent ? handleEditEvent : handleCreateEvent} className="space-y-4">
          <Input
            type="text"
            placeholder="Event Title"
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            required
          />
          <Input
            type="text"
            placeholder="Event Description"
            value={newEvent.description}
            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
            required
          />
          <Input
            type="date"
            value={newEvent.date}
            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
            required
          />
          <Input
            type="number"
            placeholder="Available Seats"
            value={newEvent.availableSeats}
            onChange={(e) => setNewEvent({ ...newEvent, availableSeats: parseInt(e.target.value) })}
            required
          />
          <div className="flex justify-between">
            <Button type="submit" className="w-full bg-teal-700 text-white hover:bg-teal-800">
              {editingEvent ? "Update Event" : "Create Event"}
            </Button>
            <Button
              type="button"
              onClick={handleCancelEdit}
              className="ml-2 w-full bg-gray-500 text-white hover:bg-gray-600"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <div className="p-4">
          <h2 className="text-lg font-bold">Confirm Deletion</h2>
          <p>Are you sure you want to delete this event?</p>
          <div className="flex justify-end mt-4">
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => {
                if (eventToDelete) {
                  handleDelete(eventToDelete);
                }
              }}
            >
              Delete
            </Button>
            <Button
              className="ml-2 bg-gray-500 hover:bg-gray-600 text-white"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
