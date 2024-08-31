const express = require('express');
const router = express.Router();
const { sendAlert } = require('../controllers/emergencyCallController'); 

router.post('/send-alert', sendAlert);

module.exports = router;
