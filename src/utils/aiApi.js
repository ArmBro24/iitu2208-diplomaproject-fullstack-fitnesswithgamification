const keepChatHistory = (messages) =>
    messages
        .filter((item) => item.role === 'user' || item.role === 'assistant')
        .slice(-6)
        .map(({ role, content }) => ({ role, content }));

const postJson = async (url, payload) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.error || 'AI request failed.');
    }

    return data;
};

export const sendAIChat = async ({ message, messages = [], userContext } = {}) => {
    const data = await postJson('/api/ai/chat', {
        message,
        messages: keepChatHistory(messages),
        userContext,
    });

    return data.reply;
};

export const requestWorkoutPlan = async ({ level, goal, lastSessions }) => {
    const data = await postJson('/api/ai/recommend', {
        level,
        goal,
        lastSessions,
    });

    return data.plan;
};
