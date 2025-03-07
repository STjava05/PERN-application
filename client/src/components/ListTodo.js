

import React from 'react';
import EditTodo from './EditTodo';

const ListTodo = ({ todoList, setTodoList }) => {
    const deleteTodo = async (id) => {
        try {
            await fetch(`http://localhost:3001/users/${id}`, {
                method: 'DELETE'
            });

            // Aggiorniamo lo stato rimuovendo l'elemento eliminato
            setTodoList(todoList.filter(todo => todo.id !== id));
        } catch (err) {
            console.error(err.message);
        }
    };

    return (
        <div>
            <table className="table text-center mt-5">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {todoList.map(todo => (
                        <tr key={todo.id}>
                            <td>{todo.name}</td>
                            <td>{todo.email}</td>
                            <td><EditTodo todo={todo} setTodoList={setTodoList} todoList={todoList} /></td>
                            <td>
                                <button className='btn btn-danger' onClick={() => deleteTodo(todo.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ListTodo;

