import dotenv from "dotenv";
dotenv.config();

import config from "./config/config.js";
import app from "./express.js";
import mongoose from "mongoose";
import http from "http";
import { Server } from "socket.io";
import scheduledJobs from "./services/scheduledJobs.js";
import { eventQueue } from "./services/eventQueue.js";
import { initializeSocket } from "./socket/socketServer.js";

const PORT = config.port || 5000;
const server = http.createServer(app);

// Initialize Socket.io with CORS
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || ["http://localhost:3000", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
});

// Make io accessible to routes
app.set('io', io);

// Initialize socket handlers
initializeSocket(io);

mongoose
  .connect(config.mongoUri, {
    autoIndex: true,
  })
  .then(() => {
    console.log("✅ Database Connection Successful");
    // Start scheduled jobs after database connection
    scheduledJobs.start();
  })
  .catch((err) => {
    console.error("❌ Database Connection Unsuccessful:", err.message);
    process.exit(1);
  });

mongoose.connection.on("connected", () => console.log("📡 MongoDB connected"));
mongoose.connection.on("error", (err) =>
  console.error("⚠️ MongoDB error:", err)
);
mongoose.connection.on("disconnected", () =>
  console.log("🔌 MongoDB disconnected")
);

process.on("SIGINT", async () => {
  console.log('\n🛑 Shutting down gracefully...');
  
  // Close socket connections
  io.close();
  console.log('🔌 Socket.io connections closed');
  
  // Stop scheduled jobs
  scheduledJobs.stop();
  
  // Flush remaining analytics events
  try {
    await eventQueue.flush();
    console.log('📊 Analytics events flushed');
  } catch (error) {
    console.error('⚠️ Error flushing analytics:', error.message);
  }
  
  // Stop event queue
  eventQueue.stop();
  
  // Close database connection
  await mongoose.connection.close();
  console.log("🔌 Database disconnected through app termination");
  
  process.exit(0);
});

server.listen(PORT, () => {
  console.log(`🚀 ChatterHub running at http://localhost:${PORT}`);
  console.log(`🔌 Socket.io ready for connections`);
});

export { io };