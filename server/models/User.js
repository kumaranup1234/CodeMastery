
const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
    id: String, // UUID from frontend
    questionId: String,
    content: String,
    createdAt: { type: Date, default: Date.now }
});

const ProgressSchema = new mongoose.Schema({
    read: [String],      // Array of Question IDs
    bookmarks: [String]  // Array of Bookmarked Question IDs
}, { _id: false });

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // Progress per technology
    // Structure: { "React": { read: [], bookmarks: [] }, "Spring Boot": ... }
    progress: {
        type: Map,
        of: ProgressSchema,
        default: {}
    },

    // Global Notes (or we could nest them in progress if tech-specific)
    notes: [NoteSchema]
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
