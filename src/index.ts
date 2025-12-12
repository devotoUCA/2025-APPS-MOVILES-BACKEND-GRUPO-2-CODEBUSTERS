import express from 'express';
import cors from 'cors';
import taskRoutes from './routes/taskRoutes';
import authRoutes from './routes/authRoutes';
import gardenRoutes from './routes/gardenRoutes';
import statsRoutes from './routes/statsRoutes'; // ← AGREGAR ESTA LÍNEA

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Backend funcionando!' });
});

app.use('/api', taskRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/garden', gardenRoutes);
app.use('/api', statsRoutes); // ← AGREGAR ESTA LÍNEA

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});