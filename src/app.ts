import express from 'express';
import coinRoutes from './routes/coin.routes';

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/coins', coinRoutes);

export default app;