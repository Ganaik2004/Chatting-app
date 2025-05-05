import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose';
import path from 'path'
import userRoutes from './routes/userRoutes.js'
import chatRoutes from './routes/chatRoutes.js'
import messageRoutes from './routes/messageRoutes.js'
import cookieParser from 'cookie-parser';
import { Server } from "socket.io";
import Message from './models/message.js';
dotenv.config();
// Connected to the database
mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log("Sucessfully Connected to mongodb")
}).catch((err)=>{
    console.log(err)
})

const __dirname = path.resolve();
const app = express();
app.use(express.json());
app.use(cookieParser());
const port = process.env.PORT||3000;
// app.get('/',(req,res)=>{
//     res.send('Hello World')
// })
app.use('/api/chat',chatRoutes)
app.use('/api/user',userRoutes);
app.use("/api/message",messageRoutes)
app.use(express.static(path.join(__dirname, "./client/dist")));
const server = app.listen(port,()=>{
    console.log(`Server is strted at ${port}`)
})
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, 'client','dist', 'index.html'));
  });
const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
      origin: "http://localhost:5173",
    },
  });
  io.on("connection",(socket)=>{
     socket.on('setup',(userData)=>{
 socket.join(userData._id);
socket.emit("connected");
     })
     socket.on("join chat",(room)=>{
        socket.join(room)
        })
        socket.on("typing",(room)=>{
            socket.in(room).emit("typing")
            })
            socket.on("stop typing",(room)=>{
                socket.in(room).emit("stop typing")
                })
        socket.on("new message",(newMessageRecieved)=>{
            let chat = newMessageRecieved.chat;
            if(!chat.users) return console.log("chat.users not defines")
                chat.users.forEach((user)=>{
            if(user._id==newMessageRecieved.sender._id) return;
            socket.in(user._id).emit("message recieved",newMessageRecieved)
            })
        })
        socket.off("setup",()=>{
            console.log("user disconnected")
            socket.leave(userData._id);
        })
  })
const deleteAllMessage = ()=>{
    Message.deleteMany({}).then(()=>console.log("Deleted"));
}
setInterval(deleteAllMessage,24*60*60*1000);
app.use((err,req,res,next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    return res.status(statusCode).json({
        success:false,
        statusCode,
        message,
    })
})
