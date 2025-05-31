import express from 'express' //this is just a module syntax, need to specify it in package.json the method we use in chapter2 is the commonjs method
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import authRoutes from './routes/authRoutes.js'
import todoRoutes from './routes/todoRoutes.js' //doesnt have to import the exported variable name, can assign a name to it in this case i imported the todoRoutes.js file, but i name it todoRoutes instead of routes(name of variable being exported in the file)
import authMiddleware from './middleware/authMiddleware.js'

const app = express()
const PORT = process.env.PORT || 5000

// get the file path from URL of the current module
const __filename = fileURLToPath(import.meta.url)
// get the directory name from the file path
const __dirname = dirname(__filename)

// Middleware
app.use(express.json()) //configures the app to expect json and allow it to parse or interpret that info

// serves the HTML file from /public directory (all our assets)
// tells express to serve all files from the public folder as static assets / file. Any requests for the css files will be resolved to the public directory
// just to tell the code where to find the public directory (say that the file is one level above the current directory)
app.use(express.static(path.join(__dirname, '../public')))


// serving up the HTML file from the /public directory
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

// Routes
app.use('/auth', authRoutes) //combines the routes configured in authRoutes behind the /auth endpoint
app.use('/todos', authMiddleware, todoRoutes) //so we throw the middleware in front of every todo endpoints so the request will first go to /todos, and then to authMiddleware, and then only to todoRoutes so all todoRoutes are protected by the authMiddleware where we check the authentication of token



app.listen(PORT, () => {
    console.log(`Server has started on PORT ${PORT}`)
})