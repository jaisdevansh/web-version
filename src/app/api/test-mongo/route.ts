import { NextRequest } from 'next/server';
import { MongoClient } from 'mongodb';

export async function GET(req: NextRequest) {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      return new Response(JSON.stringify({ error: 'No MONGO_URI' }), { status: 500 });
    }
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db();
    const events = await db.collection('events').find().limit(1).toArray();
    await client.close();
    return new Response(JSON.stringify({ success: true, events }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message, stack: err.stack }), { status: 500 });
  }
}
