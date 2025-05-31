import express from 'express'
import db from '../db.js'

const router = express.Router()


// get all todos for logged-in user
router.get('/', (req, res) => {
    const getTodos = db.prepare('SELECT * FROM todos WHERE user_id = ?')
    
    const todos = getTodos.all(req.userId) //we can just get userID like this here because the middleware intercepts requests before reaching the endpoint, so authentication process and dealing with tokens stuff will be in the middleware and we assume the req here contains the userId
    res.json(todos)
})

// create a new todo
router.post('/', (req, res) => {
    const { task } = req.body
    const insertTodo = db.prepare(`
        INSERT INTO todos (user_id, task)
        VALUES (?, ?)`)
    const result = insertTodo.run(req.userId, task)
    res.json({id: result.lastInsertRowid, task, completed: 0})

})

// update a todo (with dynamic id)
router.put('/:id', (req, res) => {
    // so we can access request information from req.body, req.params (in url), and req.query (in url after '?')
    const { completed } = req.body
    const { id } = req.params

    // sql query if wanna update both fields (just comma separate them)
    // const updateTodo = db.prepare('UPDATE todos SET task = ?, completed = ? WHERE id = ?')

    // in this project, we only wanna update the completed field
    const updateTodo = db.prepare('UPDATE todos SET completed = ? WHERE id = ?')
    updateTodo.run(completed, id)
    res.json({message: "Todo completed"})
})

// delete a todo
router.delete('/:id', (req, res) => {
    const { id } = req.params
    const userId = req.userId
    const deleteTodo = db.prepare(`DELETE FROM todos WHERE id = ? AND user_id = ?`)
    deleteTodo.run(id, userId)
    res.json({message: "Todo deleted"})
})

export default router