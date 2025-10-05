import express from "express";
import cors from "cors";
import productRoutes from "./routes/productRoutes";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/products", productRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
