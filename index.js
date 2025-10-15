import express from "express";
import uploadsRouter from "./routes/uploads.js";

const app = express();

app.use("/uploads", express.static("public/uploads"));

app.listen(3000, () => console.log("Server running on http://localhost:3000"));

app.use(express.json());
app.use("/api/upload", uploadsRouter);
