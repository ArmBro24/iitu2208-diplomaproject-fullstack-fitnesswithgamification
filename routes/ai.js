import express from 'express';
import { askAI, generateWorkout } from '../services/openaiService.js';

const router = express.Router();

router.post('/chat', async (req, res) => {
    try {
        const { message, messages } = req.body;

        if (!message || typeof message !== 'string') {
            return res.status(400).json({ error: 'Message is required.' });
        }

        const history = Array.isArray(messages) ? messages.slice(-6) : [];
        const reply = await askAI([
            ...history,
            { role: 'user', content: message },
        ]);

        return res.json({ reply });
    } catch (error) {
        console.error('AI chat error:', error);
        return res.status(500).json({ error: 'AI chat failed.' });
    }
});

router.post('/recommend', async (req, res) => {
    try {
        const { level, goal, lastSessions } = req.body;
        const plan = await generateWorkout({ level, goal, lastSessions });

        return res.json({ plan });
    } catch (error) {
        console.error('AI recommendation error:', error);
        return res.status(500).json({ error: 'AI workout recommendation failed.' });
    }
});

export default router;
