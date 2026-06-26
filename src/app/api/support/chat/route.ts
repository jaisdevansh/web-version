import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { MongoClient, ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

const mongoUri = process.env.MONGO_URI || "mongodb+srv://jaisdevansh2004_db_user:V3pU4sMZdEEPwPzT@party.qaycsm4.mongodb.net/?appName=party";
const client = new MongoClient(mongoUri);

// Helper to authenticate user from token by proxying to backend
async function authenticate(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.error('[AI Chat] No auth header or invalid format:', authHeader);
    return null;
  }
  
  const token = authHeader.split(' ')[1];
  if (!token || token === 'null' || token === 'undefined') {
    console.error('[AI Chat] Token is null or undefined');
    return null;
  }
  
  try {
    // Instead of trying to guess the JWT secret (which is on AWS), 
    // we simply ask the AWS backend if the token is valid!
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://party.stayin.in/api1';
    
    const res = await fetch(`${backendUrl}/user/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!res.ok) {
      console.error('[AI Chat] Backend rejected token, status:', res.status);
      return null;
    }
    
    const data = await res.json();
    if (data.success && data.data && data.data._id) {
      console.log('[AI Chat] Auth successful for userId via Backend proxy:', data.data._id);
      return data.data._id;
    }
    
    return null;
  } catch (e: any) {
    console.error('[AI Chat] Authentication Proxy Failed:', e.message);
    return null;
  }
}

export async function GET(req: Request) {
  const userId = await authenticate(req);
  if (!userId) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

  try {
    await client.connect();
    const db = client.db('test');
    const messages = await db.collection('supportmessages')
      .find({ userId: new ObjectId(userId) })
      .sort({ createdAt: 1 })
      .toArray();

    return NextResponse.json({ success: true, data: messages });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  } finally {
    await client.close();
  }
}

export async function POST(req: Request) {
  const userId = await authenticate(req);
  if (!userId) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

  try {
    const { message } = await req.json();
    if (!message) return NextResponse.json({ success: false, message: 'Message required' }, { status: 400 });

    await client.connect();
    const db = client.db('test');
    const collection = db.collection('supportmessages');

    // 1. Save user message
    await collection.insertOne({
      userId: new ObjectId(userId),
      content: message,
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // 2. Fetch history for context
    const history = await collection
      .find({ userId: new ObjectId(userId) })
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray();

    const context = history.reverse().map(m => ({
      role: m.role === 'ai' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    // 3. Initialize Gemini with correct model (gemini-1.5-flash)
    const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyAE0WK337l5d_ZMDljKvg0qu_H3zEHm1to';
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "You are the 'Entry Club Concierge', an elite AI assistant for 'Entry Club'. Keep responses concise." }],
        },
        {
          role: "model",
          parts: [{ text: "Welcome to Entry Club. I am your personal concierge. How may I assist you this evening?" }],
        },
        ...context.slice(0, -1)
      ],
    });

    const result = await chat.sendMessage(message);
    const aiResponseText = result.response.text();

    // 4. Save AI message
    await collection.insertOne({
      userId: new ObjectId(userId),
      content: aiResponseText,
      role: 'ai',
      metadata: { model: "gemini-1.5-flash" },
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return NextResponse.json({ success: true, data: { message: aiResponseText } });
  } catch (error: any) {
    console.error('AI Chat Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  } finally {
    await client.close();
  }
}

export async function DELETE(req: Request) {
  const userId = await authenticate(req);
  if (!userId) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

  try {
    await client.connect();
    const db = client.db('test');
    await db.collection('supportmessages').deleteMany({ userId: new ObjectId(userId) });
    return NextResponse.json({ success: true, message: 'Chat cleared' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  } finally {
    await client.close();
  }
}
