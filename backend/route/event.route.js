import express from 'express'
import EventController from '../controller/event.controller.js'
import { uploadImages, uploadPdf } from '../middleware/upload.js'

const EventRoute = express.Router()

EventRoute.post('/',uploadImages(10), EventController.createEvent)
EventRoute.get('/', EventController.getEventsInPage)
EventRoute.get('/:id', EventController.getEventById)
EventRoute.put('/:id',uploadImages(10), EventController.updateEventById)







export default EventRoute