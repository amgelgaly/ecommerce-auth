import mongoose from 'mongoose';

const MONGODB_URI: string | undefined = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  )
}

let cached: any = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function dbConnect() {
  console.log("Attempting to connect to MongoDB...");
  if (cached.conn) {
    console.log("Using cached MongoDB connection.");
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then(mongoose => {
      return mongoose
    })
  }
  try {
    cached.conn = await cached.promise;
    console.log("MongoDB Connected Successfully!");
  } catch (e) {
    console.error("MongoDB connection failed:", e); // Log specific error
    cached.promise = null;
    throw e;
  }
  return cached.conn;
}

export default dbConnect;