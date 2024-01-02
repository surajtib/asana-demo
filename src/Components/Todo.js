import React, { useState, useEffect } from 'react';
import { InputGroup, FormControl, Button, ListGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const Todo = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [offlineTodo, setOfflineTodo] = useState('');

  console.log("offlineTodo", offlineTodo)

  const fetchTodos = async () => {
    try {
      const response = await axios.get('http://localhost:3001/todos');
      setTodos(response.data);

      // Check if there are locally stored todos
      const localTodos = JSON.parse(localStorage.getItem('localTodos')) || [];

      if (localTodos.length > 0) {
        // Send locally stored todos to the server

console.log("localtodo", ...localTodos);
        await axios.post('http://localhost:3001/todos', ...localTodos);

        // Clear local storage after sending todos to the server
        localStorage.removeItem('localTodos');
      }
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(async () => {
      const isConnectedToNetwork = navigator.onLine;
      console.log("isConnectedToNetwork", isConnectedToNetwork);
  
      if (isConnectedToNetwork && offlineTodo?.length > 0) {
        for (const data of offlineTodo) {
          try {
            const response = await axios.post('http://localhost:3001/todos', data);
            console.log("Success:", response);
          } catch (error) {
            console.error('Error posting todo:', error);
          }
        }
  
        setOfflineTodo([]);
      }
    }, 5000);
    return () => clearInterval(intervalId);
  }, [offlineTodo]);
  

  const addTodo = async () => {
    const isConnectedToNetwork = navigator.onLine;
    // const isConnectedToNetwork = true;
  
    if (newTodo.trim() !== '') {
      try {
        if (isConnectedToNetwork) {
          // If online, send the new todo to the server
          const response = await axios.post('http://localhost:3001/todos', {
            text: newTodo,
            completed: false,
          });
  
          setTodos([...todos, response.data]);
          setNewTodo('');
  
          // Check if there are locally stored todos
          const localTodos = JSON.parse(localStorage.getItem('localTodos')) || [];
  
          if (localTodos.length > 0) {
            // Send locally stored todos to the server
            console.log("localTodos", localTodos)

            await axios.post('http://localhost:3001/todos', localTodos);
  
            // Clear local storage after sending todos to the server
            localStorage.removeItem('localTodos');
          }
        } else {
          // If offline, save the new todo to local storage
          const todoToAdd = { id: Date.now(), text: newTodo, completed: false };
  
          // Concatenate the local todos directly to the current todos state
          setTodos((prevTodos) => [...prevTodos, todoToAdd]);
          setOfflineTodo((prevTodos) => [...prevTodos, todoToAdd]);
  
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
