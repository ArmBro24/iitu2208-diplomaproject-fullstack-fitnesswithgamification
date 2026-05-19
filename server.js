import 'dotenv/config';
import express from 'express';
import aiRoutes from './routes/ai.js';

const app = express();
const PORT = process.env.AI_PORT || 8090;

app.use(express.json());

app.use('/api/ai', aiRoutes);

app.listen(PORT, () => {
    console.log(`API server running on http://localhost:${PORT}`);
});
