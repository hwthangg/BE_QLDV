import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import { connectMongoDB } from './config/index.js';
import morgan from 'morgan';
import AccountRoute from './route/account.route.js';
import { sendResponse } from './utils/response.js';
import AuthRoute from './route/auth.route.js';
import { verifyAccount } from './middleware/verifyAccount.js';
import ChapterRoute from './route/chapter.route.js';
import DocumentRoute from './route/document.route.js';
import EventRoute from './route/event.route.js';
import CommentRoute from './route/comment.route.js';
import FavoriteRoute from './route/favorite.route.js';
import RegistrationRoute from './route/registration.route.js';
import { handleSocketConnection } from './utils/socket/index.js';
import MessageRoute from './route/message.route.js';
import Registration from './model/registration.model.js';
import Notification from './model/notification.model.js';

// Xử lý initialization
connectMongoDB()
dotenv.config();

const PORT = process.env.PORT || 4000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

const app = express();

const server = http.createServer(app);  // Tạo server HTTP

const io = new Server(server, {
  path: '/qldv/socket.io',
  cors: {
    origin: CLIENT_URL,
    methods: ['GET', 'POST'],
  }
});


// Xử lý các middlewares
app.use(cors({
  origin: CLIENT_URL,
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());

// Xử lý các routes
app.get('/', (req, res) => {
  sendResponse(res, 200, 'Kết nối server thành công')
});

app.use('/api', (req, res, next) => {
  const openPaths = [
    '/auth/login',
    '/auth/register'
  ];

  if (openPaths.includes(req.path)) {
    return next();
  }

  verifyAccount(req, res, next);
});
app.use('/api/accounts', AccountRoute)
app.use('/api/auth', AuthRoute)
app.use('/api/chapters', ChapterRoute)
app.use('/api/documents', DocumentRoute)
app.use('/api/events', EventRoute)
app.use('/api/comments', CommentRoute)
app.use('/api/favorites', FavoriteRoute)
app.use('/api/registrations', RegistrationRoute)
app.use('/api/messages', MessageRoute)

handleSocketConnection(io)



const intervalId = setInterval(async () => {
  console.log('Đã chạy check event')
  try {
    const registrations = await Registration.find()
      .populate('eventId');

    const now = new Date();
    const next24h = 24 * 60 * 60 * 1000;

    const comingEvents = registrations.filter(item => {
      const timeDiff = new Date(item.eventId.startedAt) - now;
      return timeDiff > 0 && timeDiff <= next24h;
    });

    await Promise.all(comingEvents.map(async (item) => {
      const timeDiff = new Date(item.eventId.startedAt) - now;
      const hoursLeft = Math.floor(timeDiff / (60 * 60 * 1000));

      const notification = new Notification({
        text: `${item.eventId.name} sẽ bắt đầu sau khoảng ${hoursLeft} giờ`,
        receiver: item.accountId,
        type: 'reminder',
      });
      console.log(notification)
      await notification.save();
    }));

  } catch (error) {
    console.error('Lỗi tạo nhắc nhở sự kiện:', error.message);
  }
}, 10000); // chạy mỗi 10 s



server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
