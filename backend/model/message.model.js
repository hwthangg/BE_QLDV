import { model, Schema } from "mongoose";

const MessageSchema = new Schema({
  status: {
    type: String,
    enum: ['unread', 'read'],
    default: 'unread'
  },
  members: {
    type: [Schema.Types.ObjectId],
    ref: 'Account',
    required: true
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  text: {
    type: String,
    required: true
  }
}, { timestamps: true });

const Message = model('Message', MessageSchema);
export default Message;
