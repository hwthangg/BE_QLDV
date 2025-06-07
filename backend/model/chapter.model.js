import { model, Schema } from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const ChapterSchema = new Schema({
  status: {
    type: String,
    enum: ['actived', 'locked'],
    default: null
  },
  name: {
    type: String,
    default: null
  },
  affiliated: {
    type: String,
    default: null
  },
  address: {
    type: String,
    default: null
  },
  establishedAt: {
    type: Date,
    default: null
  }
}, { timestamps: true });

ChapterSchema.plugin(mongoosePaginate);

const Chapter = model('Chapter', ChapterSchema);
export default Chapter;
