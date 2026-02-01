
import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Trash2, Link as LinkIcon, ExternalLink, Type, FolderOpen } from 'lucide-react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

const Notes = () => {
    const { notes, addNote, deleteNote } = useApp();
    const [isFormOpen, setIsFormOpen] = useState(false);

    // Form state
    const [title, setTitle] = useState('');
    const [link, setLink] = useState('');
    const [category, setCategory] = useState('React');
    const [description, setDescription] = useState('');

    const categories = ['React', 'CSS', 'JavaScript', 'General', 'Interview', 'System Design'];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        addNote({
            title,
            link,
            category,
            description
        });

        // Reset
        setTitle('');
        setLink('');
        setDescription('');
        setIsFormOpen(false);
    };

    const groupedNotes = useMemo(() => {
        const groups = {};
        notes.forEach(note => {
            if (!groups[note.category]) groups[note.category] = [];
            groups[note.category].push(note);
        });
        return groups;
    }, [notes]);

    return (
        <div className="max-w-5xl mx-auto space-y-8 min-h-screen pb-20">
            {/* Header */}
            <div className="flex items-end justify-between border-b border-gray-200 dark:border-gray-800 pb-6 pt-10 px-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        My Resources
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">
                        Collect helpful links, docs, and notes for your preparation.
                    </p>
                </div>
                <button
                    onClick={() => setIsFormOpen(!isFormOpen)}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
                >
                    <Plus size={20} />
                    Add Resource
                </button>
            </div>

            {/* Add Note Form */}
            <AnimatePresence>
                {isFormOpen && (
                    <motion.form
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        onSubmit={handleSubmit}
                        className="overflow-hidden px-6"
                    >
                        <div className="bg-white dark:bg-[#161b22] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-xl mb-8 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Title</label>
                                    <div className="relative">
                                        <Type className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                        <input
                                            type="text"
                                            required
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            placeholder="e.g., React Docs on Hooks"
                                            className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-[#0d1117] rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Category</label>
                                    <div className="relative">
                                        <FolderOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                        <select
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-[#0d1117] rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none appearance-none"
                                        >
                                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Link (Optional)</label>
                                <div className="relative">
                                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        type="url"
                                        value={link}
                                        onChange={(e) => setLink(e.target.value)}
                                        placeholder="https://..."
                                        className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-[#0d1117] rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Description (Optional)</label>
                                <textarea
                                    rows={2}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Brief note about this resource..."
                                    className="w-full px-4 py-2 bg-gray-50 dark:bg-[#0d1117] rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsFormOpen(false)}
                                    className="px-4 py-2 text-gray-500 hover:text-gray-900 dark:hover:text-white font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-gray-900 dark:bg-white text-white dark:text-black px-6 py-2 rounded-lg font-bold hover:opacity-90 transition-opacity"
                                >
                                    Save Resource
                                </button>
                            </div>
                        </div>
                    </motion.form>
                )}
            </AnimatePresence>

            {/* List */}
            <div className="px-6 space-y-10">
                {Object.entries(groupedNotes).length > 0 ? (
                    Object.entries(groupedNotes).map(([cat, items]) => (
                        <div key={cat}>
                            <h3 className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white mb-4">
                                <span className="w-2 h-6 bg-indigo-500 rounded-full" />
                                {cat}
                                <span className="text-sm font-medium text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">{items.length}</span>
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {items.map(note => (
                                    <div key={note.id} className="group relative bg-white dark:bg-[#0d1117] border border-gray-200 dark:border-gray-800 p-5 rounded-2xl hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-lg transition-all duration-300 flex flex-col h-full">
                                        <div className="flex-1 mb-4">
                                            <h4 className="font-bold text-lg text-gray-900 dark:text-white leading-tight mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                {note.title}
                                            </h4>
                                            {note.description && (
                                                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed line-clamp-3">
                                                    {note.description}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800/50 mt-auto">
                                            <div className="flex items-center gap-2">
                                                {note.link && (
                                                    <a
                                                        href={note.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-2.5 py-1 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors"
                                                    >
                                                        Visit <ExternalLink size={10} />
                                                    </a>
                                                )}
                                                <span className="text-[10px] text-gray-400 font-medium">
                                                    {new Date(note.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>

                                            <button
                                                onClick={() => deleteNote(note.id)}
                                                className="text-gray-300 hover:text-red-500 transition-colors p-1"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 bg-gray-50 dark:bg-[#0d1117]/50 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
                        <FolderOpen size={48} className="mx-auto text-gray-300 dark:text-gray-700 mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">No resources yet</h3>
                        <p className="text-gray-500 mt-2 max-w-sm mx-auto">
                            Add links to documentation, articles, or your own notes to build a personal knowledge base.
                        </p>
                        <button
                            onClick={() => setIsFormOpen(true)}
                            className="mt-6 text-indigo-600 font-semibold hover:underline"
                        >
                            Create your first resource
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notes;
