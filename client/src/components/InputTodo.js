

import React, { useState } from 'react';

const InputTodo = ({ setTodoList, todoList }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const onSubmitForm = async (e) => {
        e.preventDefault();
        const newTodo = { name, email };  

        try {
            const response = await fetch('http://localhost:3001/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTodo)
            });

            const data = await response.json(); 

            // Aggiorna subito lo stato per mostrare il nuovo dato
            setTodoList([...todoList, { id: data.id, ...newTodo }]);

            setName("");
            setEmail("");
        } catch (err) {
            console.error(err.message);
        }
    };

    return (
        <div>
            <h1 className="text-center mt-5">Pern Input Todo</h1>
            <form className="d-flex mt-5" onSubmit={onSubmitForm}>
                <input 
                    type="text" 
                    className="form-control" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="Name"
                />
                <input 
                    type="text" 
                    className="form-control" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="Email"
                />
                <button className="btn btn-success">Add</button>
            </form>
        </div>
    );
};

export default InputTodo;

