import React, { useState, useEffect } from 'react';
import { FiActivity, FiPlus, FiTrash2, FiEdit2, FiCheck, FiX } from 'react-icons/fi';
import {
    fetchTrainingCategories,
    createTrainingCategory,
    updateTrainingCategory,
    deleteTrainingCategory
} from '../../utils/adminApi.js';

const AdminCategoriesView = () => {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [feedback, setFeedback] = useState('');
    const [error, setError] = useState('');

    const [form, setForm] = useState({ name: '', defaultPoints: 50, defaultExercises: [] });
    const [editingId, setEditingId] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const loadCategories = async () => {
        try {
            const data = await fetchTrainingCategories();
            setCategories(data);
        } catch (err) {
            setError('Could not load training categories.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    const handleAddExerciseRow = () => {
        setForm(prev => ({
            ...prev,
            defaultExercises: [...prev.defaultExercises, { name: '', planned: 10 }]
        }));
    };

    const handleUpdateExerciseRow = (index, field, value) => {
        setForm(prev => {
            const updatedRows = [...prev.defaultExercises];
            updatedRows[index][field] = field === 'planned' ? Number(value) : value;
            return { ...prev, defaultExercises: updatedRows };
        });
    };

    const handleRemoveExerciseRow = (index) => {
        setForm(prev => ({
            ...prev,
            defaultExercises: prev.defaultExercises.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setFeedback('');
        setError('');

        const validExercises = form.defaultExercises.filter(ex => ex.name.trim() !== '');

        const payload = {
            name: form.name.toUpperCase().trim(),
            defaultPoints: Number(form.defaultPoints),
            defaultExercises: validExercises
        };

        try {
            if (editingId) {
                await updateTrainingCategory(editingId, payload);
                setFeedback('Category updated successfully.');
            } else {
                await createTrainingCategory(payload);
                setFeedback('New training category published.');
            }
            setForm({ name: '', defaultPoints: 50, defaultExercises: [] });
            setEditingId(null);
            await loadCategories();
        } catch (err) {
            setError(err.response?.data?.message || 'Action failed.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (category) => {
        setEditingId(category.id);
        setForm({
            name: category.name,
            defaultPoints: category.defaultPoints,
            defaultExercises: category.defaultExercises || []
        });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setForm({ name: '', defaultPoints: 50, defaultExercises: [] });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this category? Legacy workout points will remain safe.')) {
            try {
                await deleteTrainingCategory(id);
                await loadCategories();
            } catch (err) {
                setError('Could not delete category.');
            }
        }
    };

    return (
        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            <section className="rounded-[30px] border border-white/10 bg-[rgba(18,20,24,0.74)] p-5 shadow-[0_18px_45px_rgba(0,0,0,0.2)] h-fit">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-white/38">
                    {editingId ? 'Modify Mode' : 'Admin Action'}
                </p>
                <h2 className="mb-5 mt-1 text-xl font-black text-[#f5efe7] md:text-2xl">
                    {editingId ? 'Edit Workout Category' : 'Add Workout Category'}
                </h2>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <label className="block">
                        <span className="mb-1 block text-xs font-bold uppercase tracking-[0.16em] text-white/45">System Key Name</span>
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            required
                            placeholder="e.g. STRENGTH, YOGA, CARDIO"
                            className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none focus:border-[#c1cf98]/40 placeholder:text-white/20"
                        />
                    </label>

                    <label className="block">
                        <span className="mb-1 block text-xs font-bold uppercase tracking-[0.16em] text-white/45">Base XP Points</span>
                        <input
                            type="number"
                            value={form.defaultPoints}
                            onChange={(e) => setForm({ ...form, defaultPoints: e.target.value })}
                            required
                            min="0"
                            className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none focus:border-[#c1cf98]/40"
                        />
                    </label>

                    {/* Блок добавления дефолтных упражнений */}
                    <div className="block pt-2">
                        <span className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-white/45">Default Exercises Template</span>
                        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-3 space-y-2">
                            {form.defaultExercises.map((ex, idx) => (
                                <div key={idx} className="flex items-center gap-2 rounded-xl border border-white/5 bg-black/20 p-2">
                                    <input
                                        type="text"
                                        value={ex.name}
                                        onChange={(e) => handleUpdateExerciseRow(idx, 'name', e.target.value)}
                                        placeholder="Exercise name (e.g. Push-ups)"
                                        required
                                        className="flex-1 bg-transparent border-none text-white text-xs outline-none"
                                    />
                                    <input
                                        type="number"
                                        value={ex.planned}
                                        onChange={(e) => handleUpdateExerciseRow(idx, 'planned', e.target.value)}
                                        min="1"
                                        required
                                        className="w-16 bg-white/10 rounded-lg py-1 text-center text-xs text-[#c1cf98] outline-none"
                                        title="Planned reps or seconds"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveExerciseRow(idx)}
                                        className="text-white/30 hover:text-red-400 transition-colors p-1"
                                    >
                                        <FiTrash2 size={14} />
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={handleAddExerciseRow}
                                className="flex items-center gap-1.5 text-[11px] font-bold text-[#c1cf98] hover:opacity-80 transition-opacity pt-1 pl-1"
                            >
                                <FiPlus size={14} /> ADD DEFAULT EXERCISE
                            </button>
                        </div>
                    </div>

                    {feedback && <p className="text-sm font-bold text-[#dfe9bf]">{feedback}</p>}
                    {error && <div className="rounded-xl border border-red-300/25 bg-red-400/10 p-3 text-xs text-red-100">{error}</div>}

                    <div className="flex gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#c1cf98] px-5 py-3 text-sm font-black text-[#111412] disabled:opacity-60 transition-all active:scale-[0.98]"
                        >
                            {editingId ? <FiCheck /> : <FiPlus />}
                            {submitting ? 'Processing...' : editingId ? 'Save changes' : 'Create category'}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                onClick={handleCancelEdit}
                                className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-bold text-white/70"
                            >
                                <FiX size={16} />
                            </button>
                        )}
                    </div>
                </form>
            </section>

            <section className="rounded-[30px] border border-white/10 bg-[rgba(18,20,24,0.74)] p-5 shadow-[0_18px_45px_rgba(0,0,0,0.2)]">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-white/38">Configured Types</p>
                <h2 className="mb-5 mt-1 text-xl font-black text-[#f5efe7] md:text-2xl">Point Allocations</h2>

                {isLoading ? (
                    <div className="rounded-2xl border border-dashed border-white/10 px-5 py-8 text-center text-sm text-white/45">Loading rules...</div>
                ) : categories.length ? (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[400px] border-separate border-spacing-y-2">
                            <thead>
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-black uppercase tracking-[0.16em] text-white/35">Category Key</th>
                                <th className="px-4 py-2 text-left text-xs font-black uppercase tracking-[0.16em] text-white/35">Default XP</th>
                                <th className="px-4 py-2 text-right text-xs font-black uppercase tracking-[0.16em] text-white/35">Actions</th>
                            </tr>
                            </thead>
                        </table>
                        <div className="space-y-2">
                            {categories.map((cat) => (
                                <div key={cat.id} className="flex flex-col bg-white/[0.04] rounded-2xl border border-white/10 px-4 py-3.5 hover:border-white/20 transition-all gap-2">
                                    <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#c1cf98]/10 text-[#c1cf98]">
                                                <FiActivity size={16} />
                                            </div>
                                            <div>
                                                <p className="font-black text-[#f5efe7] text-sm tracking-wide">{cat.name}</p>
                                                <p className="text-[10px] uppercase font-bold tracking-wider text-white/30 md:hidden">
                                                    Points: {cat.defaultPoints}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="hidden md:block text-sm font-black text-[#dfe9bf]">
                                            {cat.defaultPoints} <span className="text-xs text-white/35 font-normal">XP</span>
                                        </div>

                                        <div className="flex items-center gap-1.5">
                                            <button
                                                onClick={() => handleEdit(cat)}
                                                className="p-2 rounded-xl bg-white/[0.02] border border-white/5 text-white/60 hover:text-[#c1cf98] hover:border-[#c1cf98]/20 transition-colors"
                                                title="Edit category"
                                            >
                                                <FiEdit2 size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(cat.id)}
                                                className="p-2 rounded-xl bg-white/[0.02] border border-white/5 text-white/40 hover:text-red-400 hover:border-red-500/20 transition-colors"
                                                title="Delete category"
                                            >
                                                <FiTrash2 size={14} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Показываем мини-список упражнений под категорией для наглядности админу */}
                                    {cat.defaultExercises && cat.defaultExercises.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 pt-1 border-t border-white/5 mt-1">
                                            {cat.defaultExercises.map((ex, i) => (
                                                <span key={i} className="text-[10px] bg-white/[0.05] text-white/60 px-2 py-0.5 rounded-md border border-white/5">
                                                    {ex.name} ({ex.planned})
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="rounded-2xl border border-dashed border-white/10 px-5 py-8 text-center text-sm text-white/45">
                        No active dynamic rules. System relies on core hardcoded values.
                    </div>
                )}
            </section>
        </div>
    );
};

export default AdminCategoriesView;