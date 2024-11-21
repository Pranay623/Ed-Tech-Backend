import jwt from 'jsonwebtoken';

const socketAuth = (socket, next) => {
  const token = socket.handshake.auth.token;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return next(new Error('Authentication error'));
      socket.userId = decoded.id;
      next();
    });
  } else {
    next(new Error('Authentication error'));
  }
};

export default socketAuth;
