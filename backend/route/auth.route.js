import express from 'express'
import { uploadAvatar } from '../middleware/upload.js'

import AuthController from '../controller/auth.controller.js'

const AuthRoute = express.Router()
//
AuthRoute.get('/', AuthController.getProfile)
AuthRoute.put('/', uploadAvatar, AuthController.updateProfile)
AuthRoute.post('/login', AuthController.login)
AuthRoute.post('/register', AuthController.register)


export default AuthRoute