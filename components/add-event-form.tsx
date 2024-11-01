"use client";

import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

export function AddEventForm({ onEventAdded }: { onEventAdded: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [availableSeats, setAvailableSeats] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        date,
        availableSeats: parseInt(availableSeats),
      }),
    });

    if (response.ok) {
      setTitle("");
      setDescription("");
      setDate("");
      setAvailableSeats("");
      onEventAdded();
    } else {
      console.error("Failed to add event");
    }
  };

  return (
    <Card className="bg-white text-gray-800 p-8 rounded-lg shadow-lg">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center mb-6 text-teal-600">Add New Event</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-5">
          <div className="space-y-1">
            <label htmlFor="title" className="text-md font-semibold text-gray-700">
              Title
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="border-teal-400 bg-gray-100 text-gray-800 placeholder-gray-500 focus:ring-teal-500 focus:border-teal-500 transition duration-150 ease-in-out"
              placeholder="Enter event title"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="description" className="text-md font-semibold text-gray-700">
              Description
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="border-teal-400 bg-gray-100 text-gray-800 placeholder-gray-500 focus:ring-teal-500 focus:border-teal-500 transition duration-150 ease-in-out"
              placeholder="Enter event description"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="date" className="text-md font-semibold text-gray-700">
              Date
            </label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="border-teal-400 bg-gray-100 text-gray-800 placeholder-gray-500 focus:ring-teal-500 focus:border-teal-500 transition duration-150 ease-in-out"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="availableSeats" className="text-md font-semibold text-gray-700">
              Available Seats
            </label>
            <Input
              id="availableSeats"
              type="number"
              value={availableSeats}
              onChange={(e) => setAvailableSeats(e.target.value)}
              required
              className="border-teal-400 bg-gray-100 text-gray-800 placeholder-gray-500 focus:ring-teal-500 focus:border-teal-500 transition duration-150 ease-in-out"
              placeholder="Enter number of seats"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            type="submit"
            className="bg-teal-500 text-white rounded-lg py-3 px-6 shadow-md transition duration-150 ease-in-out hover:bg-teal-600"
          >
            Add Event
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
