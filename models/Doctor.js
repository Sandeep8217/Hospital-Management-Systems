// models/Doctor.js
const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    speciality: { type: String, required: true },
    contact: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    Achievements: { type: String, required: true },
    photo: { type: String, required: true }
});

const Doctor = mongoose.model('Doctor', doctorSchema);
module.exports = Doctor;
