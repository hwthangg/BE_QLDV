import express from 'express';

import NotificationController from '../controller/notification.controller.js';


const NotificationRoute = express.Router();

// Lấy danh sách thông báo của user hiện tại (đã xác thực)
NotificationRoute.get('/', NotificationController.getNotifications);

export default NotificationRoute;
