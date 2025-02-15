import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Event from '../models/Events';
import Registration from '../models/Registrations';

export async function POST(request: Request) {
  try {
    await dbConnect();
    
    // Get user ID from request headers (set by middleware)
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { eventId } = await request.json();

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Check capacity
    const registrationCount = await Registration.countDocuments({ event: eventId });
    if (event.capacity && registrationCount >= event.capacity) {
      return NextResponse.json(
        { error: 'Event is full' },
        { status: 400 }
      );
    }

    // Create registration
    const registration = await Registration.create({
      user: userId,
      event: eventId,
      status: 'confirmed'
    });

    return NextResponse.json(registration, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to register for event' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    await dbConnect();
    
    // Get user ID from request headers (set by middleware)
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user's registrations
    const registrations = await Registration.find({ user: userId })
      .populate('event')
      .sort({ createdAt: -1 });

    return NextResponse.json(registrations);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch registrations' },
      { status: 500 }
    );
  }
}