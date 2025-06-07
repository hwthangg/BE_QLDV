import express from 'express'
import DocumentController from '../controller/document.controller.js'
import { uploadPdf } from '../middleware/upload.js'

const DocumentRoute = express.Router()

DocumentRoute.post('/',uploadPdf, DocumentController.createDocument)
DocumentRoute.get('/', DocumentController.getDocumentsInPage)
DocumentRoute.get('/:id', DocumentController.getDocumentById)
DocumentRoute.put('/:id',uploadPdf, DocumentController.updateDocumentById)
DocumentRoute.delete('/:id', DocumentController.deleteDocumentById)

export default DocumentRoute