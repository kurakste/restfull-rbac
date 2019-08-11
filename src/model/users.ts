import mongoose from 'mongoose';
import { Document } from 'mongoose'; 
import Roles from '../interfaces/roles';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId,
  name: string,
  email: string,
  password: string,
  role: number,
  fba: boolean,
  active: boolean
}

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
  fba: {type: Boolean, default: false },
  active: {type: Boolean, default: true },
});

export default mongoose.model<IUser>('users', userSchema);