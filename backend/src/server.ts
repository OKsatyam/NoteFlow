import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import connectDB from "./config/db";
import { cleanupTrash } from "./utils/cleanupTrash";
import cron from "node-cron";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  cron.schedule("* * * * *", async () => {
    console.log("[Cron] Running trash cleanup...");
    await cleanupTrash();
  });

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();