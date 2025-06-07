import express from 'express'
import RegistrationController from '../controller/registration.controller.js'


const RegistrationRoute = express.Router()

RegistrationRoute.post('/', RegistrationController.createRegistration)
RegistrationRoute.patch('/:id', RegistrationController.checkIn)


export default RegistrationRoute