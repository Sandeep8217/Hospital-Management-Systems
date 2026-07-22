console.log("payment.js loaded");
const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');

// Route to render payment form
router.get('/pay', (req, res) => {
  res.render('user/pay');
  // res.send("Payment route is working");
});
// router.get('/pay', (req, res) => {
//     console.log("PAY ROUTE HIT");
//     res.send("Payment route working");
// });

// router.get('/hello', (req, res) => {
//     res.send("Hello");
// });

// Route to handle payment save request
router.post('/save-payment', async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
    //   razorpay_signature,
      amount
    } = req.body;

    const payment = new Payment({
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      amount: amount,
      currency: 'INR',
      status: 'captured'
    });

    await payment.save();

    res.status(201).json({ success: true, message: 'Payment details saved successfully' });
  } catch (error) {
    console.error('Error saving payment:', error);
    res.status(500).json({ success: false, message: 'Failed to save payment' });
  }
});

module.exports = router;
