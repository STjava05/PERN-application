import React,{useEffect,useState} from 'react'
import EditTodo from './EditTodo';

const ListTodo = () => {
    const[todoList, setTodoList] = useState([])

    const deleteTodo = async (id) => {
        try {
            await fetch(`http://localhost:3001/users/${id}`, {
                method: 'DELETE'
            });
    
            setTodoList(todoList.filter(todo => todo.id !== id)); 
        } catch (err) {
            console.error(err.message);
        }
    };
 
const getTodos= async ()=>{

       try {
        const response = await fetch('http://localhost:3001/users');
        const jsonData= await response.json()

        setTodoList(jsonData)
        
       } catch (err) {
        console.error(err.message)
        
       }

    }
    useEffect(()=>{
        getTodos()
    },[])
        
    console.log(todoList)
  return (
   <div>
      <table className="table text-center mt-5">
    <thead>
      <tr>
        <th>Name</th>
        <th>Email</th>
        <th>EDit</th>
        <th>Delete</th>
      </tr>
    </thead>
    <tbody>
     
       {todoList.map(todo =>(
         <tr key={todo.id}>
        <td>{todo.name}</td>
        <td>{todo.email}</td>
        <td>
         <EditTodo todo={todo}/>
        </td>
        <td>
        <button className='btn btn-danger' onClick={() => deleteTodo(todo.id)}>Delete</button>

        </td>
        </tr>
    ))}
     
    </tbody>
  </table>
    </div>
  )
}

export default ListTodo
