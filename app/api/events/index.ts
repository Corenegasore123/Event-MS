import type { NextApiRequest, NextApiResponse } from 'next'
import { getEvents, addEvent } from '../../../lib/db'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    res.status(200).json(getEvents())
  } else if (req.method === 'POST') {
    const newEvent = addEvent(req.body)
    res.status(201).json(newEvent)
  } else {
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}