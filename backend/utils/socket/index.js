import { access } from "./access.js";
import { chat } from "./chat.js";


export const handleSocketConnection = (io) => {
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);
    access(io,socket)
    chat(io,socket)
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};


