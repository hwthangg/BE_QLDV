import { model, Schema } from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const CommentSchema = new Schema({
  status: {
    type: String,
    enum: ['actived', 'locked'],
    default: 'actived'
  },
  accountId: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
  eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
  comment: { type: String, required: true },
  report: { type: Number, default: 0 } // ví dụ đếm số lượt báo cáo
}, { timestamps: true });

CommentSchema.plugin(mongoosePaginate);


const Comment = model('Comment', CommentSchema);

export default Comment;
