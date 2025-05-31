// define endpoints for handling authentication functionalities

import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '../db.js'

const router = express.Router()

// register a new user endpoint
router.post('/register', (req, res) => {
    const {username, password} = req.body
    // save username and irreversibly encrypted password

    // 1. encrypt the password
    const hashedPassword = bcrypt.hashSync(password, 8)

    // save new user and hashedpassword to db
    try {
        const insertUser = db.prepare(`INSERT INTO users (username, password) VALUES (?, ?)`) //prepare a sql command, similar to exec() but prepare allows us to inject values into sql queries
        const result = insertUser.run(username, hashedPassword) // injecting values into the sql query

        // adding todo for the user
        const defaultTodo = `Hello :) Add your first todo!`
        const insertTodo = db.prepare(`INSERT INTO todos (user_id, task) VALUES (?, ?)`)
        insertTodo.run(result.lastInsertRowid, defaultTodo) //we can check the id of the last entry added to the table (newest user)

        // create token (very important to login)
        const token = jwt.sign({id: result.lastInsertRowid}, process.env.JWT_SECRET, {expiresIn: '24h'})

        res.json({token}) // so @index.html (front end) there'll be a code where if the data (response.json()) has a token inside, will store the token in localStorage (its like a cookie) n then if we have the token, the front end will fetchTodos()

    } catch (err) {
        console.log(err.message)
        res.sendStatus(503)
    }
    
    
})

router.post('/login', (req, res) => {
    // getting the email and lookup the password associated with the email in the database

    // 1. destructure the username and password
    const {username, password} = req.body

    try {
        const getUser = db.prepare('SELECT * FROM users WHERE username = ?')
        const user = getUser.get(username)

        // guard clauses
        if(!user) {
            return res.status(404).send({message: "User not found"})
        }

        const passwordIsValid = bcrypt.compareSync(password, user.password) //it'll hash the password n test it with the hashedPassword

        if(!passwordIsValid) {
            return res.status(401).send({ message: "Invalid password" })
        }

        console.log(user)

        //then we have a successful authentication
        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: '24h'})
        res.json({ token }) //send the token back so that we can use it to authenticate all the CRUD actions

    } catch (err) {
        console.log(err.message)
        res.sendStatus(503)
    }

})


export default router