import { verifyToken } from "../jwt.js";

const onlineUsers = {};
export const access = (io, socket) => {
  const token = socket.handshake.auth?.token;
  const decode = verifyToken(token);
  const userId = decode?.id;
  // Khi socket client gửi event 'access'
  socket.on('access', () => {
    if (userId) {
      onlineUsers[userId] = socket.id;
    }

    console.log('Online users:', onlineUsers);
  });

  socket.on('logout', () => {
    delete onlineUsers[userId];
    console.log('Online users:', onlineUsers);
  })
};

export { onlineUsers };
