const express = require('express') //import express
const app = express() //create a backend application
const PORT = 8383

let data = ['poop']

//configurations

//middleware (configurations before the requests hit the endpoints)
app.use(express.json()) //configures the server to expect json data

//website endpoints
app.get('/', (req, res) => {
    res.send(`
        <body>
            <h1>this is a website</h1>
            <p>${JSON.stringify(data)}</p>
        </body>
        `) //res is important because its the response u send back to the client so they know the request it received by the server successfully
})

//API endpoints
app.get('/api/data', (req, res) => {
    res.send(data)
})

app.post('/api/data', (req, res) => {
    const newEntry = req.body
    data.push(newEntry.name)
    res.sendStatus(201)
})

app.delete('/api/data', (req, res) => {
    data.pop() //removes the last element in the array
    res.sendStatus(203)
})

app.listen(PORT, () => console.log(`Server has started on: ${PORT}`)) 
//listen incoming request at this port (always at the bottom of the code)
//install nodemon and change the dev script in package.json so that when making changes, the server will be updated automatically without having to kill n rerun the server