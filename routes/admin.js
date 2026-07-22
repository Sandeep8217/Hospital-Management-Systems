const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const Message = require('../models/Message');
const User = require('../models/User');
const { Error } = require('mongoose');
const multer = require('multer');
const path = require('path');

// Set up multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Folder where images will be stored
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    },
  });
  const upload = multer({ storage: storage });

//route to add dcotors

router.get('/doctors/add',(req,res) => {
    res.render('admin/addDoctor');
});

// Add a doctor
// router.post('/addDoctor', async (req, res) => {

// const { name, specialty,contact,email } = req.body;
// try {
//     const newDoctor = new Doctor({ name, specialty,contact,email });
//     await newDoctor.save();
//     res.redirect('/admin/doctors');
// } catch (err) {
//     res.status(500).send('Error adding doctor.');
// }
// });

router.post('/addDoctor', upload.single('photo'), async (req, res) => {
    const { fullName, speciality, contact, email,Achievements } = req.body;
    const photoUrl = req.file ? `/uploads/${req.file.filename}` : '';
  
    const newDoctor = new Doctor({
      fullName,
      speciality,
      contact,
      email,
      Achievements,
      photo: photoUrl
    });
  
  
    console.log('Form data:', req.body);
    console.log('Uploaded file:', req.file);
  
    try {
      await newDoctor.save();
      res.redirect('/admin/doctors'); // Redirect to view doctors page
    } catch (error) {
      console.error('Error saving doctor details:', error);
      res.status(500).send('Error saving doctor details.');
    }
  });

// Admin Dashboard Route
router.get('/dashboard', (req, res) => {
    res.render('admin/dashboard');
});

// just add an / in front of all codes like for egample in router.get(/this slash add in front opf all as /appointments then whole code works fine)

// View all appointments
router.get('/appointments', async (req, res) => {
    try {
        const appointments = await Appointment.find()
            .populate('userId', 'username') // Populate with user information
            .populate('doctorId', 'fullName');  // Populate with doctor information

        res.render('admin/appointments', { appointments });
    } catch (error) {
        console.error('Error retrieving appointments:', error);
        res.status(500).send('Error retrieving appointments');
    }
});



router.post('/appointments/:id/status', async (req, res) => {
    try {
        const appointmentId = req.params.id;
        const newStatus = req.body.status;

        // Find the appointment by ID and update its status
        await Appointment.findByIdAndUpdate(appointmentId, { status: newStatus });

        // Redirect back to the view appointments page
        res.redirect('/admin/appointments');
    } catch (error) {
        console.error('Error updating appointment status:', error);
        res.status(500).send('Error updating appointment status');
    }
});

// View all doctors
router.get('/doctors', async (req, res) => {
    try {
        const doctors = await Doctor.find();
        res.render('admin/doctors', { doctors });
    } catch (err) {
        res.status(500).send('Error retrieving doctors.');
    }
});


// Route to render Add Admin form
router.get('/admins/add', async (req, res) => {
    res.render('admin/admins'); // Make sure this view exists
});



// Route to handle adding a new admin
router.post('/admins/add', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const newAdmin = new User({ username, email, password, isAdmin: true });
        await newAdmin.save();
        res.send('admin added successfully');
       // res.redirect('/viewadmins'); // Redirect to view admins page after successful addition
    } catch (error) {
        console.error('Error adding admin:', error);
        res.status(500).send('Error adding admin');
    }
});

// Route to view all admins
router.get('/admins', async (req, res) => {
    try {
        const admins = await User.find({ isAdmin: true }); // Fetch all admins from the database
        res.render('admin/viewadmins', { admins });
    } catch (error) {
        console.error('Error fetching admins:', error);
        res.status(500).send('Error fetching admins');
    }
});


router.get('/messages', async (req, res) => {
    try {
        const messages = await Message.find().populate('sender').populate('recipient');
        res.render('admin/messages', { messages });
    } catch (error) {
        console.error('Error retrieving messages:', error);
        res.status(500).send('Error retrieving messages');
    }
});


router.get('/dashboard', (req, res) => {
    res.render('adminDashboard');
});

// Logout Route
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/views/index');
        }
        res.clearCookie('sid');
        res.redirect('/');
    });
});
// Route to show the reply form
router.get('/replyMessage/:messageId', async (req, res) => {
    try {
        const message = await Message.findById(req.params.messageId).populate('sender').exec();
        if (!message) {
            return res.status(404).send('Message not found');
        }

        res.render('admin/replyMessage', { message });
    } catch (error) {
        console.error('Error fetching message:', error);
        res.status(500).send('Server Error');
    }
});



router.post('/replyMessage/:messageId', async (req, res) => {
    try {
        const { subject, body } = req.body; // Use 'body' to get the message content
        const { messageId } = req.params;
        console.log('Form Data:', req.body);

        // Ensure the admin is logged in
        if (!req.session.userId || !req.session.isAdmin) {
            return res.status(401).send('Admin not logged in or session expired');
        }

        // Fetch the original message
        const originalMessage = await Message.findById(messageId);
        if (!originalMessage) {
            return res.status(404).send('Original message not found');
        }

        // Create a new reply message
        const replyMessage = new Message({
            sender: req.session.userId,
            recipient: originalMessage.sender,
            subject: subject || `Re: ${originalMessage.subject}`,
            body, // Use the 'body' variable from req.body
            dateSent: new Date(),
        });

        await replyMessage.save();
        // res.redirect('/admin/messages');
        res.send('replyed to user sucessfully');
        res.render('admin/dashboard');
    } catch (error) {
        console.error('Error sending reply:', error);
        res.status(500).send('Error sending reply');
    }
});


module.exports = router;
