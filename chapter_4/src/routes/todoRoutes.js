import express from 'express'
import prisma from '../prismaClient.js'

const router = express.Router()


// get all todos for logged-in user
router.get('/', async(req, res) => {
    const todos = await prisma.todo.findMany({
        where: {
            userId: req.userId
        }
    })
    res.json(todos)
})

// create a new todo
router.post('/', async(req, res) => {
    const { task } = req.body
    const todo = await prisma.todo.create({
        data: {
            task,
            userId: req.userId
        }
    })
    res.json(todo) //will just get back a todo object

})

// update a todo (with dynamic id)
router.put('/:id', async(req, res) => {
    // so we can access request information from req.body, req.params (in url), and req.query (in url after '?')
    const { completed } = req.body
    const { id } = req.params

    const updateTodo = await prisma.todo.update({
        where: {
            id: parseInt(id),
            userId: req.userId
        },
        data: {
            completed: !!completed
        }
        // completed is set like that cuz if we assign 1, it'll be taken as a numeric value and not a boolean
    })
    res.json(updateTodo)
})

// delete a todo
router.delete('/:id', async(req, res) => {
    const { id } = req.params
    const userId = req.userId
    await prisma.todo.delete({
        where: {
            id: parseInt(id),
            userId
        }
    })
    res.json({message: "Todo deleted"})
})

export default router