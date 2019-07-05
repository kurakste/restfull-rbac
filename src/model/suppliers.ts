import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  id: { type: String },
  name: { type: String, reqierd: false },
  link: { type: String, reqierd: false },
  price: { type: Number, required: false },
  delivery: { type: Number, required: false },
  amount: { type: Number, required: false },
  minlot: { type: Number, required: false },
  lotcost: { type: Number, required: false },
  comment: { type: String, reqierd: false }
});

export default mongoose.model('suppliers', itemSchema);