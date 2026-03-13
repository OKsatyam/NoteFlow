import express from "express";
import cors from "cors";
import pageRoutes from "./routes/v1/page.routes";
import { errorHandler } from "./middleware/error.middleware";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("NoteFlow API running");
});

app.use("/api/v1/pages", pageRoutes);

// Error handler MUST be after all routes
app.use(errorHandler);

export default app;