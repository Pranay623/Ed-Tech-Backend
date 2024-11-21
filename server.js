import './config/db.js';
import express from 'express';
import cors from 'cors';
import AutRoutes from '../Ed-Tech Backend/routes/auth.js';
// import postRoutes from './routes/post.js';
// import profileRoutes from './routes/profile.js';
import cookieParser from 'cookie-parser';
import http from 'http';
import { Server } from 'socket.io';

import chatSocket from './sockets/chat.js';
import authRoutes from './routes/auth.js';
import chatroomRoutes from './routes/chatroom.js';

const app = express();
const port = 3000;


var corsOptions = {
    origin: 'http://localhost:5173',
    optionsSuccessStatus: 200,
    Credentials: true,
  }


app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());


app.use('/auth', AutRoutes);
// app.use('', postRoutes)
// app.use('', profileRoutes)
app.use('/chatroom', chatroomRoutes);

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*', // Adjust to allow specific origins if necessary
        methods: ['GET', 'POST'],
    },
});

chatSocket(io);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}).on('error', (err) => {
    console.error("Failed to start server:", err);
});