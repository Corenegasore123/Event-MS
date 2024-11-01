import { NextResponse } from 'next/server'
import { editEvent, deleteEvent } from '../../../../lib/db'


export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const {id} = await params
  const body = await request.json()
  const updatedEvent = editEvent(id, body)

  if (updatedEvent) {
    return NextResponse.json(updatedEvent)
  } else {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id
  const success = deleteEvent(id)

  if (success) {
    return NextResponse.json({ message: 'Event deleted successfully' })
  } else {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 })
  }
}