import Account from "../model/account.model.js";
import Comment from "../model/comment.model.js";
import Event from "../model/event.model.js";
import { deleteFromCloudinary } from "../utils/crud/index.js";
import { sendResponse } from "../utils/response.js";
import { validateEventForm } from "../utils/validation/index.js";

const EventController = () => {
  const createEvent = async (req, res) => {
    try {
      const form = req.body
      const images = req.uploadedFiles

      const userId = req.userId

      const manager = await Account.findById(userId).select('chapterId')

      const validation = validateEventForm(form)
      if (!validation.isValid) {
        return sendResponse(res, 400, validation.message)
      }

      const duplication = await Event.findOne({ name: form.name, chapterId: manager.chapterId.toString(), startedAt: new Date(form.startedAt) })
      console.log(duplication)
      if (duplication) {
        return sendResponse(res, 400, 'Sự kiện đã tồn tại')
      }

      const event = new Event({ ...form, status: form?.status || 'pending', images: images || null, chapterId: manager.chapterId })

      await event.save()

      return sendResponse(res, 200, 'Tạo sự kiện thành công', event);
    } catch (error) {
      console.log(error?.message);
      return sendResponse(res, 500, error.message);
    }
  };

  const getEventsInPage = async (req, res) => {
    try {

      const {
        page = 1,
        limit = 5,
        search,
        scope,
        status,

      } = req.query;

      const filter = {};
      // Tìm kiếm gần đúng theo email, phone, fullname
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: "i" } },
          { location: { $regex: search, $options: "i" } }
        ];
      }

      if (scope) {
        filter.scope = scope;
      }
      if (status) {
        filter.status = status;
      }
      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: {
          "createdAt": 1
        },
        populate: 'chapterId'
      };

      const result = await Event.paginate(filter, options);
      return sendResponse(res, 200, 'Lấy danh sách sự kiện thành công', result)

    } catch (error) {
      console.log(error?.message)
      return sendResponse(res, 500, error.message)
    }
  };

  const getEventById = async (req, res) => {
    try {
      const { id } = req.params

      const event = await Event.findById(id)
      return sendResponse(res, 200, 'Lấy thông tin sự kiện thành công', event)

    } catch (error) {
      console.log(error?.message);
      return sendResponse(res, 500, error.message);
    }
  };

  const updateEventById = async (req, res) => {
    try {
      const { id } = req.params
      const form = req.body
      const images = req.uploadedFiles

      const event = await Event.findById(id)

      const validation = validateEventForm(form, true)
      if (!validation.isValid) {
        return sendResponse(res, 400, validation.message)
      }

      if (form?.name && form?.startedAt) {
        const duplication = await Event.findOne({ name: form?.name, chapterId: manager.chapterId.toString(), startedAt: new Date(form.startedAt) })
        console.log(duplication)
        if (duplication) {
          return sendResponse(res, 400, 'Sự kiện đã tồn tại')
        }
      }

      if (form?.name) {
        const duplication = await Event.findOne({ name: form?.name, chapterId: manager.chapterId.toString(), startedAt: event.startedAt })
        console.log(duplication)
        if (duplication) {
          return sendResponse(res, 400, 'Sự kiện đã tồn tại')
        }
      }

      if (form?.startedAt) {
        const duplication = await Event.findOne({ name: name, chapterId: manager.chapterId.toString(), startedAt: new Date(form.startedAt) })
        console.log(duplication)
        if (duplication) {
          return sendResponse(res, 400, 'Sự kiện đã tồn tại')
        }
      }


      const update = new Account(form)
      for (const field in update.toObject()) {
        if (update[field] != null && field != '_id') {
          event[field] = update[field]
        }
      }

      if (images) {

        if (event.images) {
          for (const image of event.images) {
            deleteFromCloudinary(image.public_id)
          }
        }
        event.images = images
      }

      await event.save()
      return sendResponse(res, 200, 'Cập nhật thông tin tài khoản thành công', event)
    } catch (error) {
      console.log(error?.message)
      return sendResponse(res, 500, error.message)
    }
  };


  

  return {
    createEvent,
    getEventsInPage,
    getEventById,
    updateEventById,
 
  };

}

export default EventController()