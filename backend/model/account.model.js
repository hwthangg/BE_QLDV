import { model, Schema } from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';
const AccountSchema = new Schema({
  status: {
    type: String,
    enum: ['actived', 'locked', 'pending'],
    default: null
  },
  email: {
    type: String,
    default: null
  },
  phone: {
    type: String,
    default: null
  },
  fullname: {
    type: String,
    default: null
  },
  avatar: {
    type: Object,
    default: null
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    default: null,
  },
  birthday: {
    type: Date,
    default: null
  },
  password: {
    type: String,
    default: null
  },
  role: {
    type: String,
    enum: ['admin', 'manager', 'member'],
    default: null
  },
  chapterId: {
    type: Schema.Types.ObjectId,
    default: null,
    ref: 'Chapter'
  },
  position: {
    type: String,
    type: String,
    enum: ['secretary', 'deputy_secretary', 'executive_member', 'member'],
    default: null,
  },
  cardCode: {
    type: String,
    default: null
  },
  joinedAt: {
    type: Date,
    default: null
  },
  address: {
    type: String,
    default: null
  },
  hometown: {
    type: String,
    default: null
  },
  ethnicity: {
    type: String,
    default: null
  },
  religion: {
    type: String,
    default: null
  },
  eduLevel: {
    type: String,
    default: null
  }
}, { timestamps: true });

AccountSchema.plugin(mongoosePaginate);

const Account = model('Account', AccountSchema);
export default Account;
