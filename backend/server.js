const express = require('express')
require('dotenv').config();
const cors = require('cors')
const mongoose = require('mongoose')
const http = require('http')
const userRouter = require('./routes/UserRoutes')
const messageRouter = require('./routes/messageRoutes')
const { initSocket } = require('./lib/socket')

//Create Express app and HTTP server
const app = express()
const server = http.createServer(app)

initSocket(server)

app.use(express.json({limit: '10mb'}));
app.use(cors());

app.use("/api/auth", userRouter)
app.use("/api/messages", messageRouter)

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        //listen for requests
        server.listen(process.env.PORT, () => {
        console.log('Connect to DB and listenning on port', process.env.PORT)
    })
    })
    .catch((error) => {
        console.log(error)
    })
