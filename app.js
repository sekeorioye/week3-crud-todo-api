const express = require('express');
require('dotenv').config(); 
const app = express();
const validateTodo = require('./middleware/validator');
const validatePatch = require('./middleware/validatePatch');
const logRequest = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
app.use(express.json()); // Parse JSON bodies
app.use(logRequest);

let todos = [
  { id: 1, task: 'Learn Node.js', completed: false },
  { id: 2, task: 'Build CRUD API', completed: false },
  { id: 3, task: 'Test API', completed: true },
];

// GET All – Read
app.get('/todos', (req, res, next) => {
  try {
  res.status(200).json(todos); // Send array as JSON
} catch (error) {
  next(error);
}
});

// GET One – Read
app.get('/todos/:id', (req, res, next)=>{
  try {
    const todo = todos.find((t) => t.id === parseInt(req.params.id)); // Array.find()
    if(isNaN(req.params.id)) return res.status(400).json({ message: 'Invalid ID' });
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    res.json(todo);
  } catch (error) {
    next(error);
  }
});

// GET Active – Read
app.get('/todos/active', (req, res, next) =>{
  try {
    const active = todos.filter((t)=> !t.completed);
    res.json(active); 
  } catch (error) {
    next(error);
  }
})

// GET Completed – Read
app.get('/todos/completed', (req, res, next) => {
  try {
    const completed = todos.filter((t) => t.completed);
    res.json(completed); // Custom Read!
  } catch (error) {
    next(error);
  }
});

// POST New – Create
app.post('/todos', validateTodo, (req, res, next) => {
  try {
    const newTodo = { id: todos.length + 1, ...req.body }; // Auto-ID
    todos.push(newTodo);
    res.status(201).json(newTodo); // Echo back
  } catch (error) {
    next(error);
  }
});

// PATCH Update – Partial
app.patch('/todos/:id', validatePatch, (req, res, next) => {
  try {
    const todo = todos.find((t) => t.id === parseInt(req.params.id)); // Array.find()
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    Object.assign(todo, req.body); // Merge: e.g., {completed: true}
    res.status(200).json(todo);
  } catch (error) {
    next(error);
  }
});

// DELETE Remove
app.delete('/todos/:id', (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const initialLength = todos.length;
    todos = todos.filter((t) => t.id !== id); // Array.filter() – non-destructive
    if (todos.length === initialLength)
      return res.status(404).json({ error: 'Not found' });
    res.status(204).send(); // Silent success
  } catch (error) {
    next(error);
  }
});

app.use(errorHandler); // Error handling middleware
 
const PORT = 3000;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));
