import mongoose from 'mongoose';


const { Schema } = mongoose;

// To fix https://github.com/Automattic/mongoose/issues/4291
mongoose.Promise = global.Promise;

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'User name required'],
  },
  email: {
    type: String,
    validate: {
      validator: v =>
         /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v),
      message: '{VALUE} is not a valid email'
    },
    required: [true, 'User email required'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Password required']
  },
  phone: {
    type: String,
    validate: {
      validator: v => /^\+\d{12}$/.test(v),
      message: '{VALUE} is not a valid phone number!'
    },
    required: false
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

userSchema.statics.getPublicProps = function (model) {
  return {
    id: model.id,
    name: model.name,
    email: model.email,
    phone: model.phone || ""
  };
};

userSchema.statics.findUsers = async function (query) {
  let result = [];
  const users = await this.find(query);
  users.forEach(user => result.push(this.getPublicProps(user)));

  return result;
};

export default mongoose.model('User', userSchema);
