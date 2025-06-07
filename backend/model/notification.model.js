import { model, Schema } from "mongoose";

const NotificationSchema = new Schema({
  text: {
    type: String,
    required: true
  },
  receiver: {
    type: Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
}, { timestamps: true });

const Notification = model('Notification', NotificationSchema);
export default Notification;
