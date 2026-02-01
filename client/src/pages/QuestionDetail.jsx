
import React, { useMemo, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { ArrowLeft, CheckCircle, Bookmark, ArrowRight, Share2, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import clsx from 'clsx';
import CodeWindow from '../components/CodeWindow';
import { motion } from 'framer-motion';

const QuestionDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { questions, markAsRead, readQuestions, bookmarks, toggleBookmark } = useApp();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const questionIndex = useMemo(() => questions.findIndex(q => q.id === id), [questions, id]);
    const question = questions[questionIndex];

    if (!question) return null; // Or loading state

    const isRead = readQuestions.includes(id);
    const isBookmarked = bookmarks.includes(id);
    const hasNext = questionIndex < questions.length - 1;
    const hasPrev = questionIndex > 0;

    const handleNext = () => hasNext && navigate(`/question/${questions[questionIndex + 1].id}`);
    const handlePrev = () => hasPrev && navigate(`/question/${questions[questionIndex - 1].id}`);

    const cleanContent = useMemo(() => {
        if (!question.answer) return '';
        return question.answer.split('\n').map(l => l.replace(/^\s{4}/, '')).join('\n');
    }, [question.answer]);

    // Ultra-Premium Markdown Renderer
    const components = {
        code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');

            // Safe text extraction
            const extractText = (content) => {
                if (typeof content === 'string') return content;
                if (Array.isArray(content)) return content.map(extractText).join('');
                if (typeof content === 'object' && content && content.props && content.props.children) {
                    return extractText(content.props.children);
                }
                return String(content || '');
            };

            const codeContent = extractText(children).replace(/\n$/, '');

            if (!inline && match) return <CodeWindow code={codeContent} language={match[1]} />;

            if (!inline) {
                if (codeContent.includes('\n') || codeContent.length > 50) {
                    return <CodeWindow code={codeContent} language="text" />;
                }
            }

            // Subtle, pill-like inline code
            return (
                <code className="px-1.5 py-0.5 mx-0.5 rounded-md bg-gray-100 dark:bg-gray-800 font-mono text-[0.9em] font-medium text-gray-800 dark:text-gray-200" {...props}>
                    {children}
                </code>
            );
        },
        h1: ({ children }) => <h1 className="text-4xl md:text-5xl font-bold mt-16 mb-8 text-gray-900 dark:text-white tracking-tight">{children}</h1>,
        h2: ({ children }) => <h2 className="text-2xl md:text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white">{children}</h2>,
        h3: ({ children }) => <h3 className="text-xl md:text-2xl font-semibold mt-10 mb-4 text-gray-900 dark:text-white">{children}</h3>,
        p: ({ children }) => <p className="mb-6 leading-8 text-lg md:text-xl text-gray-600 dark:text-gray-300 font-normal">{children}</p>,
        ul: ({ children }) => <ul className="list-disc pl-5 mb-8 space-y-3 marker:text-gray-400 text-lg text-gray-600 dark:text-gray-300">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal pl-5 mb-8 space-y-3 marker:text-gray-400 text-lg text-gray-600 dark:text-gray-300">{children}</ol>,
        li: ({ children }) => <li className="pl-2">{children}</li>,
        blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-gray-900 dark:border-white pl-6 italic my-10 text-xl text-gray-800 dark:text-gray-200 font-medium">
                {children}
            </blockquote>
        ),
        a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" className="text-gray-900 dark:text-white font-semibold underline decoration-gray-300 hover:decoration-gray-900 dark:decoration-gray-600 dark:hover:decoration-white transition-all underline-offset-4">
                {children}
            </a>
        ),
        details: ({ children }) => {
            const childrenArray = React.Children.toArray(children);
            const summary = childrenArray.find(child => child.type === 'summary' || child.props?.node?.tagName === 'summary');
            const content = childrenArray.filter(child => child !== summary);

            return (
                <details className="group my-8 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden bg-gray-50/50 dark:bg-gray-900/50 open:bg-white dark:open:bg-[#0d1117] transition-all duration-300 shadow-sm open:shadow-md">
                    {summary}
                    <div className="px-6 pb-6 pt-2 text-gray-700 dark:text-gray-300">
                        {content}
                    </div>
                </details>
            );
        },
        summary: ({ children }) => (
            <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer px-6 py-4 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors list-none flex items-center justify-between select-none group-active:scale-[0.99] transition-transform">
                <span className="flex items-center gap-3 text-lg font-display tracking-tight text-indigo-700 dark:text-indigo-400">
                    <MessageCircle size={20} className="stroke-[2.5]" />
                    {children}
                </span>
                <ChevronRight className="w-5 h-5 transition-transform duration-300 group-open:rotate-90 text-gray-400 group-open:text-indigo-500" strokeWidth={2.5} />
            </summary>
        ),
    };

    return (
        <div className="min-h-screen bg-white dark:bg-[#090c10]">
            {/* Minimal Sticky Nav */}
            <motion.nav
                className={clsx(
                    "sticky top-0 z-40 w-full transition-all duration-300 border-b",
                    scrolled ? "bg-white/80 dark:bg-[#090c10]/80 backdrop-blur-md border-gray-200 dark:border-gray-800 py-4" : "bg-transparent border-transparent py-6"
                )}
            >
                <div className="max-w-screen-xl mx-auto px-6 md:px-12 flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                    >
                        <ArrowLeft size={18} />
                        <span className="hidden md:inline">Back</span>
                    </button>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => toggleBookmark(id)}
                            className={clsx(
                                "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                                isBookmarked ? "bg-gray-900 text-white dark:bg-white dark:text-black" : "bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
                            )}
                        >
                            <Bookmark size={18} fill={isBookmarked ? "currentColor" : "none"} />
                        </button>
                        <button
                            onClick={() => markAsRead(id)}
                            className={clsx(
                                "flex items-center gap-2 px-6 py-2.5 rounded-full font-medium transition-all text-sm",
                                isRead
                                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                    : "bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                            )}
                        >
                            {isRead ? <CheckCircle size={18} /> : null}
                            <span>{isRead ? 'Mastered' : 'Mark Complete'}</span>
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* Reading Container - Centered, Narrower focus, Huge Padding */}
            <main className="max-w-4xl mx-auto px-6 md:px-16 pt-8 pb-32">

                {/* Header */}
                <header className="mb-16">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="font-mono text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                            {question.category}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
                        <span className="font-mono text-xs text-gray-400 dark:text-gray-500">
                            #{String(questionIndex + 1).padStart(3, '0')}
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 dark:text-white tracking-tighter leading-[1.1]">
                        {question.title}
                    </h1>
                </header>

                {/* Content - Borderless, purely typographical */}
                <article className="prose prose-xl dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
                    <ReactMarkdown rehypePlugins={[rehypeRaw]} components={components}>
                        {cleanContent}
                    </ReactMarkdown>
                </article>

                {/* Footer Navigation */}
                <div className="mt-32 pt-12 border-t border-gray-100 dark:border-gray-800 grid grid-cols-2 gap-4">
                    {hasPrev ? (
                        <button onClick={handlePrev} className="group text-left p-4 -ml-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                            <span className="text-sm text-gray-400 font-medium mb-1 block group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">Previous</span>
                            <span className="text-lg font-bold text-gray-900 dark:text-white block">{questions[questionIndex - 1].title}</span>
                        </button>
                    ) : <div />}

                    {hasNext && (
                        <button onClick={handleNext} className="group text-right p-4 -mr-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                            <span className="text-sm text-gray-400 font-medium mb-1 block group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">Next</span>
                            <span className="text-lg font-bold text-gray-900 dark:text-white block">{questions[questionIndex + 1].title}</span>
                        </button>
                    )}
                </div>
            </main>
        </div>
    );
};

export default QuestionDetail;
