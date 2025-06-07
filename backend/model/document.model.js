import { model, Schema } from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const DocumentSchema = new Schema({
  docCode: {
    type: String,
    default: null
  },
  name: {
    type: String,
    default: null
  },
  description: {
    type: String,
    default: null
  },
  issuer: {
    type: String,
    default: null
  },
  issuedAt: {
    type: Date,
    default: null
  },
  file: {
    type: Object,
    default: null
  },
  scope: {
    type: String,
    enum: ['chapter', 'private'],
    default: null
  },
  chapterId: {
    type: Schema.Types.ObjectId,
    default: null,
    ref: 'Chapter'
  },
}, { timestamps: true });

DocumentSchema.plugin(mongoosePaginate);

const Document = model('Document', DocumentSchema);
export default Document;
