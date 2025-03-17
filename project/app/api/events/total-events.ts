import cors from '../../middleware'; 
import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';
import dbConnect from "@/lib/db";
import Events from "../models/Events";
import { runMiddleware } from "../../middleware"; 

export default async function GET(req: NextApiRequest, res: NextApiResponse) {
  await runMiddleware(req, res, cors); // Apply CORS middleware

  try {
    await dbConnect();
    const totalEvents = await Events.countDocuments();
    return NextResponse.json({ totalEvents }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch total events' }, { status: 500 });
  }
}
