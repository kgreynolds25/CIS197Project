const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema({
  paymentAmount: { type: Number },
  author: { type: String },
  receiver: { type: String }
})

module.exports = mongoose.model('Payment', paymentSchema);
