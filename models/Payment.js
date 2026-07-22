const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  paymentId: { type: String, required: true },      // Razorpay payment id
  orderId: { type: String },                         // Razorpay order id (if any)
  amount: { type: Number, required: true },         // Amount paid
  currency: { type: String, default: 'INR' },
  status: { type: String },
  createdAt: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // optional
});

module.exports = mongoose.model('Payment', paymentSchema);
