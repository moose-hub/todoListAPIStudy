import express from 'express';
import { v4 as uuidv4 } from "uuid";
import { getTodoList, addTodo, getTodoById, deleteTodo, updateTodo } from "./models/todos.js";

const app = express();
app.use(express.json());

const port = 3000;
app.listen (port, () => {
    console.log(`Server is listening on port ${port}.`)
})


// create get request to endpoint /todos
// pass second argument as an async function
app.get("/todos", async function (req, res) {
  // Try catch block containing the below...
  try {
    // create variable that = the result of the async function (must await)
    const todos = await getTodoList();
    // parse the result into a json object and send status code - 200
    res.status(200).json({ success: true, payload: todos });
  } catch (error) {
    // in catch block - parse the result into a json object and send status code - server error code 500
    res.status(500).json({ success: false, payload: `${error} unexpected error` });
  }
});

app.get("/todos/:id", async function (req, res) {
  const id = req.params.id;
  try {
    const todo = await getTodoById(id);

    if (!todo) {
      throw new Error(`Todo with id: ${id} not found`)
    }

    res.status(200).json({ success: true, payload: todo });
  }
  catch (error) {
    //Dynamically return correct error status and message
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ success: false, payload : error.message || 'Internal server error' });
  }
})

// create post request to endpoint /todos
// pass second argument as an async function
app.post("/todos", async function (req, res) {
  // Try catch block containing the below...
  try {
    //Get the request body
    const { toDo, completed } = req.body;
    const newTodo = {id: uuidv4(), toDo, completed}
    // create variable that = the result of the async function (must await)
    const todo = await addTodo(newTodo);
    //If client input is incorrect, throw error
    if(!toDo || toDo.trim() === "" || !completed || completed.trim() === ""){
      throw new Error('Todo List properties incorrect');
    }
    // parse the result into a json object and send status code - 201
    res.status(201).json({ success: true, payload: todo });
  } catch (error) {
    //Dynamically return correct error status and message
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ success: false, payload : error.message || 'Internal server error' });
  }
});

// create patch handler for app
// try catch block for exception handling

app.patch("/todos/:id", async function (req, res) {
  const id = req.params.id;
  const { toDo, completed } = req.body;
  try {
    const todo = await updateTodo(id, toDo, completed);

    if((!toDo || toDo.trim() === "") && (!completed || completed.trim() === "")){
      throw new Error('Todo List properties incorrect');
    }
    res.status(201).json({ success: true, payload: todo });
  }
  catch (error) {
    //Dynamically return correct error status and message
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ success: false, payload : error.message || 'Internal server error' });
  }
})

// create delete handler for app
// try catch block for exception handling
app.delete("/todos/:id", async function (req, res) {
  const id = req.params.id;
  // assign id to a variable
  // call data callback function to handle deletion of todo task
  // error validation if id is non existant
  try {
    const deletedTodo = await deleteTodo(id);

    if (!deleteTodo) {
      throw new Error(`Todo with id: ${id} does not exist`)
    }

    res.status(200).json({ success: true, payload: deletedTodo[0], message: "todo task deleted"})
  }
  catch (error) {
    //Dynamically return correct error status and message
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ success: false, payload : error.message || 'Internal server error' });
  }
})