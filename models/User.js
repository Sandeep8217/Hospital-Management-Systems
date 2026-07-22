// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//     username: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     isAdmin: { type: Boolean, default: false }
// });

// const User = mongoose.model('User', userSchema);
// module.exports = User;

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    dob: { type: Date, required: true },  // Date of Birth
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },  // Gender
    // countryCode: { type: String, required: true },  // Country code
    mobile: { type: String, required: true },  // Mobile number
    address: { type: String, required: true },  // Address
    reason: { type: String, required: true },  // Reason for visit / Current symptoms
    emergencyName: { type: String, required: true },  // Emergency contact name
    emergencyNumber: { type: String, required: true },  // Emergency contact number
    bloodGroup: { type: String, required: true },  // Blood Group
    allergies: { type: String },  // Allergies
});

const User = mongoose.model('User', userSchema);
module.exports = User;
