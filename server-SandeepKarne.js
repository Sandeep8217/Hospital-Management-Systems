const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');

// Route Imports
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');
const appointmentRoutes = require('./routes/appointments');
const doctorRoutes = require('./routes/doctors');
const paymentRoutes = require('./routes/payment');

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: 'CEomrMEHR1NWhRYytT6b4oBV',
    resave: false,
    saveUninitialized: false,
}));

// Static Files
app.use(express.static(path.join(__dirname, 'view')));
app.use('/images', express.static('images'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// View Engine
app.set('view engine', 'ejs');

// Routes
app.use(authRoutes);
app.use('/admin', adminRoutes);
app.use('/user', userRoutes);
app.use('/user', paymentRoutes); // Mounted correctly
app.use(appointmentRoutes);
app.use(doctorRoutes);

// Default Route
app.get('/', (req, res) => {
    res.render('index');
});

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/hospital-management', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB.');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

// Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
