import { model, Schema } from "mongoose";

const RegistrationSchema = new Schema({
  status: {
    type: String,
    enum: ['registered', 'attended'],
    default: 'registered'
  },

  accountId: {
    type: Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  eventId: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
}, { timestamps: true });

const Registration = model('Registration', RegistrationSchema);

export default Registration;
