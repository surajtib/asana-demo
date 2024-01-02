// server.js
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs/promises');
const cors = require('cors'); // Add this line

const app = express();
const port = 3001; // Choose a port for your server

app.use(cors())
app.use(bodyParser.json());

app.get('/todos', async (req, res) => {
  try {
    const data = await fs.readFile('./todos.json', 'utf8');
    const todos = JSON.parse(data);
    res.json(todos);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/todos', async (req, res) => {
    try {
      let data;
  
      try {
        data = await fs.readFile('./todos.json', 'utf8');
      } catch (readError) {
        // Handle the case where the file doesn't exist or couldn't be read
        console.error('Error reading todos.json:', readError);
        data = '[]'; // Initialize with an empty array if the file is not found or empty
      }
  
      let todos;
  
      try {
        todos = JSON.parse(data);
      } catch (parseError) {
        // Handle the case where the JSON is invalid
        console.error('Error parsing todos.json:', parseError);
        todos = []; // Initialize with an empty array if JSON parsing fails
      }
  
      const newTodo = req.body;
      newTodo.id = Date.now();
      todos.push(newTodo);
  
      await fs.writeFile('./todos.json', JSON.stringify(todos, null, 2));
  
      res.json(newTodo);
    } catch (error) {
      console.error('Error adding todo:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
