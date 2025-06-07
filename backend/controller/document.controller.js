import Document from "../model/document.model.js";
import { deleteFromCloudinary, deleteRawFromCloudinary } from "../utils/crud/index.js";
import { sendResponse } from "../utils/response.js";
import { checkDuplicated, validateDocumentForm } from "../utils/validation/index.js";

const DocumentController = () => {
  const createDocument = async (req, res) => {
    try {
      const form = req.body
      const file = req.uploadedFile
      console.log(form, file)

      const validation = validateDocumentForm(form)
      if (!validation.isValid) {
        return sendResponse(res, 400, validation.message)
      }
      const duplication = await checkDuplicated(Document, 'docCode', form.docCode)

      if (duplication.isDuplicated) {
        return sendResponse(res, 400, 'Tài liệu đã tồn tại')
      }

      if (!file) {
        return sendResponse(res, 400, 'Bạn cần phải thêm file pdf')
      }
      const document = new Document(form)

      document.file = file

      await document.save()

      return sendResponse(res, 200, 'Tạo tài liệu thành công', document)

      // TODO: Implement create logic
    } catch (error) {
      console.log(error?.message);
      return sendResponse(res, 500, error.message);
    }
  };

  const getDocumentsInPage = async (req, res) => {
    try {

      const {
        page = 1,
        limit = 5,
        search,
        scope
      } = req.query;

      const filter = {};
      // Tìm kiếm gần đúng theo email, phone, fullname
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: "i" } },
          { issuer: { $regex: search, $options: "i" } }
        
        ];
      }

      if (scope) {
        filter.scope = scope;
      }

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: {
          "createdAt": 1
        },
        populate: 'chapterId'
      };

      const result = await Document.paginate(filter, options);
      return sendResponse(res, 200, 'Lấy danh sách tài liệu thành công', result)

    } catch (error) {
      console.log(error?.message)
      return sendResponse(res, 500, error.message)
    }
  };

  const getDocumentById = async (req, res) => {
    try {
      const { id } = req.params

      const document = await Document.findById(id).populate('chapterId')

      return sendResponse(res, 200, 'Lấy thông tin tài liệu thành công', document)

    } catch (error) {
      console.log(error?.message)
      return sendResponse(res, 500, error.message)
    }
  };

  const updateDocumentById = async (req, res) => {
    try {
      const { id } = req.params
      const form = req.body
      const file = req.uploadedFile

      const document = await Document.findById(id)

      const validation = validateDocumentForm(form, true)
      if (!validation.isValid) {
        return sendResponse(res, 400, validation.message)
      }

      if (form.docCode) {
        const duplication = await checkDuplicated(Document, 'docCode', form.docCode)
        if (duplication.isDuplicated) {
          return sendResponse(res, 400, duplication.message)
        }
      }

      const update = new Document(form)
      for (const field in update.toObject()) {
        if (update[field] != null && field != '_id') {
          document[field] = update[field]
        }
      }

      if (file) {
        if (document.file?.public_id) {
          deleteRawFromCloudinary(document.file?.public_id)
        }
        document.file = file
      }

      await document.save()
      return sendResponse(res, 200, 'Cập nhật thông tin tài liệu thành công', document)
    } catch (error) {
      console.log(error?.message)
      return sendResponse(res, 500, error.message)
    }
  };

  const deleteDocumentById = async (req, res) => {
    try {
      const { id } = req.params
      await Document.findByIdAndDelete(id)
      return sendResponse(res, 200, 'Xóa tài liệu thành công')
    } catch (error) {
      console.log(error?.message);
      return sendResponse(res, 500, error.message);
    }
  };

  return {
    createDocument,
    getDocumentsInPage,
    getDocumentById,
    updateDocumentById,
    deleteDocumentById
  };

}

export default DocumentController()