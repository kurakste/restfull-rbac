import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  itemId: mongoose.Types.ObjectId,
  name: { type: String, reqierd: false },
  link: { type: String, reqierd: false },
  comment: { type: String, reqierd: false }
});

export default mongoose.model('suppliers', itemSchema);