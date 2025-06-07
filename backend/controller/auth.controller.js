import Account from "../model/account.model.js"
import { deleteFromCloudinary } from "../utils/crud/index.js"
import { comparePassword, hashPassword } from "../utils/hash/index.js"
import { signToken } from "../utils/jwt.js"
import { sendResponse } from "../utils/response.js"
import { checkDuplicated, validateAccountForm } from "../utils/validation/index.js"

const AuthController = () => {
  const login = async (req, res) => {
    try {
      const form = req.body
      const account = await Account.findOne({ email: form.email })
      if (!account) {
        return sendResponse(res, 404, 'Email chưa được đăng ký')
      }

      if (account.status == 'pending') {
        return sendResponse(res, 403, 'Tài khoản chưa được duyệt')
      }
      else if (account.status == 'locked') {
        return sendResponse(res, 403, 'Tài khoản bị khóa')
      }

      const correct = await comparePassword(form.password, account.password)
      if (correct) {
        const token = signToken({ id: account._id })
        return sendResponse(res, 200, 'Đăng nhập thành công', { token: token, account: account })
      }
      else {
        return sendResponse(res, 401, 'Email hoặc mật khẩu không đúng')
      }

    } catch (error) {
      console.log(error?.message)
      return sendResponse(res, 500, error.message)
    }
  }

  const register = async (req, res) => {
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

      const account = new Account({ ...form, password: password, avatar: avatar || null, status: 'pending' })
      await account.save()



      return sendResponse(res, 201, 'Tạo tài khoản thành công')

    } catch (error) {
      console.log(error?.message)
      return sendResponse(res, 500, error.message)
    }
  }

  const getProfile = async (req, res) => {
    try {
      const id = req.userId

      const account = await Account.findById(id)

      return sendResponse(res, 200, 'Lấy hồ sơ thành công', account)

    } catch (error) {
      console.log(error?.message)
      return sendResponse(res, 500, error.message)
    }
  }

  const updateProfile = async(req,res)=>{
     try {
      const id = req.userId
      const form = req.body
      const avatar = req.uploadedFile

      const account = await Account.findById(id)
      console.log(id, account, form, avatar)

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

  return { login, register, getProfile, updateProfile }
}

export default AuthController()