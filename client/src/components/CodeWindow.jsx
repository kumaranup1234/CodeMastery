
import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Check, Copy } from 'lucide-react';
import { motion } from 'framer-motion';

const CodeWindow = ({ code, language = 'javascript' }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl overflow-hidden bg-[#1e2127] my-8 border border-[#2e323a] shadow-sm"
        >
            {/* Minimal Pro Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-[#16181d] border-b border-[#2e323a]">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <span className="text-gray-600">#</span>
                    <span>{language}</span>
                </div>

                <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-300 transition-colors"
                >
                    {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                    {copied ? 'Copied' : 'Copy'}
                </button>
            </div>

            {/* Code Content - Increased Padding */}
            <div className="text-base font-mono overflow-auto custom-scrollbar">
                <SyntaxHighlighter
                    language={language}
                    style={atomDark}
                    customStyle={{
                        margin: 0,
                        padding: '1.5rem', // Generous padding
                        background: 'transparent',
                        fontSize: '15px', // Readable size
                        lineHeight: '1.6',
                    }}
                    showLineNumbers={true}
                    lineNumberStyle={{ minWidth: '3em', paddingRight: '1.5em', color: '#4b5263', textAlign: 'right' }}
                >
                    {code}
                </SyntaxHighlighter>
            </div>
        </motion.div>
    );
};

export default CodeWindow;
