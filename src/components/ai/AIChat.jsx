import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FiSend, FiX } from 'react-icons/fi';
import { sendAIChat } from '../../utils/aiApi.js';
import {
    collectHeroFitAIContext,
    isAIProfileRefreshDue,
    isAIProfileSetupComplete,
    loadAIProfileMemory,
    migrateLegacyAIProfileMemory,
    saveAIProfileMemory,
} from '../../utils/aiContext.js';
import useStore from '../../store/useStore.js';

const getInitialMessages = (needsProfileSetup) => [
    {
        role: 'assistant',
        content: needsProfileSetup
            ? 'Привет. Чтобы давать точные советы, сначала запомню твои базовые параметры: рост, вес, цель, уровень и ограничения по здоровью.'
            : 'Hi. Ask me about workouts, recovery, or nutrition. I will keep it short and practical.',
    },
];

const emptyProfileForm = {
    height: '',
    weight: '',
    fitnessGoal: '',
    trainingLevel: '',
    limitations: '',
};

const AIChat = ({ onClose, selectedClient, assignedWorkouts, scheduleItems }) => {
    const { currentUser, userStats, challenges, sessions } = useStore();
    const profileOwner = useMemo(
        () => selectedClient
            ? { ...selectedClient, role: selectedClient.role ?? 'client' }
            : currentUser,
        [currentUser?.id, currentUser?.role, selectedClient?.id, selectedClient?.role]
    );
    const initialProfileMemory = loadAIProfileMemory(profileOwner);
    const needsProfileSetup = !isAIProfileSetupComplete(initialProfileMemory);
    const [messages, setMessages] = useState(() => getInitialMessages(needsProfileSetup));
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [aiProfileMemory, setAIProfileMemory] = useState(() => initialProfileMemory);
    const [profileForm, setProfileForm] = useState(() => ({
        ...emptyProfileForm,
        ...(initialProfileMemory ?? {}),
    }));
    const [showProfileSetup, setShowProfileSetup] = useState(() => needsProfileSetup);
    const [showRefreshPrompt, setShowRefreshPrompt] = useState(() => isAIProfileRefreshDue(initialProfileMemory));
    const [refreshForm, setRefreshForm] = useState(() => ({
        weight: initialProfileMemory?.weight ?? '',
        fitnessGoal: initialProfileMemory?.fitnessGoal ?? '',
    }));
    const bottomRef = useRef(null);

    useEffect(() => {
        const migratedProfile = migrateLegacyAIProfileMemory(profileOwner);
        const nextProfile = migratedProfile ?? loadAIProfileMemory(profileOwner);
        const nextNeedsSetup = !isAIProfileSetupComplete(nextProfile);

        setAIProfileMemory(nextProfile);
        setProfileForm({ ...emptyProfileForm, ...(nextProfile ?? {}) });
        setRefreshForm({
            weight: nextProfile?.weight ?? '',
            fitnessGoal: nextProfile?.fitnessGoal ?? '',
        });
        setShowProfileSetup(nextNeedsSetup);
        setShowRefreshPrompt(!nextNeedsSetup && isAIProfileRefreshDue(nextProfile));
        setMessages(getInitialMessages(nextNeedsSetup));
    }, [profileOwner]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    const updateProfileField = (field, value) => {
        setProfileForm((current) => ({
            ...current,
            [field]: value,
        }));
    };

    const handleSaveProfile = (event) => {
        event.preventDefault();
        const savedProfile = saveAIProfileMemory(profileForm, profileOwner);
        setAIProfileMemory(savedProfile);
        setProfileForm({ ...emptyProfileForm, ...savedProfile });
        setRefreshForm({
            weight: savedProfile?.weight ?? '',
            fitnessGoal: savedProfile?.fitnessGoal ?? '',
        });
        setShowProfileSetup(false);
        setShowRefreshPrompt(false);
        setMessages((current) => [
            ...current,
            {
                role: 'assistant',
                content: 'Готово, я запомнил профиль. Теперь можешь спрашивать про тренировки, питание, восстановление или план под твою цель.',
            },
        ]);
    };

    const handleSaveWeightRefresh = () => {
        const savedProfile = saveAIProfileMemory(refreshForm, profileOwner);
        setAIProfileMemory(savedProfile);
        setProfileForm({ ...emptyProfileForm, ...savedProfile });
        setShowRefreshPrompt(false);
    };

    const updateRefreshField = (field, value) => {
        setRefreshForm((current) => ({
            ...current,
            [field]: value,
        }));
    };

    const handleSkipProfileSetup = () => {
        setShowProfileSetup(false);
        setShowRefreshPrompt(false);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const text = input.trim();
        if (!text || isLoading) return;

        const nextMessages = [...messages, { role: 'user', content: text }];
        setMessages(nextMessages);
        setInput('');
        setIsLoading(true);

        try {
            const userContext = collectHeroFitAIContext({
                currentUser,
                userStats,
                challenges,
                sessions,
                selectedClient,
                assignedWorkouts,
                scheduleItems,
                aiProfileMemory,
            });
            const reply = await sendAIChat({ message: text, messages, userContext });
            setMessages([...nextMessages, { role: 'assistant', content: reply }]);
        } catch {
            setMessages([
                ...nextMessages,
                { role: 'assistant', content: 'AI assistant is unavailable right now.' },
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
                            <div
                                className={`max-w-[92%] overflow-hidden rounded-[20px] px-4 py-3 text-sm leading-relaxed shadow-sm ${
                                    message.role === 'user'
                                        ? 'bg-[#c1cf98] text-[#141712] sm:max-w-[78%]'
                                        : 'border border-white/10 bg-white/[0.06] text-[#f3e8dc]'
                                }`}
                            >
                                <MessageContent content={message.content} />
                            </div>
                        </div>
                    ))}

                    {showProfileSetup && (
                        <ProfileSetupForm
                            profileForm={profileForm}
                            onChange={updateProfileField}
                            onSave={handleSaveProfile}
                            onSkip={handleSkipProfileSetup}
                        />
                    )}

                    {!showProfileSetup && showRefreshPrompt && (
                        <WeightRefreshPrompt
                            form={refreshForm}
                            onChange={updateRefreshField}
                            onSave={handleSaveWeightRefresh}
                            onDismiss={() => setShowRefreshPrompt(false)}
                        />
                    )}

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

const MessageContent = ({ content = '' }) => {
    const lines = content.split('\n');

    return (
        <div className="space-y-2 break-words text-[15px] leading-7">
            {lines.map((line, index) => {
                const trimmed = line.trim();

                if (!trimmed) {
                    return <div key={`space-${index}`} className="h-1" />;
                }

                const bulletMatch = trimmed.match(/^[-*]\s+(.+)$/);
                const numberedMatch = trimmed.match(/^\d+\.\s+(.+)$/);

                if (bulletMatch || numberedMatch) {
                    return (
                        <div key={index} className="flex gap-2">
                            <span className="mt-[0.72em] h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-60" />
                            <span>{renderInlineMarkdown((bulletMatch ?? numberedMatch)[1])}</span>
                        </div>
                    );
                }

                return <p key={index}>{renderInlineMarkdown(trimmed)}</p>;
            })}
        </div>
    );
};

const renderInlineMarkdown = (text) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);

    return parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return (
                <strong key={index} className="font-bold text-inherit">
                    {part.slice(2, -2)}
                </strong>
            );
        }

        return <React.Fragment key={index}>{part}</React.Fragment>;
    });
};

const ProfileSetupForm = ({ profileForm, onChange, onSave, onSkip }) => (
    <form onSubmit={onSave} className="rounded-[22px] border border-[#c1cf98]/25 bg-[#c1cf98]/[0.07] p-4">
        <p className="text-sm font-bold text-[#f5efe7]">Профиль для AI coach</p>
        <p className="mt-1 text-xs leading-relaxed text-white/55">
            Эти данные сохранятся локально и будут подставляться в следующие рекомендации.
        </p>

        <div className="mt-4 grid grid-cols-2 gap-3">
            <ProfileInput
                label="Height cm"
                value={profileForm.height}
                onChange={(value) => onChange('height', value)}
                type="number"
            />
            <ProfileInput
                label="Weight kg"
                value={profileForm.weight}
                onChange={(value) => onChange('weight', value)}
                type="number"
            />
        </div>

        <div className="mt-3 grid gap-3">
            <ProfileInput
                label="Goal"
                value={profileForm.fitnessGoal}
                onChange={(value) => onChange('fitnessGoal', value)}
                placeholder="похудение, сила, выносливость..."
            />
            <ProfileInput
                label="Level"
                value={profileForm.trainingLevel}
                onChange={(value) => onChange('trainingLevel', value)}
                placeholder="beginner, intermediate..."
            />
            <ProfileInput
                label="Limitations"
                value={profileForm.limitations}
                onChange={(value) => onChange('limitations', value)}
                placeholder="травмы, ограничения, нет"
            />
        </div>

        <div className="mt-4 flex gap-2">
            <button
                type="submit"
                className="flex-1 rounded-full border border-[#c1cf98]/30 bg-[#c1cf98]/15 px-4 py-2 text-sm font-semibold text-[#eaf2cf] transition-all hover:bg-[#c1cf98]/25"
            >
                Save
            </button>
            <button
                type="button"
                onClick={onSkip}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/60 transition-all hover:bg-white/10"
            >
                Skip
            </button>
        </div>
    </form>
);

const WeightRefreshPrompt = ({ form, onChange, onSave, onDismiss }) => (
    <div className="rounded-[22px] border border-white/10 bg-white/[0.05] p-4">
        <p className="text-sm font-bold text-[#f5efe7]">Quick profile update</p>
        <p className="mt-1 text-xs leading-relaxed text-white/50">
            It has been about two weeks. Refresh your current weight and goal so advice stays personal.
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-[0.7fr_1fr_auto_auto]">
            <input
                value={form.weight}
                onChange={(event) => onChange('weight', event.target.value)}
                type="number"
                placeholder="Weight kg"
                className="min-w-0 flex-1 rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm text-white outline-none placeholder:text-white/35 focus:border-[#c1cf98]/50"
            />
            <input
                value={form.fitnessGoal}
                onChange={(event) => onChange('fitnessGoal', event.target.value)}
                placeholder="Current goal"
                className="min-w-0 flex-1 rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm text-white outline-none placeholder:text-white/35 focus:border-[#c1cf98]/50"
            />
            <button
                type="button"
                onClick={onSave}
                className="rounded-full border border-[#c1cf98]/30 bg-[#c1cf98]/15 px-4 py-2 text-sm font-semibold text-[#eaf2cf]"
            >
                Save
            </button>
            <button
                type="button"
                onClick={onDismiss}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/60"
            >
                Later
            </button>
        </div>
    </div>
);

const ProfileInput = ({ label, value, onChange, type = 'text', placeholder }) => (
    <label className="block">
        <span className="mb-1 block text-[11px] font-bold uppercase tracking-[0.14em] text-white/40">
            {label}
        </span>
        <input
            value={value ?? ''}
            onChange={(event) => onChange(event.target.value)}
            type={type}
            placeholder={placeholder}
            className="w-full rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none placeholder:text-white/30 focus:border-[#c1cf98]/50"
        />
    </label>
);

export default AIChat;
