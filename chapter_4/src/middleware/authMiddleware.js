import jwt from 'jsonwebtoken'

//the middleware will intercept the network requests and read the token n verify that the token is correct for that particular user

// if there's something wrong, we can response before the endpoint actually receives the wrong request

// the purpose of having a middleware and not including these verification in the endpoints is so that we can just throw this process in front of every CRUD endpoint n not having to write the same thing multiple times (we can add this middleware step in server.js)

function authMiddleware(req, res, next) {
    const token = req.headers['authorization']

    if (!token) { return res.status(401).json({message: 'No token provided'})}

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {return res.status(401).json({message: "Invalid token"})}
        req.userId = decoded.id //(modify the request) adds a parameter (userId) to the request before sending it to the endpoint, and we decode the id because we used the user id to create the tokens in the first place
        next() // the last process of the middleware where the user passed the security check and can proceed to the endpoint
    })

    
}

export default authMiddleware