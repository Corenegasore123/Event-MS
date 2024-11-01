import type { NextApiRequest, NextApiResponse } from 'next'
import { deleteEvent } from '../../../lib/db'


export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  if (req.method === 'DELETE') {
    deleteEvent(id as string)
    res.status(200).json({ message: 'Event deleted successfully' })
  } else {
    res.setHeader('Allow', ['DELETE'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}