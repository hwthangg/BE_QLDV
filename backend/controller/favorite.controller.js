import Favorite from '../model/favorite.model.js';
import { sendResponse } from '../utils/response.js';

const FavoriteController = () => {
  const like = async (req, res) => {
    try {
      const accountId = req.userId
      const {eventId} = req.body

      const favorite = new Favorite({accountId:accountId, eventId:eventId})
      await favorite.save()
      return sendResponse(res, 200, 'Thích sự kiện thành công', favorite);
    } catch (error) {
      console.log(error?.message);
      return sendResponse(res, 500, error.message);
    }
  };

  const unlike = async (req, res) => {
    try {
      const {id} = req.params
      await Favorite.findByIdAndDelete(id)
      return sendResponse(res, 200, 'Xóa lượt thích sự kiện thành công');
    } catch (error) {
      console.log(error?.message);
      return sendResponse(res, 500, error.message);
    }
  };

  const getLikes = async (req, res) => {
    try {
      const {eventId} = req.query
      const favorites = await Favorite.find({eventId:eventId})
      const likes = favorites.length
      return sendResponse(res, 200, 'Lấy lượt thích sự kiện thành công', likes);
    } catch (error) {
      console.log(error?.message);
      return sendResponse(res, 500, error.message);
    }
  };

  return {
    like,
    unlike,
    getLikes,
  };
};

export default FavoriteController();
