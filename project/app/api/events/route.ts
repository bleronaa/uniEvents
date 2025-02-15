import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Event from "../models/Events";

export async function GET(){
    try{
        await dbConnect();
        const events = await Event.find({}).sort({date:1 });
        return NextResponse.json(events)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
      }
    }
    
    export async function POST(request: Request) {
      try {
        await dbConnect();
        const data = await request.json();
        const event = await Event.create(data);
        return NextResponse.json(event, { status: 201 });
      } catch (error) {
        return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
      }
    }