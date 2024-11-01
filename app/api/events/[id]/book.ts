import type { NextApiRequest, NextApiResponse } from 'next'
import { bookEvent, Booking } from '../../../../lib/db'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  if (req.method === 'POST') {
    // Get booking details from the request body
    const booking: Booking = req.body;

    if (!booking || !booking.name || !booking.location) {
      return res.status(400).json({ message: 'Invalid booking data' });
    }

    // Pass both id and booking to bookEvent
    const updatedEvent = bookEvent(id as string, booking);

    if (updatedEvent) {
      res.status(200).json(updatedEvent);
    } else {
      res.status(400).json({ message: 'No available seats or event not found' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
