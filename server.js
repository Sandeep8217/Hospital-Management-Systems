require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');
const appointmentRoutes = require('./routes/appointments');
const doctorRoutes = require('./routes/doctors');
const paymentRoutes = require('./routes/payment');

const session = require('express-session');
const router = require('./routes');


const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// Session setup
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));
app.use(express.static(path.join(__dirname, 'view')));
app.set('view engine', 'ejs');

// app.js or server.js
// app.use('/images', express.static('images'));
app.use('/images', express.static(path.join(__dirname, 'images')));


// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Routes
// app.use(expressLayouts);
app.use(authRoutes);
app.use('/admin',adminRoutes);
app.use('/user',userRoutes);
app.use(appointmentRoutes);
app.use(doctorRoutes);
app.use('/user', paymentRoutes);


// app.js or server.js
// app.use('/images', express.static('path/to/your/images/directory'));



// MongoDB Connection
// mongoose.connect('mongodb://localhost:27017/hospital-management', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// }).then(() => {
//     console.log('Connected to MongoDB.');
// }).catch(err => {
//     console.error('MongoDB connection error:', err);
// });
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log("Connected to MongoDB Atlas");
})
.catch(err => {
    console.error(err);
});

app.get('/',(req,res) => {
 res.render('index');
});
// Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
