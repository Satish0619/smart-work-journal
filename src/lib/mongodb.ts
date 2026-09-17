import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable is not set');
}

// Reuse connection across hot reloads in development
const globalWithMongoose = global as typeof global & {
  _mongooseConn: mongoose.Connection | null;
  _mongoosePromise: Promise<mongoose.Connection> | null;
};

if (!globalWithMongoose._mongooseConn) {
  globalWithMongoose._mongooseConn = null;
  globalWithMongoose._mongoosePromise = null;
}

export async function connectToDatabase(): Promise<mongoose.Connection> {
  if (globalWithMongoose._mongooseConn) {
    return globalWithMongoose._mongooseConn;
  }

  if (!globalWithMongoose._mongoosePromise) {
    globalWithMongoose._mongoosePromise = mongoose
      .connect(MONGODB_URI)
      .then((m) => m.connection);
  }

  globalWithMongoose._mongooseConn = await globalWithMongoose._mongoosePromise;
  return globalWithMongoose._mongooseConn;
}
