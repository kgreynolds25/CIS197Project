var mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema({
  paymentAmount: { type: String},
  author: { type: String },
  receiver: { type: String }
})

module.exports = mongoose.model('Payment', paymentSchema);
