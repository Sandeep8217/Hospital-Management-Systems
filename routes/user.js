// routes/user.js
const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const Message = require('../models/Message');
const User = require('../models/User'); // Adjust the path if needed


// User Dashboard
router.get('/dashboard',  (req, res) => {
    res.render('user/dashboard');
});
// router.get('/dashboard', (req, res) => {
//     if (!req.session.userId) {
//         return res.redirect('/login');
//     }

//     res.render('user/dashboard');
// });
router.get('/', (req, res) => {
  res.render('user/dashboard');  // Same dashboard view
});


// View Doctors
router.get('/doctors',  async (req, res) => {
    try {
        const doctors = await Doctor.find();
        res.render('user/viewDoctors', { doctors });
    } catch (error) {
        console.error('Error fetching doctors:', error);
        res.status(500).send('Server Error');
    }
});

// Book an Appointment - Form
router.get('/appointments/new',  async (req, res) => {
    try {
        const doctors = await Doctor.find();
        res.render('user/bookAppointment', { doctors });
    } catch (error) {
        console.error('Error fetching doctors:', error);
        res.status(500).send('Server Error');
    }
});



router.post('/appointments', async (req, res) => {
    try {
        const { doctorId, date, time } = req.body;

        // Check if user is logged in
        if (!req.session.userId) {
            return res.status(400).send('User not logged in or session expired');
        }

        // Create a new appointment with the correct userId and doctorId
        const newAppointment = new Appointment({
            userId: req.session.userId, // Get userId from session
            doctorId,                   // Get doctorId from form data
            date,
            time
        });

        await newAppointment.save();
        res.redirect('/user/viewAppointments');
    } catch (error) {
        console.error('Error booking appointment:', error);
        res.status(500).send('Error booking appointment');
    }
});




router.get('/ViewAppointments', async (req, res) => {
    try {
        // Check if user is logged in
        if (!req.session.userId) {
            return res.status(401).send('User not logged in');
        }

        // Fetch appointments for the logged-in user
        const appointments = await Appointment.find({ 
            userId: req.session.userId // Filter by logged-in user
        }).populate('doctorId'); // Populate to get doctor details

        if (appointments.length === 0) {
            return res.render('user/viewAppointments', { appointments: null, message: 'You have no appointments scheduled.' });
        }

        res.render('user/viewAppointments', { appointments, message: null });
    } catch (error) {
        console.error('Error retrieving appointments:', error);
        res.status(500).send('Server Error');
    }
});





router.get('/ViewMessages', async (req, res) => {
    try {
        const userId = req.session.userId;

        // Fetch all messages where the user is the recipient
        const messages = await Message.find({ recipient: userId }).populate('sender', 'username');

        // Pass the messages to the EJS template
        res.render('user/viewMessages', { messages });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).send('Error fetching messages');
    }
});


// Send a Message - Form
router.get('/messages/new', async (req, res) => {
    try {
        // Fetch recipients (e.g., admins or doctors)
        const recipients = await User.find({ isAdmin: true }).exec(); // Assuming admins and doctors are stored in the User model
        // const recipients = await User.find({ _id: { $ne: req.session.userId } }).exec();
        // const recipients = await User.find({ _id: { $ne: req.session.userId } });
        res.render('user/sendMessages', { recipients });
    } catch (error) {
        console.error('Error fetching recipients:', error);
        res.status(500).send('Server Error');
    }
});

router.post('/messages', async (req, res) => {
    try {
        const { recipientId, subject, body } = req.body;
        // console.log('Received data:', req.body); // Check the form data received
        console.log('Form Data:', { recipientId, subject, body  }); // Debugging line
        
        // Ensure the user is logged in
        if (!req.session.userId) {
            return res.status(401).send('User not logged in or session expired');
        }

        const newMessage = new Message({
            sender: req.session.userId,
            recipient: recipientId,
            subject,
            body,  // or body: body depending on your schema

            dateSent: new Date()
        });

        await newMessage.save();
        res.redirect('/user/viewMessages'); // Redirect after sending the message
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).send('Error sending message');
    }
});



module.exports = router;
