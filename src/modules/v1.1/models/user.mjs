import mongoose from 'mongoose';
import BaseError from "../../../core/models/baseError";
import bcrypt from "bcrypt-nodejs";

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
    validator: v => /.{5}/.test(v),
    required: [true, 'Password required']
  },
  salt: {
    type: String,
    required: false
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

userSchema.statics.login = async function (data) {
  const {email, password} = data;

  const user = await this.findOne({ email });
  const hash = await generateHash(user.salt, password);

  return hash == user.password ? user : null;
};

userSchema.statics.findUsers = async function (query) {
  let result = [];
  const users = await this.find(query);
  users.forEach(user => result.push(this.getPublicProps(user)));

  return result;
};

userSchema.statics.updateUser = async function (id, data) {
  const {result, message, user, data: validData} = await this.validateData(id, data);

  if (!result) {
    throw new BaseError(422, "", message);
  }

  Object.keys(validData).forEach(k => {
    user[k] = validData[k];
  });

  const updatedUser = await user.save();

  return this.getPublicProps(updatedUser);
};

userSchema.statics.validateData = async function (id, data) {
  const user = await this.findById(id);

  if (!user) {
    throw new BaseError(422, "User not found");
  }

  const result = {
    user,
    result: true,
    message: null,
    data
  };

  const {
    current_password : curPass = null,
    new_password : newPass = null
  } = data;

  if (curPass && newPass) {
    const hash  = await generateHash(user.salt, curPass);

    if (hash != user.password) {
      result.result = false;
      result.message = {field: "current_password", message: "Wrong current password"};
    } else {
      result.data.password = newPass;
    }

    delete result.data.new_password;
    delete result.data.current_password;
  }

  return result;
};


userSchema.pre('save', async function (next) {
  const user = this;
  if (!user.isModified('password')) {
    return next();
  }

  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }

    generateHash(salt, user.password)
        .then(hash => {
          user.password = hash;
          user.salt = salt;
          next();
        })
        .catch(next);

  });
});

function generateHash (salt, password) {
  return new Promise((resolve, reject) => {
   bcrypt.hash(password, salt, null, (error, hash) => {
     if (error) {
       reject(new BaseError(422, error.message));
     }

     resolve(hash);
   });
 });
}

export default mongoose.model('User', userSchema);
