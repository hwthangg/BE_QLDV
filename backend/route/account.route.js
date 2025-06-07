import express from 'express'
import { uploadAvatar } from '../middleware/upload.js'
import AccountController from '../controller/account.controller.js'

const AccountRoute = express.Router()

AccountRoute.post('/', uploadAvatar, AccountController.createAccount)
AccountRoute.get('/', AccountController.getAccountsInPage)
AccountRoute.get('/:id', AccountController.getAccountById)
AccountRoute.put('/:id',uploadAvatar, AccountController.updateAccountById)

export default AccountRoute