// api/todos.js
const mongoose = require('mongoose');
const Todo = require('../models/todo');

const mongoURI = process.env.MONGODB_URI;

let isConnected = false;

const connectToMongoDB = async () => {
  if (isConnected) {
    console.log('Using existing MongoDB connection');
    return;
  }
  try {
    await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    isConnected = true;
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw new Error('Failed to connect to MongoDB');
  }
};

module.exports = async (req, res) => {
  const { method } = req;
  try {
    await connectToMongoDB();  // Make sure DB connection is established

    if (method === 'GET') {
      const todos = await Todo.find();
      return res.status(200).json(todos);
    }

    if (method === 'POST') {
      const { title, description } = req.body;
      if (!title) return res.status(400).json({ error: 'Title is required' });

      const todo = new Todo({ title, description });
      const savedTodo = await todo.save();
      return res.status(201).json(savedTodo);
    }

    if (method === 'PUT') {
      const { id } = req.query;
      const { title, description, completed } = req.body;

      if (!title) return res.status(400).json({ error: 'Title is required' });

      const todo = await Todo.findByIdAndUpdate(id, { title, description, completed }, { new: true });
      if (!todo) return res.status(404).json({ error: 'To-do not found' });
      return res.status(200).json(todo);
    }

    if (method === 'DELETE') {
      const { id } = req.query;
      const todo = await Todo.findByIdAndDelete(id);
      if (!todo) return res.status(404).json({ error: 'To-do not found' });
      return res.status(200).json({ message: 'To-do item deleted successfully' });
    }

    return res.status(404).json({ error: 'Route not found' });
  } catch (error) {
    console.error('Error handling request:', error);
    return res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
};