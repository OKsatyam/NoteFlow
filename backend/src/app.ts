import express from "express";
import cors from "cors";
import pageRoutes from "./routes/v1/page.routes";


const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("NoteFlow API running");
});

app.use("/api/v1/pages", pageRoutes);

export default app;