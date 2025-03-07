
import './App.css';
import { useState, useEffect } from 'react';
import InputTodo from './components/InputTodo';
import ListTodo from './components/ListTodo';

function App() {
  const [todoList, setTodoList] = useState([]);

  // Recupera i dati al caricamento della pagina
  useEffect(() => {
    const getTodos = async () => {
      try {
        const response = await fetch('http://localhost:3001/users');
        const jsonData = await response.json();
        setTodoList(jsonData);
      } catch (err) {
        console.error(err.message);
      }
    };
    getTodos();
  }, []);

  return (
    <div className='container'>
      <InputTodo setTodoList={setTodoList} todoList={todoList} />
      <ListTodo todoList={todoList} setTodoList={setTodoList} />
    </div>
  );
}

export default App;

