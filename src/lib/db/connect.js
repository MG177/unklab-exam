import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI;

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

// Serverless note: platform function timeouts apply to Route Handlers.
// Large MongoDB aggregations (score tables, bulk exports) should use
// pagination, model indexes, or background jobs — not unbounded pipelines.

export async function connectDB() {
  if (!MONGO_URI) {
    throw new Error('MONGO_URI is not configured');
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI, { bufferCommands: false });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
