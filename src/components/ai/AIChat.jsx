import React, { useEffect, useRef, useState } from 'react';
import { FiSend, FiX } from 'react-icons/fi';
import { sendAIChat } from '../../utils/aiApi.js';

const initialMessages = [
    {
        role: 'assistant',
        content: 'Hi. Ask me about workouts, recovery, or nutrition. I will keep it short and practical.',
    },
];

const AIChat = ({ onClose }) => {
    const [messages, setMessages] = useState(initialMessages);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const text = input.trim();
        if (!text || isLoading) return;

        const nextMessages = [...messages, { role: 'user', content: text }];
        setMessages(nextMessages);
        setInput('');
        setIsLoading(true);

        try {
            const reply = await sendAIChat({ message: text, messages });
            setMessages([...nextMessages, { role: 'assistant', content: reply }]);
        } catch (error) {
            setMessages([
                ...nextMessages,
                { role: 'assistant', content: error.message || 'AI assistant is unavailable right now.' },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[120] flex items-end justify-center bg-black/55 px-4 py-5 backdrop-blur-sm sm:items-center">
            <section className="flex h-[78vh] w-full max-w-[520px] flex-col overflow-hidden rounded-[28px] border border-white/10 bg-[#151816] shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
                <header className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                    <div>
                        <h2 className="font-rubik text-xl font-bold text-[#f5efe7]">AI Assistant</h2>
                        <p className="mt-1 text-xs text-white/45">Workout and nutrition coach</p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full border border-white/10 bg-white/5 p-2 text-white/70 transition-all hover:bg-white/10"
                    >
                        <FiX size={18} />
                    </button>
                </header>

                <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
                    {messages.map((message, index) => (
                        <div
                            key={`${message.role}-${index}`}
                            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <p
                                className={`max-w-[82%] whitespace-pre-line rounded-[20px] px-4 py-3 text-sm leading-relaxed ${
                                    message.role === 'user'
                                        ? 'bg-[#c1cf98] text-[#141712]'
                                        : 'border border-white/10 bg-white/[0.06] text-[#f3e8dc]'
                                }`}
                            >
                                {message.content}
                            </p>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex justify-start">
                            <p className="rounded-[20px] border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white/50">
                                Thinking...
                            </p>
                        </div>
                    )}

                    <div ref={bottomRef} />
                </div>

                <form onSubmit={handleSubmit} className="flex gap-3 border-t border-white/10 px-4 py-4">
                    <input
                        value={input}
                        onChange={(event) => setInput(event.target.value)}
                        placeholder="Ask for workout advice..."
                        className="min-w-0 flex-1 rounded-full border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-[#c1cf98]/50"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#c1cf98]/35 bg-[#c1cf98]/15 text-[#eaf2cf] transition-all hover:bg-[#c1cf98]/25 disabled:cursor-not-allowed disabled:opacity-45"
                    >
                        <FiSend size={18} />
                    </button>
                </form>
            </section>
        </div>
    );
};

export default AIChat;
