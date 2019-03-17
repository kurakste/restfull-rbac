import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  email: { 
      type: String, 
      reqierd: true, 
      unique: true,
      match: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
  },
  password: { type: String, reqierd: true },
  quantity: { type: Number, default: 1 }

});

export default mongoose.model('users', userSchema);