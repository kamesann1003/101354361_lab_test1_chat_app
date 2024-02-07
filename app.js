const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

mongoose.connect('mongodb://localhost:27017/chat_app', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.json());

// Define MongoDB models for User and ChatMessage

// Define routes for signup, login, joining/leaving rooms, and sending/retrieving messages
app.post('/signup', async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = new User({ username, password });
      await user.save();
      res.status(201).json({ message: 'Signup successful' });
    } catch (error) {
      res.status(500).json({ error: 'Signup failed' });
    }
  });
  
  // Login
  app.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username, password });
      if (user) {
        res.status(200).json({ message: 'Login successful' });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Login failed' });
    }
  });
  
  // Join Room
  app.post('/join-room', async (req, res) => {
    try {
      const { username, room } = req.body;
      await User.updateOne({ username }, { $addToSet: { rooms: room } });
      res.status(200).json({ message: 'Joined room successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to join room' });
    }
  });
  
  // Leave Room
  app.post('/leave-room', async (req, res) => {
    try {
      const { username, room } = req.body;
      await User.updateOne({ username }, { $pull: { rooms: room } });
      res.status(200).json({ message: 'Left room successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to leave room' });
    }
  });
  
  // Send Message
  app.post('/send-message', async (req, res) => {
    try {
      const { username, room, message } = req.body;
      const chatMessage = new ChatMessage({ username, room, message });
      await chatMessage.save();
      res.status(200).json({ message: 'Message sent successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to send message' });
    }
  });
  
  // Retrieve Messages for a Room
  app.get('/retrieve-messages/:room', async (req, res) => {
    try {
      const room = req.params.room;
      const messages = await ChatMessage.find({ room }).sort({ timestamp: 'asc' });
      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve messages' });
    }
  });
  
  // Start the server
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  rooms: [String],
});

const chatMessageSchema = new mongoose.Schema({
  username: { type: String, required: true },
  room: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);
const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

module.exports = { User, ChatMessage };
