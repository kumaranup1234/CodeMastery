
import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { Code2, Server, Terminal, ArrowRight, Trophy, Target, BookOpen, Bookmark, CheckCircle, Github, Twitter, Heart, Layers, Box, Leaf } from 'lucide-react';
import allQuestions from '../data/questions.json';

const techs = [
    {
        id: 'React',
        name: 'React',
        description: 'Frontend library for building UIs.',
        icon: Code2,
        color: 'from-indigo-500 to-blue-500'
    },
    {
        id: 'Spring Boot',
        name: 'Spring Boot',
        description: 'Production-ready Java apps.',
        icon: Leaf,
        color: 'from-emerald-500 to-green-500'
    },
    {
        id: 'JavaScript',
        name: 'JavaScript',
        description: 'The core language of the web.',
        icon: Terminal,
        color: 'from-amber-500 to-yellow-500'
    },
    {
        id: 'Java',
        name: 'Java',
        description: 'Robust backend engineering.',
        icon: Server,
        color: 'from-red-500 to-orange-500'
    },

    {
        id: 'Docker',
        name: 'Docker',
        description: 'Containerization & DevOps.',
        icon: Box,
        color: 'from-blue-400 to-cyan-400'
    }
];

const features = [
    { title: 'Live Tracking', desc: 'Real-time progress persistence across all devices.', icon: Target },
    { title: 'Deep Notes', desc: 'Markdown-rich study notes with code syntax highlighting.', icon: BookOpen },
    { title: 'Bookmarks', desc: 'Save critical questions for last-minute review.', icon: Bookmark }
];

// --- Components ---

const HeroTitle = () => (
    <div className="relative inline-block">
        <h1 className="text-6xl md:text-8xl font-black tracking-tight text-white mb-6 relative z-10 selection:bg-indigo-500/30">
            CodeMastery
        </h1>
        <div className="absolute -inset-2 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 blur-3xl opacity-20 rounded-full pointer-events-none" />
    </div>
);

// Simplified Spotlight Card for reliability
const SpotlightCard = ({ tech, stats, onClick }) => {
    return (
        <button
            onClick={onClick}
            className="group relative w-full h-full bg-gray-900/40 rounded-3xl border border-white/10 p-8 overflow-hidden hover:border-white/20 transition-all duration-500 text-left hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1"
        >
            {/* Spotlight Gradient Background on Hover */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br ${tech.color}`} />

            <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                    <div className={`w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300 shadow-xl`}>
                        <tech.icon size={28} />
                    </div>
                    {stats.percent > 0 && (
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 text-xs font-bold shadow-[0_0_10px_rgba(34,197,94,0.2)]">
                            <CheckCircle size={12} />
                            <span>{stats.percent}%</span>
                        </div>
                    )}
                </div>

                <h3 className="text-2xl font-bold text-white mb-2">{tech.name}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-auto">{tech.description}</p>

                <div className="mt-8">
                    <div className="flex justify-between text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">
                        <span>Progress</span>
                        <span>{stats.read}/{stats.total}</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${stats.percent}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className={`h-full bg-gradient-to-r ${tech.color}`}
                        />
                    </div>

                    <div className="mt-6 flex items-center text-sm font-semibold text-white/40 group-hover:text-white transition-colors">
                        <span>Enter Vault</span>
                        <ArrowRight size={16} className="ml-auto group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>
            </div>
        </button>
    );
};

const FeatureCard = ({ feature, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ y: -5 }}
        className="relative p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all duration-300 group"
    >
        <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 group-hover:bg-indigo-500/30 group-hover:text-indigo-300 transition-colors">
            <feature.icon size={24} />
        </div>
        <h4 className="text-lg font-bold text-white mb-2">{feature.title}</h4>
        <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
    </motion.div>
);

const Footer = () => (
    <footer className="border-t border-white/10 bg-black/20 backdrop-blur-lg mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white">
                        <Terminal size={16} />
                    </div>
                    <span className="font-bold text-xl text-white tracking-tight">CodeMastery</span>
                </div>

                <div className="flex gap-6">
                    <a href="#" className="text-gray-400 hover:text-white transition-colors"><Github size={20} /></a>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors"><Twitter size={20} /></a>
                </div>
            </div>

            <div className="mt-8 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                <p>&copy; 2026 CodeMastery Inc. All rights reserved.</p>
                <div className="flex items-center gap-1 mt-4 md:mt-0">
                    <span>Made with</span>
                    <Heart size={12} className="text-red-500 fill-red-500" />
                    <span>for developers.</span>
                </div>
            </div>
        </div>
    </footer>
);

const TechSelection = () => {
    const { setActiveTech, readQuestions } = useApp();
    const navigate = useNavigate();

    const getTechStats = (techId) => {
        const techQuestions = allQuestions.filter(q => q.technology === techId);
        const total = techQuestions.length;
        const readCount = techQuestions.filter(q => readQuestions.includes(q.id)).length;
        const percent = total === 0 ? 0 : Math.round((readCount / total) * 100);
        return { total, read: readCount, percent };
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col relative overflow-x-hidden selection:bg-indigo-500/30 font-sans">

            {/* Background Grid & Mesh */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay fixed"></div>
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none fixed"></div>

            {/* Animated Blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px] animate-pulse pointer-events-none fixed" />
            <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none fixed" />

            <div className="max-w-7xl mx-auto w-full relative z-10 px-6 pt-24 flex-grow">

                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-300 text-xs font-semibold mb-8 backdrop-blur-xl shadow-xl hover:bg-white/10 transition-colors cursor-default"
                    >
                        <Trophy size={14} className="text-yellow-500" />
                        <span>Ranked #1 Dev Prep Tool</span>
                    </motion.div>

                    <HeroTitle />

                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-gray-400 leading-relaxed font-light"
                    >
                        The ultimate interactive vault for engineering interviews. <br className="hidden md:block" />
                        <span className="text-white font-medium">Select your stack</span> to begin your mastery journey.
                    </motion.p>
                </div>

                {/* Tech Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
                    {techs.map((tech, index) => (
                        <motion.div
                            key={tech.id}
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + index * 0.1 }}
                        >
                            <SpotlightCard
                                tech={tech}
                                stats={getTechStats(tech.id)}
                                onClick={() => { setActiveTech(tech.id); navigate('/dashboard'); }}
                            />
                        </motion.div>
                    ))}
                </div>

                {/* Modern Feature Grid */}
                <div className="mb-24">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-white mb-4">Everything you need to ace it</h2>
                        <p className="text-gray-400">Built by engineers, for engineers.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {features.map((feat, i) => (
                            <FeatureCard key={i} feature={feat} index={i} />
                        ))}
                    </div>
                </div>

            </div>

            <Footer />
        </div>
    );
};

export default TechSelection;
