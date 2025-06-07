import { model, Schema } from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';
const EventSchema = new Schema({
  status: {
    type: String,
    enum: ['completed', 'doing', 'pending', 'canceled'],
    default: null
  },
  name: {
    type: String,

    default: null
  },

  startedAt: {
    type: Date,
    default: null
  },

  location: {
    type: String,
    default: null
  },

  description: {
    type: String,
    default: null
  },
  images: {
    type: [Object],
    default: null
  },
  scope: {
    type: String,
    enum: ['public', 'chapter'],
    default: null
  },
  chapterId: {
    type: Schema.Types.ObjectId,
    default: null,
    ref: 'Chapter'
  },

}, { timestamps: true });

EventSchema.plugin(mongoosePaginate);

const Event = model('Event', EventSchema);
export default Event;
