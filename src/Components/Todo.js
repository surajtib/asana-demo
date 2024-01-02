// Todo.js
import React, { useState, useEffect } from 'react';
import { InputGroup, FormControl, Button, ListGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const Todo = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get('/.netlify/functions/server/todos');
        setTodos(response.data);
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    };

    fetchTodos();
  }, []);

  const addTodo = async () => {
    const isConnectedToNetwork = navigator.onLine;

    if (newTodo.trim() !== '') {
      try {
        if (isConnectedToNetwork) {
          const response = await axios.post('/.netlify/functions/server/todos', {
            text: newTodo,
            completed: false,
          });

          setTodos([...todos, response.data]);
          setNewTodo('');
        } else {
          // Save to local storage if not connected to network
          const localTodos = JSON.parse(localStorage.getItem('localTodos')) || [];
          const todoToAdd = { id: Date.now(), text: newTodo, completed: false };
          localTodos.push(todoToAdd);
          localStorage.setItem('localTodos', JSON.stringify(localTodos));

          setTodos([...todos, todoToAdd]);
          setNewTodo('');
        }
      } catch (error) {
        console.error('Error adding todo:', error);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  return (
    <div className="todo-container">
      <h1 className="mb-4">Asana</h1>
      <InputGroup className="mb-3">
        <FormControl
          placeholder="Add new todo"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <Button variant="primary" onClick={addTodo}>
          Add
        </Button>
      </InputGroup>

      <ListGroup>
        {todos.map((todo) => (
          <ListGroup.Item key={todo.id}>
            <span>{todo.text}</span>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default Todo;
