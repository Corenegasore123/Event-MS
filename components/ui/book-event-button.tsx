"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";

interface Booking {
  name: string;
  location: string;
}

export function BookEventButton({
  eventId,
  initialSeats,
  eventTitle,
  eventDate,
}: {
  eventId: string;
  initialSeats: number;
  eventTitle: string;
  eventDate: string;
}) {
  const [availableSeats, setAvailableSeats] = useState(initialSeats);
  const [isBooking, setIsBooking] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showTicket, setShowTicket] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedBooking = localStorage.getItem(`booking_${eventId}`);
    if (storedBooking) {
      setBooking(JSON.parse(storedBooking));
    }
  }, [eventId]);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsBooking(true);
    try {
      const response = await fetch(`/api/events/${eventId}/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, location }),
      });
      if (response.ok) {
        const data = await response.json();
        setAvailableSeats(data.availableSeats);
        const newBooking = { name, location };
        setBooking(newBooking);
        localStorage.setItem(`booking_${eventId}`, JSON.stringify(newBooking));
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);
        setShowForm(false);
      } else {
        console.error("Booking failed:", await response.text());
      }
    } catch (error) {
      console.error("Booking failed:", error);
    }
    setIsBooking(false);
    router.refresh();
  };

  const handleCancel = async () => {
    try {
      const response = await fetch(`/api/events/${eventId}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: booking?.name }),
      });
      if (response.ok) {
        const data = await response.json();
        setAvailableSeats(data.availableSeats);
        setBooking(null);
        localStorage.removeItem(`booking_${eventId}`);
      }
    } catch (error) {
      console.error("Cancellation failed:", error);
    }
    router.refresh();
  };

  return (
    <>
      {booking ? (
        <div className="space-x-2">
          <Button onClick={() => setShowTicket(true)} className="text-teal-700 border-teal-700 border-2">View Ticket</Button>
          <Button onClick={handleCancel} className="bg-red-500 text-white">
            Cancel Booking
          </Button>
        </div>
      ) : (
        <Button
          onClick={() => setShowForm(true)}
          disabled={availableSeats === 0 || isBooking}
          className="border border-teal-700"
        >
          {isBooking
            ? "Booking..."
            : availableSeats > 0
            ? "Book Now"
            : "Sold Out"}
        </Button>
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-black">Book Event</DialogTitle>
            <DialogDescription className="text-black">
              Please enter your details to book the event.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleBook} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm text-black font-medium">
                Name
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="location"
                className="text-sm text-black font-medium"
              >
                Location
              </label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>
            <Button type="submit" disabled={isBooking}>
              {isBooking ? "Booking..." : "Confirm Booking"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showTicket} onOpenChange={setShowTicket}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-black">Your Ticket</DialogTitle>
          </DialogHeader>
          <Card>
            <CardHeader>
              <CardTitle>{eventTitle}</CardTitle>
              <CardDescription>Event Date: {eventDate}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Name: {booking?.name}</p>
              <p>Location: {booking?.location}</p>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>

      {showSuccessMessage && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-md">
          Booking successful!
        </div>
      )}
    </>
  );
}
