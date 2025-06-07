import express from 'express'
import ChapterController from '../controller/chapter.controller.js'

const ChapterRoute = express.Router()

ChapterRoute.post('/', ChapterController.createChapter)
ChapterRoute.get('/', ChapterController.getChaptersInPage)
ChapterRoute.get('/:id', ChapterController.getChapterById)
ChapterRoute.put('/:id', ChapterController.updateChapterById)

export default ChapterRoute