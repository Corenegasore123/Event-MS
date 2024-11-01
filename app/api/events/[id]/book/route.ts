import { NextRequest, NextResponse } from 'next/server'
import { bookEvent } from '@/lib/db'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  
  try {
    const body = await request.json();
    const updatedEvent = await bookEvent(id, body);

    if (updatedEvent) {
      return NextResponse.json(updatedEvent);
    } else {
      return NextResponse.json(
        { error: 'No available seats or event not found' }, 
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error booking event:', error);
    return NextResponse.json(
      { error: 'An error occurred while booking the event' }, 
      { status: 500 }
    );
  }
}