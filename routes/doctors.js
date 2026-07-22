const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');

// View all doctors
router.get('/doctors', async (req, res) => {
    try {
        const doctors = await Doctor.find();
        res.render('doctors/index', { doctors });
    } catch (err) {
        res.status(500).send('Error retrieving doctors.');
    }
});

module.exports = router;
