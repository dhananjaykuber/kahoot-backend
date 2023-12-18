import dotenv from 'dotenv';
import app from './app';
import SocketService from './services/SocketService';
import http from 'http';

dotenv.config();

const PORT = process.env.PORT || 3000;

// socket
const server = http.createServer(app);

const socketService = new SocketService();
socketService.initListener();
const io = socketService.io;
io.attach(server);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} 🚀`);
});
