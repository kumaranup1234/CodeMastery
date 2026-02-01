
import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import allQuestionsData from '../data/questions.json';
import { useAuth } from './AuthContext'; // Import Auth
import * as api from '../services/api';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const { user } = useAuth(); // Get user from AuthContext

    // 1. Tech State (Persisted)
    const [activeTech, setActiveTech] = useState(() => {
        return localStorage.getItem('activeTech') || 'React';
    });

    // 2. Filter questions based on activeTech
    const questions = useMemo(() => {
        return allQuestionsData.filter(q => q.technology === activeTech);
    }, [activeTech]);

    const [readQuestions, setReadQuestions] = useState(() => {
        const saved = localStorage.getItem('readQuestions');
        return saved ? JSON.parse(saved) : [];
    });
    const [bookmarks, setBookmarks] = useState(() => {
        const saved = localStorage.getItem('bookmarks');
        return saved ? JSON.parse(saved) : [];
    });

    // Notes Feature
    const [notes, setNotes] = useState(() => {
        const saved = localStorage.getItem('notes');
        return saved ? JSON.parse(saved) : [];
    });

    // --- Cloud Sync Logic ---

    // Load from Cloud on Login
    useEffect(() => {
        if (user) {
            // If user has progress, load it
            if (user.progress && user.progress[activeTech]) {
                 // Merge cloud data with local? For now, let's prefer Cloud if exists
                 // Or simple override
                 const techProgress = user.progress[activeTech];
                 if (techProgress.read) setReadQuestions(prev => [...new Set([...prev, ...techProgress.read])]); 
                 if (techProgress.bookmarks) setBookmarks(prev => [...new Set([...prev, ...techProgress.bookmarks])]);
            }
            if (user.notes && user.notes.length > 0) {
                 // Merge notes
                 setNotes(prev => {
                     const ids = new Set(prev.map(n => n.id));
                     const newNotes = user.notes.filter(n => !ids.has(n.id));
                     return [...prev, ...newNotes];
                 });
            }
        }
    }, [user, activeTech]);

    // Push to Cloud on Change (Debounced ideally, but simple effect for now)
    useEffect(() => {
        if (user) {
            const progressData = {
                [activeTech]: {
                    read: readQuestions,
                    bookmarks: bookmarks
                }
            };
            
            // We sync everything for simpler logic, backend handles merge
            api.syncProgress({ progress: progressData, notes: notes })
                .catch(err => console.error("Sync Failed:", err));
        }
    }, [readQuestions, bookmarks, notes, user, activeTech]); // Sync when these change

    // --- Persistence (Local) ---
    useEffect(() => {
        localStorage.setItem('activeTech', activeTech);
    }, [activeTech]);

    useEffect(() => {
        localStorage.setItem('readQuestions', JSON.stringify(readQuestions));
    }, [readQuestions]);

    useEffect(() => {
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }, [bookmarks]);

    useEffect(() => {
        localStorage.setItem('notes', JSON.stringify(notes));
    }, [notes]);

    const markAsRead = (id) => {
        setReadQuestions((prev) => {
            if (prev.includes(id)) return prev;
            return [...prev, id];
        });
    };

    const toggleBookmark = (id) => {
        setBookmarks((prev) => {
            if (prev.includes(id)) return prev.filter((b) => b !== id);
            return [...prev, id];
        });
    };

    const addNote = (note) => {
        setNotes((prev) => [
            { id: crypto.randomUUID(), createdAt: new Date().toISOString(), ...note },
            ...prev
        ]);
    };

    const deleteNote = (id) => {
        setNotes((prev) => prev.filter(n => n.id !== id));
    };

    const getQuestionsByCategory = (category) => {
        if (category === 'All' || !category) return questions;
        return questions.filter((q) => q.category === category);
    };

    const getStats = () => {
        return {
            total: questions.length,
            read: readQuestions.filter(id => questions.find(q => q.id === id)).length, // Only count read for current tech
            bookmarked: bookmarks.filter(id => questions.find(q => q.id === id)).length,
            notesCount: notes.length, // Notes are global for now, or filter by category if mapped?
            progress: Math.round((readQuestions.filter(id => questions.find(q => q.id === id)).length / questions.length) * 100) || 0,
        };
    };

    const value = {
        activeTech,
        setActiveTech,
        questions,
        readQuestions,
        bookmarks,
        notes,
        markAsRead,
        toggleBookmark,
        addNote,
        deleteNote,
        getQuestionsByCategory,
        getStats,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => useContext(AppContext);
