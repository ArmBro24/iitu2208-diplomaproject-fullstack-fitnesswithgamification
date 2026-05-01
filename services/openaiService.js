import 'dotenv/config';
import OpenAI from 'openai';

const SYSTEM_PROMPT = 'You are a fitness coach. Give short, practical advice about workouts and nutrition.';
const MODEL = process.env.OPENAI_MODEL || 'gpt-5.2';
let openai;

const ensureApiKey = () => {
    if (!process.env.OPENAI_API_KEY) {
        throw new Error('OPENAI_API_KEY is not configured.');
    }
};

const getOpenAIClient = () => {
    ensureApiKey();

    if (!openai) {
        openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }

    return openai;
};

const getReplyText = (completion) =>
    completion.choices?.[0]?.message?.content?.trim() || 'I could not generate a response right now.';

export const askAI = async (messages) => {
    const safeMessages = Array.isArray(messages) ? messages.slice(-6) : [];

    const completion = await getOpenAIClient().chat.completions.create({
        model: MODEL,
        messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...safeMessages,
        ],
    });

    return getReplyText(completion);
};

export const generateWorkout = async ({ level, goal, lastSessions }) => {
    const sessions = Array.isArray(lastSessions) && lastSessions.length
        ? lastSessions.slice(-5).join(', ')
        : 'No recent sessions provided';

    const completion = await getOpenAIClient().chat.completions.create({
        model: MODEL,
        messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            {
                role: 'user',
                content: [
                    `Create a short workout recommendation.`,
                    `Client level: ${level || 'Unknown'}.`,
                    `Goal: ${goal || 'General fitness'}.`,
                    `Recent sessions: ${sessions}.`,
                    'Return a practical plan with warmup, main work, cooldown, and one nutrition tip.',
                ].join('\n'),
            },
        ],
    });

    return getReplyText(completion);
};
