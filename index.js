import express from "express";
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Servidor funcionando 🚀");
});

app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
