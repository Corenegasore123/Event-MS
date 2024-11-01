"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Modal from "@/components/ui/modal"; // Import the modal component

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  availableSeats: number;
}

export default function AdminDashboard() {
  const [events, setEvents] = useState<Event[]>([]);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    availableSeats: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const response = await fetch("/api/events");
    if (response.ok) {
      const data = await response.json();
      setEvents(data);
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

  const handleDeleteEvent = async (id: string) => {
    const response = await fetch(`/api/events/${id}`, { method: "DELETE" });
    if (response.ok) {
      fetchEvents();
    }
  };

  const handleEditEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch(`/api/events/${editingEvent?.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingEvent),
    });

    if (response.ok) {
      fetchEvents();
      setEditingEvent(null);
      setIsModalOpen(false);
    }
  };

  const handleLogout = () => {
    router.push("/admin/login");
  };

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Admin Dashboard</CardTitle>
          <CardDescription>Manage all events in one place</CardDescription>
        </CardHeader>
        <CardContent>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredEvents.map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">{event.title}</CardTitle>
                  <CardDescription>{event.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">Date: {event.date}</p>
                  <p className="text-gray-700">Available Seats: {event.availableSeats}</p>
                </CardContent>
                <CardFooter>
                  <Button
                    className="bg-blue-500 text-white hover:bg-blue-600"
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
                  >
                    Edit
                  </Button>
                  <Button
                    className="bg-red-500 text-white hover:bg-red-600"
                    onClick={() => handleDeleteEvent(event.id)}
                  >
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
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
          <Button type="submit" className="w-full bg-teal-700 text-white hover:bg-teal-800">
            {editingEvent ? "Update Event" : "Create Event"}
          </Button>
        </form>
      </Modal>

      <Card className="mt-6">
        <CardFooter>
          <Button onClick={handleLogout} className="w-full bg-gray-700 text-white hover:bg-gray-800">
            Logout
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
