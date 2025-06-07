import Notification from "../model/notification.model.js";
import { sendResponse } from "../utils/response.js";

const NotificationController = () => {
  // Lấy danh sách thông báo của người dùng, có thể phân trang nếu muốn
  const getNotifications = async (req, res) => {
    try {
      const userId = req.userId; // userId lấy từ token hoặc middleware xác thực

      // Tìm thông báo mà userId nằm trong mảng receiver
      const notifications = await Notification.find({ receiver: userId })
        .sort({ createdAt: -1 }); // mới nhất trước

      return sendResponse(res, 200, "Lấy thông báo thành công", notifications);
    } catch (error) {
      console.log(error?.message);
      return sendResponse(res, 500, error.message);
    }
  };

  return {
    getNotifications,
  };
};

export default NotificationController();
