/* eslint-disable @typescript-eslint/no-require-imports */
const { MongoClient } = require('mongodb');
require('dotenv').config();

async function test() {
  const client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  const db = client.db();
  const today = new Date(); today.setHours(0,0,0,0);
  const events = await db.collection('events').aggregate([
    { $match: { status: 'LIVE', date: { $gte: today } } },
    { $lookup: { from: 'users', localField: 'hostId', foreignField: '_id', as: 'host' } },
    { $unwind: { path: '$host', preserveNullAndEmptyArrays: true } },
    { $project: { title: 1, hostId: { _id: '$host._id', name: '$host.name', profileImage: '$host.profileImage' } } }
  ]).toArray();
  console.log(JSON.stringify(events, null, 2));
  process.exit(0);
}
test();
