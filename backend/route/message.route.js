import express from 'express';
import MessageController from '../controller/message.controller.js';


const MessageRoute = express.Router();

// Gửi tin nhắn mới
MessageRoute.post('/', MessageController.createMessage);

// Lấy tin nhắn giữa người dùng hiện tại và người khác
MessageRoute.get('/:otherUserId', MessageController.getMessages);

export default MessageRoute;
