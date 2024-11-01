import type { NextApiRequest, NextApiResponse } from 'next'

const ADMIN_USERNAME = 'admin'
const ADMIN_PASSWORD = 'Admin@12345'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { username, password } = req.body

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // In a real application, you'd set a session or return a JWT token here
      res.status(200).json({ message: 'Login successful' })
    } else {
      res.status(401).json({ message: 'Invalid credentials' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}