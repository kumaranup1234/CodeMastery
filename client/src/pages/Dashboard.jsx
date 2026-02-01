
import React from 'react';
import { useApp } from '../context/AppContext';
// import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'; // Removed unused import
// Actually, let's use simple SVGs for progress to keep it lightweight as requested by "beautiful UI" without too many heavy deps unless needed.
import { BookOpen, CheckCircle, Bookmark, ArrowRight, Trophy, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { getStats, questions, readQuestions } = useApp();
    const stats = getStats();

    // Calculate next question to recommend (first unread)
    const nextQuestion = questions.find(q => !readQuestions.includes(q.id)) || questions[0];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome Back!</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Track your progress and master React interview questions.</p>
                </div>
                {readQuestions.length > 0 && (
                    <div className="flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-4 py-2 rounded-full font-medium text-sm">
                        <Trophy size={16} />
                        <span>{stats.read} Questions Mastered</span>
                    </div>
                )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Progress</p>
                            <h3 className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">{stats.progress}%</h3>
                        </div>
                        <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-400">
                            <Zap size={24} />
                        </div>
                    </div>
                    <div className="mt-4 w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                        <div
                            className="bg-indigo-600 h-2 rounded-full transition-all duration-1000"
                            style={{ width: `${stats.progress}%` }}
                        />
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between hover:shadow-md transition-shadow">
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Bookmarked</p>
                        <h3 className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">{stats.bookmarked}</h3>
                        <Link to="/bookmarks" className="text-sm text-indigo-600 dark:text-indigo-400 mt-2 inline-block hover:underline">View saved</Link>
                    </div>
                    <div className="p-3 bg-pink-50 dark:bg-pink-900/30 rounded-xl text-pink-600 dark:text-pink-400">
                        <Bookmark size={24} />
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between hover:shadow-md transition-shadow">
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Remaining</p>
                        <h3 className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">{stats.total - stats.read}</h3>
                        <p className="text-xs text-gray-400 mt-2">out of {stats.total} questions</p>
                    </div>
                    <div className="p-3 bg-orange-50 dark:bg-orange-900/30 rounded-xl text-orange-600 dark:text-orange-400">
                        <BookOpen size={24} />
                    </div>
                </div>
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-lg">
                <div className="relative z-10 max-w-2xl">
                    <h2 className="text-2xl font-bold mb-2">Ready to continue?</h2>
                    <p className="text-indigo-100 mb-6 text-lg">
                        Pick up where you left off. The next question is waiting for you.
                    </p>
                    {nextQuestion && (
                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 mb-6 border border-white/20">
                            <span className="text-indigo-200 text-xs font-semibold uppercase tracking-wider">{nextQuestion.category}</span>
                            <h3 className="font-semibold text-xl mt-1">{nextQuestion.title}</h3>
                        </div>
                    )}

                    <Link
                        to={`/question/${nextQuestion?.id}`}
                        className="inline-flex items-center gap-2 bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors shadow-lg"
                    >
                        Continue Learning <ArrowRight size={20} />
                    </Link>
                </div>

                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-60 h-60 bg-purple-500/30 rounded-full blur-3xl"></div>
            </div>
        </div>
    );
};

export default Dashboard;
