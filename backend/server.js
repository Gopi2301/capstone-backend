import express from "express";
import { chats } from "./data.js";
const app = express();
import cors from "cors";
import * as dotenv from 'dotenv'
import connectDB from "./config/db.js";
import userRouters from "./routes/userRoutes.js";
import { errorHandler } from "./middleware/errormiddleware.js";
import { notFound } from "./middleware/errormiddleware.js";
import chatRoutes from "./routes/chatRoutes.js"
import messageRoutes from "./routes/messageRoutes.js"
// import http from 'http'
// const server = http.createServer(app)
import { Server } from "socket.io"

dotenv.config()



const PORT = process.env.PORT;

// api Middleware
app.use(cors());
app.use(express.json())

app.use("/api/user", userRouters)
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.use(notFound);
app.use(errorHandler);

app.get("/", function (request, response) {
  response.send("🙋‍♂️, 🌏 🎊✨🤩");
});


const server = app.listen(PORT, () => {
  connectDB()
  console.log(`The server started in: ${PORT} ✨✨`)
});
// const io = new Server(server)
// io.on('connection', (socket) => {

//   console.log('connected')
// })
const io = new Server(server, {
  pingTimeout: 60000,
  cors: { origin: "http://localhost:5173", },
});

io.on("connection", (socket) => {
  console.log('connected to socket.io')

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected")
  })
  socket.on("join chat", (room) => {
    socket.join(room)
    console.log("User joined room" + room)
  })
  socket.on('new message', (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;
    if (!chat.users) return console.log("chat.users not defined")
    chat.users.forEach(user => {
      if (user._id === newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved)
    });
  })
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"))
})

