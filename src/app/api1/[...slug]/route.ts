import { NextRequest } from 'next/server';
import { MongoClient } from 'mongodb';

let mongoClient: MongoClient | null = null;
async function getMongoClient() {
  if (!mongoClient) {
    if (!process.env.MONGO_URI) throw new Error('MONGO_URI is missing');
    mongoClient = new MongoClient(process.env.MONGO_URI);
    await mongoClient.connect();
  }
  return mongoClient;
}

async function handler(req: NextRequest) {
  // Extract the original path minus /api1
  const path = req.nextUrl.pathname.replace(/^\/api1/, '');
  const search = req.nextUrl.search;
  
  // -- OPTION 2 BYPASS: Fetch events directly from MongoDB --
  if (path === '/user/events' && req.method === 'GET') {
    try {
      const client = await getMongoClient();
      const db = client.db();
      
      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const filterFrom = new Date(startOfToday.getTime() - 24 * 60 * 60 * 1000);
      
      const events = await db.collection('events').aggregate([
        { $match: { status: 'LIVE', date: { $gte: filterFrom } } },
        { $lookup: {
            from: 'users',
            localField: 'hostId',
            foreignField: '_id',
            as: 'host'
          }
        },
        { $unwind: { path: '$host', preserveNullAndEmptyArrays: true } },
        { $project: {
            title: 1, date: 1, startTime: 1, coverImage: 1, 
            locationVisibility: 1, isLocationRevealed: 1, 
            locationData: 1, floorCount: 1, tickets: 1, 
            floors: 1, displayPrice: 1, bookingOpenDate: 1, occupancy: 1,
            hostId: {
              _id: '$host._id',
              name: '$host.name',
              profileImage: '$host.profileImage'
            },
            hostModel: 1, attendeeCount: 1
        }},
        { $sort: { date: 1 } }
      ]).toArray();
        
      return new Response(JSON.stringify({ 
        success: true, 
        data: events,
        pagination: { page: 1, limit: 20, total: events.length, pages: 1 } 
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
          'Access-Control-Allow-Headers': '*'
        }
      });
    } catch (err: any) {
      console.error('Direct MongoDB bypass error:', err);
      // Fallback to the standard proxy if the database fetch fails
    }
  }
  // -- END OPTION 2 BYPASS --

  const isDev = process.env.NODE_ENV === 'development';
  // Use local backend in dev, or the configured API URL in production
  // Using 127.0.0.1 instead of localhost to prevent IPv6 ECONNREFUSED errors in Node.js 18+
  const baseUrl = isDev ? 'http://127.0.0.1:3001' : (process.env.NEXT_PUBLIC_API_URL || 'https://party.stayin.in/api1');
  const targetUrl = `${baseUrl}${path}${search}`;

  const headers = new Headers(req.headers);
  // Remove headers that often cause WAF/CORS blocks on proxies
  headers.delete('host');
  headers.delete('origin');
  headers.delete('referer');
  
  const init: RequestInit = {
    method: req.method,
    headers,
    redirect: 'manual',
    cache: 'no-store',
  };

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    init.body = await req.arrayBuffer();
  }

  try {
    const response = await fetch(targetUrl, init);
    const resHeaders = new Headers(response.headers);
    
    // Next.js fetch automatically decompresses the body, so we must remove these headers
    resHeaders.delete('content-encoding');
    resHeaders.delete('content-length');
    
    // Inject CORS headers so localhost:3000 doesn't get blocked
    resHeaders.set('Access-Control-Allow-Origin', '*');
    resHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    resHeaders.set('Access-Control-Allow-Headers', '*');
    
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: resHeaders,
    });
  } catch (err: any) {
    console.error('Proxy error:', err);
    return new Response(JSON.stringify({ error: 'Proxy failed', details: err.message }), { 
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

export { 
  handler as GET, 
  handler as POST, 
  handler as PUT, 
  handler as DELETE, 
  handler as PATCH, 
  handler as OPTIONS 
};
