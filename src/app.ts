import express from 'express';
import swaggerUi from 'swagger-ui-express';
import coinRoutes from './routes/coin.routes';
import { swaggerDocument } from './swagger';

const app = express();

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/coins', coinRoutes);

export default app;