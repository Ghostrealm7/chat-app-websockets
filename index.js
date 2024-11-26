import express from "express";
import {Server} from "socket.io";
import path from 'path'
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PORT = process.env.PORT || 3500

const app = express()

app.use(express.static(path.join(__dirname, "public")))


const expressServer = app.listen(PORT, ()=> {
  console.log(`Listening on port ${PORT}`)
})

// CORS not required if server/client is hosted in the same server
const io = new Server(expressServer,{
  cors: {
    origin: "*"
  }
})

//Watch for new user connection
io.on('connection', socket => {
  console.log(`User ${socket.id} connected`)

  //Message to newly connected user
  socket.emit('message', "Welcome to socket.io chat")

  //Broadcast message - Connected User
  socket.broadcast.emit('message', `User ${socket.id.substring(0,5)} connected`)

  //Listening for a message event
  socket.on('message', data => {
    console.log(data)
    io.emit('message', `${socket.id.substring(0,5)}: ${data}`)
  })

  //Broadcast message - Disconnected User
  socket.on('disconnect', ()=> {
    socket.broadcast.emit('message', `User ${socket.id.substring(0,5)} disconnected`)
  })

  //Listening for activity - all users
  socket.on('activity', (name)=> {
    socket.broadcast.emit('activity', name)
  })
})