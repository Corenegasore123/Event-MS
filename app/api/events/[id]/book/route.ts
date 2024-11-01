import { NextResponse } from 'next/server';
import { bookEvent } from '../../../../../lib/db';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Await the params object to access its properties
  const { id } = await params; // Correctly await params before using it

  const body = await request.json();
  const updatedEvent = bookEvent(id, body);

  if (updatedEvent) {
    return NextResponse.json(updatedEvent);
  } else {
    return NextResponse.json({ error: 'No available seats or event not found' }, { status: 400 });
  }
}
