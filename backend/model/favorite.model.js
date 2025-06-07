import { model, Schema } from "mongoose";

const FavoriteSchema = new Schema({

  accountId: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
  eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
 
}, { timestamps: true });

const Favorite = model('Favorite', FavoriteSchema);

export default Favorite;
