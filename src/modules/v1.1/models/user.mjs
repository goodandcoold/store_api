import mongoose from 'mongoose';
// import uniqueValidator from "mongoose-unique-validator";
const { Schema } = mongoose;

// To fix https://github.com/Automattic/mongoose/issues/4291
mongoose.Promise = global.Promise;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String
  },
  updated: {
    type: Date,
    default: Date.now
  }
});

// userSchema.plugin(uniqueValidator);

export default mongoose.model('User', userSchema);
