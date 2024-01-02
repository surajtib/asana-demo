// functions/server.js
const fs = require('fs/promises');
const path = require('path');
const cors = require('cors');

const TODOS_FILE_PATH = path.resolve(__dirname, 'todos.json');

exports.handler = async function (event, context) {
  if (event.httpMethod === 'GET') {
    try {
      const data = await fs.readFile(TODOS_FILE_PATH, 'utf8');
      const todos = JSON.parse(data);
      return {
        statusCode: 200,
        body: JSON.stringify(todos),
      };
    } catch (error) {
      console.error(error);
      return {
        statusCode: 500,
        body: 'Internal Server Error',
      };
    }
  }

  if (event.httpMethod === 'POST') {
    try {
      let data;

      try {
        data = await fs.readFile(TODOS_FILE_PATH, 'utf8');
      } catch (readError) {
        console.error('Error reading todos.json:', readError);
        data = '[]';
      }

      let todos;

      try {
        todos = JSON.parse(data);
      } catch (parseError) {
        console.error('Error parsing todos.json:', parseError);
        todos = [];
      }

      const newTodo = JSON.parse(event.body);
      newTodo.id = Date.now();
      todos.push(newTodo);

      await fs.writeFile(TODOS_FILE_PATH, JSON.stringify(todos, null, 2));

      return {
        statusCode: 200,
        body: JSON.stringify(newTodo),
      };
    } catch (error) {
      console.error('Error adding todo:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Internal Server Error' }),
      };
    }
  }

  return {
    statusCode: 404,
    body: 'Not Found',
  };
};
