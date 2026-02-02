const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 5000;


app.use(cors());
app.use(express.json());

// --- DATABASE CONNECTION ---

mongoose.connect('mongodb://127.0.0.1:27017/purplenotes')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error(' MongoDB Connection Error:', err));

// --- MODELS  ---

// User Model
const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
const User = mongoose.model('User', UserSchema);

// Note Model
const NoteSchema = new mongoose.Schema({
    userEmail: { type: String, required: true },
    title: String,
    content: String,
    createdAt: { type: Date, default: Date.now }
});
const Note = mongoose.model('Note', NoteSchema);

// --- API ROUTES  ---

// 1. Signup Route
app.post('/api/signup', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        
        const newUser = new User({ email, password });
        await newUser.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Login Route
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, password });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        res.json({ user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Get Notes Route
app.get('/api/notes', async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) return res.status(400).json({ message: 'Email required' });
        
        const notes = await Note.find({ userEmail: email }).sort({ createdAt: -1 });
        
      
        const formattedNotes = notes.map(n => ({
            id: n._id,
            title: n.title,
            content: n.content
        }));
        res.json(formattedNotes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. Save Notes Route 
app.post('/api/notes', async (req, res) => {
    try {
        const { email, notes } = req.body;
        
        
        await Note.deleteMany({ userEmail: email });
        
        
        const noteDocs = notes.map(n => ({
            userEmail: email,
            title: n.title,
            content: n.content
        }));
        
        await Note.insertMany(noteDocs);
        
        res.json({ message: 'Notes synced' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- SERVER START ---
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});