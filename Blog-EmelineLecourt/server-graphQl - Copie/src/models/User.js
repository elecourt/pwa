const mongoose = require('mongoose');
const Schema = mongoose.Schema

const userSchema = new Schema({
  email: {
    type: String
  },
  name: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
  },
  password: {
    type: String,
  },
},
{
    timestamps: true
  }
);
module.exports = mongoose.model('User', userSchema);