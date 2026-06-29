import { NextRequest } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

let mongoClient: MongoClient | null = null;
async function getMongoClient() {
  if (!mongoClient) {
    if (!process.env.MONGO_URI) throw new Error('MONGO_URI is missing');
    mongoClient = new MongoClient(process.env.MONGO_URI);
    await mongoClient.connect();
  }
  return mongoClient;
}

// Helper to serialize MongoDB documents to plain JSON
const serialize = (data: any) => JSON.parse(JSON.stringify(data));

async function handler(req: NextRequest) {
  // Extract the original path minus /api1
  const path = req.nextUrl.pathname.replace(/^\/api1/, '');
  const search = req.nextUrl.search;
  
  // -- OPTION 2 BYPASS: Fetch events directly from MongoDB --
  if (path === '/user/events' && req.method === 'GET') {
    try {
      const client = await getMongoClient();
      const db = client.db('entry_club');
      
      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const filterFrom = new Date(startOfToday.getTime() - 24 * 60 * 60 * 1000);
      
      const events = await db.collection('events').aggregate([
        { $match: { status: 'LIVE', date: { $gte: filterFrom } } },
        { $lookup: {
            from: 'users',
            localField: 'hostId',
            foreignField: '_id',
            as: 'userHost'
          }
        },
        { $lookup: {
            from: 'hosts',
            localField: 'hostId',
            foreignField: '_id',
            as: 'orgHost'
          }
        },
        { $addFields: {
            host: {
              $cond: {
                if: { $eq: ['$hostModel', 'User'] },
                then: { $arrayElemAt: ['$userHost', 0] },
                else: { $arrayElemAt: ['$orgHost', 0] }
              }
            }
          }
        },
        { $project: {
            title: 1, date: 1, startTime: 1, coverImage: 1, 
            locationVisibility: 1, isLocationRevealed: 1, 
            locationData: 1, floorCount: 1, tickets: 1, 
            floors: 1, price: 1, bookingOpenDate: 1, occupancy: 1,
            hostId: {
              _id: '$host._id',
              name: '$host.name',
              profileImage: '$host.profileImage'
            },
            hostModel: 1, attendeeCount: 1
        }},
        { $sort: { date: 1 } }
      ]).toArray();
        
      const mappedEvents = events.map(e => {
        const tickets = e.tickets || [];
        const floors = e.floors || [];
        
        const prices: number[] = [
          ...tickets.map((t: any) => t.price),
          ...floors.map((f: any) => f.price),
        ];
        
        const validPrices = prices.filter(p => p !== undefined && p !== null && !isNaN(p));
        const paidPrices = validPrices.filter(p => p > 0);
        
        let minPrice = undefined;
        if (paidPrices.length > 0) {
            minPrice = Math.min(...paidPrices);
        } else if (validPrices.length > 0) {
            minPrice = 0; 
        } else if (e.price !== undefined) {
            minPrice = e.price;
        }

        return {
          ...e,
          displayPrice: minPrice !== undefined ? minPrice : null
        };
      });

      return new Response(JSON.stringify({ 
        success: true, 
        data: serialize(mappedEvents),
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
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'MongoDB Bypass Failed', 
        error: err.message
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }
  }
  
  const eventFullMatch = path.match(/^\/user\/events\/([a-fA-F0-9]{24})\/full$/);
  if (eventFullMatch && req.method === 'GET') {
    try {
      const eventId = eventFullMatch[1];
      const client = await getMongoClient();
      const db = client.db('entry_club');
      
      const event = await db.collection('events').findOne({ _id: new ObjectId(eventId) });
      if (!event) {
        return new Response(JSON.stringify({ success: false, message: 'Event not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      }
      
      let host = null;
      if (event.hostId) {
        const collection = event.hostModel === 'User' ? 'users' : 'hosts';
        host = await db.collection(collection).findOne({ _id: event.hostId }, { projection: { firstName: 1, lastName: 1, name: 1, profileImage: 1, commissionRate: 1 } });
      }
      
      if (host) {
        event.hostId = {
          _id: host._id,
          name: host.name || `${host.firstName || ''} ${host.lastName || ''}`.trim() || 'Collective Underground',
          profileImage: host.profileImage,
          commissionRate: host.commissionRate !== undefined ? host.commissionRate : 10
        };
      }
      
      const dedicatedFloors = await db.collection('floors').find({ eventId: event._id }).toArray();
      const activeBookings = await db.collection('bookings').find({ eventId: event._id, status: { $ne: 'cancelled' } }).toArray();
      
      const occupancyMap: Record<string, number> = {};
      activeBookings.forEach(b => {
          let count = b.guests || 1;
          if (b.seatIds && b.seatIds.length > 0) count = b.seatIds.length;
          if (b.ticketType) {
              const tName = b.ticketType.replace(/\s+zone$/i, '').trim().toLowerCase();
              occupancyMap[tName] = (occupancyMap[tName] || 0) + count;
          }
          if (b.tableId) {
              const fName = b.tableId.trim().toLowerCase();
              occupancyMap[fName] = (occupancyMap[fName] || 0) + count;
          }
      });

      event.tickets = (event.tickets || []).map((t: any) => ({
          ...t,
          bookedCount: Math.max(t.sold || 0, occupancyMap[(t.name || t.type || '').trim().toLowerCase()] || 0)
      }));

      event.floors = (dedicatedFloors.length > 0 ? dedicatedFloors : (event.floors || [])).slice(0, 10).map((f: any) => ({
          ...f,
          bookedCount: Math.max(f.sold || 0, occupancyMap[(f.name || f.type || '').trim().toLowerCase()] || 0)
      }));
      
      return new Response(JSON.stringify({ success: true, data: serialize(event) }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    } catch (err: any) {
      return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
    }
  }

  const isDev = process.env.NODE_ENV === 'development';
  const baseUrl = isDev ? 'http://127.0.0.1:3001' : (process.env.NEXT_PUBLIC_API_URL || 'https://party.stayin.in/api1');
  const targetUrl = `${baseUrl}${path}${search}`;
  const headers = new Headers(req.headers);
  headers.delete('host');
  headers.delete('origin');
  headers.delete('referer');
  
  const init: RequestInit = { method: req.method, headers, redirect: 'manual', cache: 'no-store' };
  if (req.method !== 'GET' && req.method !== 'HEAD') init.body = await req.arrayBuffer();

  try {
    const response = await fetch(targetUrl, init);
    const resHeaders = new Headers(response.headers);
    resHeaders.delete('content-encoding');
    resHeaders.delete('content-length');
    resHeaders.set('Access-Control-Allow-Origin', '*');
    resHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    resHeaders.set('Access-Control-Allow-Headers', '*');
    
    return new Response(response.body, { status: response.status, statusText: response.statusText, headers: resHeaders });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: 'Proxy failed', details: err.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
}

export { handler as GET, handler as POST, handler as PUT, handler as DELETE, handler as OPTIONS };
