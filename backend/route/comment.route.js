import express from 'express'

import CommentController from '../controller/comment.controller.js'

const CommentRoute = express.Router()

CommentRoute.post('/', CommentController.createComment)
CommentRoute.get('/', CommentController.getComments)
CommentRoute.patch('/:id', CommentController.reportComment)


export default CommentRoute