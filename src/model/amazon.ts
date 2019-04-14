import mongoose from 'mongoose';

const amazonSchema = new mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  id: { 
    type: String, 
    reqierd: true, 
    unique: true,
    dropDups: true,
  },
  images: { type: Array },
  title: { type: String, reqierd: false },
  about: { type: String, reqierd: false },
  description: { type: String, reqierd: false },
  price: { type: String, reqierd: false },
  availability: { type: String, reqierd: false },
});

export default mongoose.model('amazon', amazonSchema);