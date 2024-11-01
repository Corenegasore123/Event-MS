import { bookEvent } from '@/lib/db'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  {}
  const { id } =await params;
  
  try {
    const body = await request.json();
    const updatedEvent = await bookEvent(id, body);

    if (updatedEvent) {
      return Response.json(updatedEvent);
    } else {
      return Response.json(
        { error: 'No available seats or event not found' }, 
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error booking event:', error);
    return Response.json(
      { error: 'An error occurred while booking the event' }, 
      { status: 500 }
    );
  }
}