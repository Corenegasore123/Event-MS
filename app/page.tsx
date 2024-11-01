import Link from "next/link";
import { getEvents } from "@/lib/db";
import { BookEventButton } from "@/components/ui/book-event-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const revalidate = 0; 

export default async function Home() {
  const events = await getEvents();

  return (
    <div className="container bg-white mx-auto py-4 px-16">
      <div className="flex justify-between items-center bg-white fixed top-0 left-0 right-0 px-16 py-6">
        <h1 className="text-3xl font-bold text-teal-600">Event-MS</h1>
        <Link href="/admin/login">
          <Button className="bg-teal-600 text-white">Login as Admin</Button>
        </Link>
      </div>
      <div className="mt-24 mb-10">
        <h1 className="text-xl font-bold">All Events</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((event) => (
          <Card key={event.id} className="bg-white text-black">
            <CardHeader>
              <CardTitle>{event.title}</CardTitle>
              <CardDescription>{event.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Date: {event.date}</p>
              <p>Available Seats: {event.availableSeats}</p>
            </CardContent>
            <CardFooter>
              <BookEventButton
                eventId={event.id}
                initialSeats={event.availableSeats}
                eventTitle={event.title}
                eventDate={event.date}
              />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
