import Chat from '../models/chatroom.js';

const chatSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join channel
    socket.on('joinChannel', (channel) => {
      socket.join(channel);
      console.log(`User ${socket.id} joined channel: ${channel}`);
      io.to(channel).emit('message', `User joined channel: ${channel}`);
    });

    // Send message
    socket.on('sendMessage', async ({ channel, username, message }) => {
      const chatMessage = new Chat({ channel, username, message });
      await chatMessage.save();
      io.to(channel).emit('message', chatMessage);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};

export default chatSocket;
