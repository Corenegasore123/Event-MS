import type { NextApiRequest, NextApiResponse } from 'next';
import { bookEvent, Booking } from '../../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'POST') {
    try {
      const booking: Booking = req.body;

      if (!booking || !booking.name || !booking.location) {
        return res.status(400).json({ message: 'Invalid booking data' });
      }

      const updatedEvent = await bookEvent(id as string, booking); 

      if (updatedEvent) {
        return res.status(200).json(updatedEvent);
      } else {
        return res.status(404).json({ message: 'No available seats or event not found' }); 
      }
    } catch (error) {
      console.error('Error booking event:', error); 
      return res.status(500).json({ message: 'An error occurred while booking the event' }); 
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
