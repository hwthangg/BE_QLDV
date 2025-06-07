import express from 'express'
import FavoriteController from '../controller/favorite.controller.js'


const FavoriteRoute = express.Router()

FavoriteRoute.post('/', FavoriteController.like)
FavoriteRoute.get('/', FavoriteController.getLikes)
FavoriteRoute.delete('/:id', FavoriteController.unlike)

export default FavoriteRoute