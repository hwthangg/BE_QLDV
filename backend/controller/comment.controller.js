import Comment from "../model/comment.model.js";
import { sendResponse } from "../utils/response.js";

const CommentController = () => {
  const createComment = async (req, res) => {
    try {
      const accountId = req.userId;
      const { eventId, text } = req.body;

      console.log(accountId, eventId, text);
      const comment = new Comment({
        accountId,
        eventId,
        comment: text,
      });

      await comment.save();
      return sendResponse(res, 201, "Đăng bình luận thành công", comment);
    } catch (error) {
      console.log(error?.message);
      return sendResponse(res, 500, error.message);
    }
  };

  const getComments = async (req, res) => {
    try {
      const {eventId} = req.query
      const comments = await Comment.find({eventId: eventId})
      return sendResponse(res, 200, "Lấy bình luận của sự kiện thành công", comments);
    } catch (error) {
      console.log(error?.message);
      return sendResponse(res, 500, error.message);
    }
  };

  const reportComment = async (req, res) => {
    try {
      const {id} = req.params
 const comment = await Comment.findById(id)
      comment.report += 1
      if (comment.report == 5) {
        comment.status = 'locked'
        return sendResponse(res, 200, 'Bình luận này đã bị ẩn', comment)
      }
      await comment.save()
      return sendResponse(res, 200, 'Bình luận này đã được báo cáo', comment)
      
    } catch (error) {
      console.log(error?.message)
      return sendResponse(res, 500, error.message)
    }
  }



     
  return {
    createComment,
    getComments,
    reportComment,
  };
};

export default CommentController();
