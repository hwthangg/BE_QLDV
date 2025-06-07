import Message from "../model/message.model.js";
import { sendResponse } from "../utils/response.js";

const MessageController = () => {
  // Tạo tin nhắn mới
  const createMessage = async (req, res) => {
    try {
      const sender = req.userId;
      const { recipientId, text } = req.body;

      const message = new Message({
        members: [sender, recipientId],
        sender,
        text
      });

      await message.save();

      return sendResponse(res, 201, "Gửi tin nhắn thành công", message);
    } catch (error) {
      console.log(error?.message);
      return sendResponse(res, 500, error.message);
    }
  };

  // Lấy danh sách tin nhắn giữa 2 người dùng
  const getMessages = async (req, res) => {
    try {
      const userId = req.userId;
      const { otherUserId } = req.params;

      const messages = await Message.find({
        members: { $all: [userId, otherUserId] }
      }).sort({ createdAt: 1 });

      return sendResponse(res, 200, "Lấy tin nhắn thành công", messages);
    } catch (error) {
      console.log(error?.message);
      return sendResponse(res, 500, error.message);
    }
  };

  

  return {
    createMessage,
    getMessages
  };
};

export default MessageController();
