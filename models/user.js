const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: { type: String },
  password: { type: String },
  money: { type: Number }
})

module.exports = mongoose.model('User', userSchema);
