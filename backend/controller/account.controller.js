
import Account from "../model/account.model.js"
import { comparePassword, hashPassword } from "../utils/hash/index.js"
import { sendResponse } from "../utils/response.js"
import { checkDuplicated, validateAccountForm } from "../utils/validation/index.js"
import { deleteFromCloudinary } from "../utils/crud/index.js"
import { signToken } from "../utils/jwt.js"


const AccountController = () => {
  const createAccount = async (req, res) => {
    try {
      const form = req.body
      const avatar = req.uploadedFile
      console.log(form, avatar)

      const validation = validateAccountForm(form)
      if (!validation.isValid) {
        return sendResponse(res, 400, validation.message)
      }

      const duplication = await checkDuplicated(Account, 'email', form.email)
      if (duplication.isDuplicated) {
        return sendResponse(res, 400, duplication.message)
      }

      const password = await hashPassword(form.password)

      const account = new Account({ ...form, password: password, avatar: avatar || null, status: form?.status || 'pending' })
      await account.save()

      return sendResponse(res, 201, 'Tạo tài khoản thành công')

    } catch (error) {
      console.log(error?.message)
      return sendResponse(res, 500, error.message)
    }
  }

  const getAccountsInPage = async (req, res) => {
    try {

      const {
        page = 1,
        limit = 5,
        search,
        status,
        role
      } = req.query;

      const filter = {};
      // Tìm kiếm gần đúng theo email, phone, fullname
      if (search) {
        filter.$or = [
          { email: { $regex: search, $options: "i" } },
          { phone: { $regex: search, $options: "i" } },
          { fullname: { $regex: search, $options: "i" } },
        ];
      }
      // Lọc theo status nếu có
      if (status) {
        filter.status = status;
      }
      // Lọc theo role nếu có
      if (role) {
        filter.role = role;
      }
      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: {
          "createdAt": 1
        },
        populate: 'chapterId'
      };

      const result = await Account.paginate(filter, options);
      return sendResponse(res, 200, 'Lấy danh sách tài khoản thành công', result)

    } catch (error) {
      console.log(error?.message)
      return sendResponse(res, 500, error.message)
    }
  }

  const getAccountById = async (req, res) => {
    try {
      const { id } = req.params

      const account = await Account.findById(id).populate('chapterId')

      console.log(id)

      return sendResponse(res, 200, 'Lấy thông tin tài khoản thành công', account)

    } catch (error) {
      console.log(error?.message)
      return sendResponse(res, 500, error.message)
    }
  }

  const updateAccountById = async (req, res) => {
    try {
      const { id } = req.params
      const form = req.body
      const avatar = req.uploadedFile

      const account = await Account.findById(id)

      const validation = validateAccountForm(form, true)
      if (!validation.isValid) {
        return sendResponse(res, 400, validation.message)
      }

      if (form.email) {
        const duplication = await checkDuplicated(Account, 'email', form.email)
        if (duplication.isDuplicated) {
          return sendResponse(res, 400, duplication.message)
        }
      }

      const update = new Account(form)
      for (const field in update.toObject()) {
        if (update[field] != null && field != '_id') {
          account[field] = update[field]
        }
      }

      if (avatar) {
        if (account.avatar?.public_id) {
          deleteFromCloudinary(account.avatar?.public_id)
        }
        account.avatar = avatar
      }

      await account.save()
      return sendResponse(res, 200, 'Cập nhật thông tin tài khoản thành công', account)
    } catch (error) {
      console.log(error?.message)
      return sendResponse(res, 500, error.message)
    }
  }


  return { createAccount, getAccountsInPage, getAccountById, updateAccountById }
}

export default AccountController()