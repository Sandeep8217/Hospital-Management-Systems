const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { ensureAuthenticated } = require('../middleware/auth');



router.get('/register',(req,res,next) => {
    res.render('register');
});
// Register Route
// router.post('/register', async (req, res) => {
    // const { username, email, password } = req.body;
    router.post('/register', async (req, res) => {
            const {
                username,
                email,
                password,
                dob,
                gender,
                mobile,
                address,
                reason,
                emergencyName,
                emergencyNumber,
                bloodGroup,
                allergies
    } = req.body;

    try {
        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).send('User already exists');
        }

        // Create a new user
        // user = new User({
        //     username,
        //     email,
        //     password // Directly storing the password as requested
        // });
        user = new User({
                        username,
                        email,
                        password,  // Store hashed password
                        dob,
                        gender,
                        mobile,
                        address,
                        reason,
                        emergencyName,
                        emergencyNumber,
                        bloodGroup,
                        allergies
                    });

        await user.save();
        res.redirect('/login');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.get('/login',(req,res,next) => {
    res.render('login');
});

// // Registration Route
// router.post('/register', async (req, res) => {
//     const {
//         username,
//         email,
//         password,
//         dob,
//         gender,
//         countryCode,
//         mobile,
//         address,
//         reason,
//         emergencyName,
//         emergencyNumber,
//         bloodGroup,
//         allergies
//     } = req.body;

//     try {
//         // Check if user already exists
//         let user = await User.findOne({ email });
//         if (user) {
//             return res.status(400).send('User already exists');
//         }

//         // Hash the password before saving
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password, salt);

//         // Create a new user with the provided details
//         user = new User({
//             username,
//             email,
//             password: hashedPassword,  // Store hashed password
//             dob,
//             gender,
//             countryCode,
//             mobile,
//             address,
//             reason,
//             emergencyName,
//             emergencyNumber,
//             bloodGroup,
//             allergies
//         });

//         // Save the user to the database
//         await user.save();
//         res.redirect('/login');
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server error');
//     }
// });

// // Login Route
// router.get('/login', (req, res,next) => {
//     res.render('login');
// });
// Dashboard
router.get('/Dashboard', (req, res) => {
    if (req.session.user) {
        res.render('user/Dashboard'); // Render dashboard view
    } else {
        res.redirect('/login'); // Redirect to login if not authenticated
    }
});


// User Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email: email });
        if (user && user.password === password) { // Passwords are not hashed
            req.session.userId = user._id; // Save user in session
            res.redirect('user/Dashboard'); // Redirect to dashboard after login
        } else {
            res.send('Invalid email or password'); // Handle invalid login
        }
    } catch (error) {
        res.status(500).send('Server error');
    }
});

router.get('/admin/login',(req,res,next) => {
    res.render('admin/login');
});
// Admin Login Route
router.post('/admin/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email, password, isAdmin: true });
        const admin = await User.findOne({ email, isAdmin: true });

        if (!user) {
            return res.status(400).send('Invalid email or password.');
        }
        req.session.userId = admin._id;
        req.session.isAdmin = true; // Optionally set an admin flag
        res.redirect('/admin/dashboard');
    } catch (err) {
        console.error('Error during admin login:', err);
        res.status(500).send('Server error.');
    }
});

// Logout Route
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/dashboard');
        }
        res.clearCookie('sid');
        res.redirect('/');
    });
});



module.exports = router;

