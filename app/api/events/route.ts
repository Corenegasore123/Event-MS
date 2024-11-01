import { NextResponse } from 'next/server'
import { getEvents, addEvent } from '../../../lib/db'

export async function GET() {
  const events = getEvents()
  return NextResponse.json(events)
}

export async function POST(request: Request) {
  const body = await request.json()
  const newEvent = addEvent(body)
  return NextResponse.json(newEvent, { status: 201 })
}