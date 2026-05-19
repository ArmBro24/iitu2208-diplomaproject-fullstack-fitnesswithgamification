import 'dotenv/config';
import OpenAI from 'openai';

const SYSTEM_PROMPT = [
    'You are the AI fitness assistant inside HeroFit, a fitness app with workout tracking and gamification.',
    'Use only the provided user context and chat messages when personalizing recommendations.',
    'If important data is missing, say what is missing instead of inventing it.',
    'Give general fitness advice only. Do not provide medical diagnosis or treatment.',
    'If injuries, pain, illness, or health limitations are mentioned, recommend consulting a qualified specialist.',
    'Keep answers short, practical, and personalized.',
    'Prefer concrete next-step recommendations: workout focus, intensity, recovery, and one nutrition or habit note when relevant.',
].join(' ');
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

const sanitizeMessages = (messages) =>
    (Array.isArray(messages) ? messages : [])
        .filter((message) => ['user', 'assistant'].includes(message?.role) && typeof message.content === 'string')
        .slice(-6)
        .map(({ role, content }) => ({
            role,
            content: content.trim().slice(0, 1200),
        }));

const compactJson = (value) =>
    JSON.stringify(value, (_key, item) => {
        if (item === undefined || item === null || item === '') return undefined;
        if (Array.isArray(item)) return item.length ? item : undefined;
        if (typeof item === 'object' && !Array.isArray(item)) {
            return Object.keys(item).length ? item : undefined;
        }
        return item;
    }, 2);

const buildContextMessage = (userContext) => {
    if (!userContext) {
        return 'No structured HeroFit user context was provided for this request. Answer generally and ask for missing profile or workout details when needed.';
    }

    return [
        'Structured HeroFit user context is provided below.',
        'Do not calculate new health-critical values from raw data; use derivedMetrics when available.',
        'Use this data for personalization and mention missing data if it affects the recommendation.',
        compactJson(userContext),
    ].join('\n');
};

export const askAI = async (messages, userContext) => {
    const safeMessages = sanitizeMessages(messages);

    const completion = await getOpenAIClient().chat.completions.create({
        model: MODEL,
        messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'system', content: buildContextMessage(userContext) },
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
