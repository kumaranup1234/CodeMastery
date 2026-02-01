
import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Search, Check, Bookmark, ArrowRight, Hash } from 'lucide-react';
import clsx from 'clsx';
import { List } from 'react-window';
import AutoSizer from '../components/SimpleAutoSizer';

const QuestionRow = ({ index, style, data }) => {
    const { questions, readQuestions, bookmarks } = data;
    const q = questions[index];
    const isRead = readQuestions.includes(q.id);
    const isBookmarked = bookmarks.includes(q.id);

    return (
        <div style={{ ...style }}>
            <Link
                to={`/question/${q.id}`}
                className="group block h-full px-6 md:px-8 py-4 border-b border-gray-100 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-[#0d1117] transition-all duration-200"
            >
                <div className="flex items-baseline gap-4 h-full">
                    {/* ID - Subtle */}
                    <span className="flex-shrink-0 font-mono text-xs text-gray-300 dark:text-gray-600 w-8">
                        #{String(index + 1).padStart(3, '0')}
                    </span>

                    <div className="flex-1 min-w-0 flex flex-col justify-center h-full">
                        <div className="flex items-center gap-3 mb-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                                {q.category}
                            </span>
                            {isRead && (
                                <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-green-600 dark:text-green-500/80">
                                    <Check size={10} strokeWidth={3} /> Mastered
                                </span>
                            )}
                            {isBookmarked && (
                                <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-600">
                                    <Bookmark size={10} fill="currentColor" /> Saved
                                </span>
                            )}
                        </div>

                        <h3 className={clsx(
                            "text-lg md:text-xl font-bold leading-tight transition-colors pr-8 truncate",
                            isRead ? "text-gray-500 dark:text-gray-500" : "text-gray-900 dark:text-white group-hover:text-black dark:group-hover:text-white"
                        )}>
                            {q.title}
                        </h3>
                    </div>

                    {/* Arrow - appearing on hover */}
                    <div className="flex-shrink-0 self-center opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-gray-400 dark:text-gray-500">
                        <ArrowRight size={20} className="stroke-[1.5]" />
                    </div>
                </div>
            </Link>
        </div>
    );
};

const QuestionList = () => {
    const { category } = useParams();
    const { questions, readQuestions, bookmarks, toggleBookmark } = useApp();
    const [search, setSearch] = useState('');

    const decodedCategory = category ? decodeURIComponent(category) : 'All Questions';

    // Filter questions
    const filteredQuestions = useMemo(() => {
        let qs = questions;
        if (category && category !== 'All') {
            qs = qs.filter(q => q.category === decodedCategory);
        }
        if (search.trim()) {
            const lowerSearch = search.toLowerCase();
            qs = qs.filter(q =>
                q.title.toLowerCase().includes(lowerSearch) ||
                q.answer.toLowerCase().includes(lowerSearch)
            );
        }
        return qs;
    }, [questions, decodedCategory, category, search]);

    return (
        <div className="h-screen flex flex-col bg-white dark:bg-[#090c10] max-w-5xl mx-auto w-full">
            {/* Header Section - Clean & Minimal */}
            <div className="flex-shrink-0 pt-10 pb-6 px-6 md:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
                            {decodedCategory}
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base max-w-lg leading-relaxed">
                            {filteredQuestions.length} interview questions curated to help you master React concepts.
                        </p>
                    </div>

                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-300 dark:text-gray-600" size={20} />
                        <input
                            type="text"
                            placeholder="Filter questions..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-8 pr-4 py-2 bg-transparent border-b border-gray-200 dark:border-gray-800 text-base text-gray-900 dark:text-white focus:border-gray-900 dark:focus:border-white outline-none transition-all placeholder:text-gray-300 dark:placeholder:text-gray-700 font-medium"
                        />
                    </div>
                </div>
            </div>

            {/* List Section - Borderless & Spacious */}
            <div className="flex-1 min-h-0">
                {filteredQuestions.length > 0 ? (
                    <AutoSizer>
                        {({ height, width }) => (
                            <List
                                height={height}
                                rowCount={filteredQuestions.length}
                                rowHeight={100} // Spacious rows
                                width={width}
                                rowComponent={QuestionRow}
                                rowProps={{
                                    data: {
                                        questions: filteredQuestions,
                                        readQuestions,
                                        bookmarks,
                                        toggleBookmark
                                    }
                                }}
                                className="custom-scrollbar"
                            />
                        )}
                    </AutoSizer>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 text-gray-400 dark:text-gray-600">
                        <Search size={48} className="mb-4 opacity-20" />
                        <p className="text-lg font-medium">No matches found</p>
                        <button onClick={() => setSearch('')} className="mt-2 text-sm underline hover:text-gray-900 dark:hover:text-white transition-colors">
                            Clear filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuestionList;
