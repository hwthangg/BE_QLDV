import Account from "../model/account.model.js"
import Chapter from "../model/chapter.model.js"
import { sendResponse } from "../utils/response.js"
import { checkDuplicated, validateChapterForm } from "../utils/validation/index.js"

const ChapterController = () => {
  const createChapter = async (req, res) => {
    try {
      const form = req.body
      const validation = validateChapterForm(form)
      if (!validation.isValid) {
        return sendResponse(res, 400, validation.message)
      }

      const duplicatedName = await checkDuplicated(Chapter, 'name', form.name)
      const duplicatedAddress = await checkDuplicated(Chapter, 'address', form.address)

      if (duplicatedName.isDuplicated && duplicatedAddress.isDuplicated) {
        return sendResponse(res, 400, 'Chi đoàn đã tồn tại')
      }
      const chapter = new Chapter(form)
      await chapter.save()
      return sendResponse(res, 201, 'Tạo chi đoàn thành công')
    } catch (error) {
      console.log(error?.message)
      return sendResponse(res, 500, error.message)
    }
  }

  const getChaptersInPage = async (req, res) => {
    try {

      const {
        page = 1,
        limit = 5,
        search,
        status
      } = req.query;

      const filter = {};
      // Tìm kiếm gần đúng theo email, phone, fullname
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: "i" } },
          { address: { $regex: search, $options: "i" } },
        ];
      }
      // Lọc theo status nếu có
      if (status) {
        filter.status = status;
      }
      // Lọc theo role nếu có

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: {
          "createdAt": 1
        },
      };

      const chapters = await Chapter.paginate(filter, options);
      const result = await Promise.all(chapters.docs.map(async (chapter) => {
        const manager = await Account.findOne({ role: 'manager', chapterId: chapter._id })

        return ({ ...chapter.toObject(), manager: manager })
      }))
      return sendResponse(res, 200, 'Lấy danh sách chi đoàn thành công', result)

    } catch (error) {
      console.log(error?.message)
      return sendResponse(res, 500, error.message)
    }
  }

  const getChapterById = async (req, res) => {
    try {
      const { id } = req.params

      const chapter = await Chapter.findById(id)
      const manager = await Account.findOne({ role: 'manager', chapterId: chapter._id })

      const result = { ...chapter.toObject(), manager: manager }

      return sendResponse(res, 200, 'Lấy thông tin chi đoàn thành công', result)

    } catch (error) {
      console.log(error?.message)
      return sendResponse(res, 500, error.message)
    }
  }

  const updateChapterById = async (req, res) => {
    try {
      const {id} = req.params
      const form = req.body
      const validation = validateChapterForm(form, true)

      if (!validation.isValid) {
        return sendResponse(res, 400, validation.message)
      }

      const chapter = await Chapter.findById(id)

      if (form.name && form.address) {
        const duplicatedName = await checkDuplicated(Chapter, 'name', form.name)
        const duplicatedAddress = await checkDuplicated(Chapter, 'address', form.address)

        if (duplicatedName.isDuplicated && duplicatedAddress.isDuplicated) {
          return sendResponse(res, 400, 'Chi đoàn đã tồn tại')
        }

      }

      if (form.name) {
        const duplicatedName = await Chapter.findOne({ name: form.name, address: chapter.address })
        if (duplicatedName) {
          return sendResponse(res, 400, 'Chi đoàn đã tồn tại')
        }
      }

      if (form.address) {
        const duplicatedAddress = await Chapter.findOne({ name: chapter.name, address: form.address })
        if (duplicatedAddress) {
          return sendResponse(res, 400, 'Chi đoàn đã tồn tại')
        }
      }


      const update = new Chapter(form)
      for (const field in update.toObject()) {
        if (update[field] != null && field != '_id') {
          chapter[field] = update[field]
        }
      }

      await chapter.save()

      return sendResponse(res, 201, 'Cập nhật chi đoàn thành công')
    } catch (error) {
      console.log(error?.message)
      return sendResponse(res, 500, error.message)
    }
  }

  return { createChapter, getChaptersInPage, getChapterById, updateChapterById }
}

export default ChapterController()