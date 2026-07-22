const mongoose = require("mongoose");

// Serverless-safe MongoDB connection.
//
// On Vercel each request may hit a fresh function instance, so we cache the
// connection (and the in-flight connect promise) on `global` to reuse it across
// warm invocations instead of opening a new socket every time. On a normal
// always-on server (server.js) this simply connects once and returns.
let cached = global._mongooseConn;
if (!cached) {
  cached = global._mongooseConn = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGO_URI, {
        dbName: "StudySproutDB",
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        retryWrites: true,
        w: "majority",
        // Keep the pool small — serverless instances are short-lived.
        maxPoolSize: 5,
      })
      .then((conn) => {
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        return conn;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    // Reset so the next request can retry instead of being stuck on a rejected
    // promise. Throw (don't process.exit) so serverless functions stay alive.
    cached.promise = null;
    console.error("❌ MongoDB Connection Error:", error.message);
    throw error;
  }

  return cached.conn;
};

module.exports = connectDB;
