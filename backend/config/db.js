import mongoose from 'mongoose';

let mongod = null;

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/elora_beauty';
    // Try connecting to primary mongoURI
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2500,
    });
    console.log(`[MongoDB] Connected to Primary Database: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.warn(`[MongoDB] Primary connection failed: ${err.message}. Initializing in-memory fallback...`);
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      const conn = await mongoose.connect(uri);
      console.log(`[MongoDB] Connected to In-Memory Database at ${uri}`);
      return conn;
    } catch (memErr) {
      console.error(`[MongoDB] In-memory database error: ${memErr.message}`);
      process.exit(1);
    }
  }
};

export default connectDB;
