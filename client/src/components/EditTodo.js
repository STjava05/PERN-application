

import React, { useState } from "react";

const EditTodo = ({ todo, setTodoList, todoList }) => {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState(todo.name);
  const [email, setEmail] = useState(todo.email);

  const updateEdit = async () => {
    try {
      const body = { name, email };
      const response = await fetch(`http://localhost:3001/users/${todo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        const updatedTodo = { ...todo, name, email };
        setTodoList(todoList.map(t => (t.id === todo.id ? updatedTodo : t)));
        setShowModal(false);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div>
      <button
        type="button"
        className="btn btn-warning"
        onClick={() => setShowModal(true)}
      >
        Edit
      </button>

      {showModal && (
        <div className="modal d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Edit Todo</h4>
                <button
                  type="button"
                  className="close"
                  onClick={() => setShowModal(false)}
                >
                  &times;
                </button>
              </div>

              <div className="modal-body">
                <input type="text" className="form-control" value={name} onChange={e => setName(e.target.value)} />
                <input type="text" className="form-control" value={email} onChange={e => setEmail(e.target.value)} />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-warning" onClick={updateEdit}>Edit</button>
                <button type="button" className="btn btn-danger" onClick={() => setShowModal(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditTodo;

