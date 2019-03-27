import mongoose from 'mongoose';
import Roles from '../interfaces/roles';

const userSchema = new mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  name: String,
  email: { 
      type: String, 
      reqierd: true, 
      unique: true,
      match: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
  },
  password: { type: String, reqierd: true },
  role: { type: Number, default: Roles.candidate },
  rate: {
    type: Number,
    default: 0
  },
  finerate: {
    type: Number,
    default: 0
  }
});

export default mongoose.model('users', userSchema);