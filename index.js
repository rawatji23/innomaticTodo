const express = require('express');
const mongoose = require('mongoose');
const todosRoutes = require('./routes/todos');

const app = express();
const PORT = 3000;


app.use(express.json());
require('dotenv').config();




const mongourl = 'mongodb+srv://vijayrawat:vijayrawat@cluster0.dsxbi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const mongoURI= process.env.mongourl;
mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB Atlas!'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));


app.use('/todos', todosRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
