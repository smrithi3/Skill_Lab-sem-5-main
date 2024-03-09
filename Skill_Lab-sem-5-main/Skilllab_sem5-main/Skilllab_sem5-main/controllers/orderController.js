// orderController.js
const Order = require('../models/order');
const nodemailer = require('nodemailer');

exports.sendOTP = async (req, res) => {
  const userId = req.params.userId;

  try {
    // Generate OTP (you may use a library for this)
    const otp = '123456'; // Replace with your OTP generation logic

    // Save OTP to the user's order
    const order = new Order({ userId, otp });
    await order.save();

    // Send OTP through email
    const user = await User.findById(userId);
    const email = user.email;

    // Create a nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'your_email@gmail.com', // Replace with your Gmail email
        pass: 'your_email_password' // Replace with your Gmail password
      }
    });

    // Define email options
    const mailOptions = {
      from: 'your_email@gmail.com',
      to: email,
      subject: 'Order OTP Verification',
      text: `Your OTP for order verification is: ${otp}`
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const cron = require('node-cron');

// Schedule task to cancel orders after 20 minutes
cron.schedule('*/20 * * * *', async () => {
  try {
    // Find orders that are still pending and older than 20 minutes
    const ordersToCancel = await Order.find({
      status: 'pending',
      createdAt: { $lte: new Date(Date.now() - 20 * 60 * 1000) }
    });

    // Cancel each order
    for (const order of ordersToCancel) {
      order.status = 'canceled';
      await order.save();
    }

    console.log('Canceled orders:', ordersToCancel.length);
  } catch (error) {
    console.error('Error canceling orders:', error);
  }
});
