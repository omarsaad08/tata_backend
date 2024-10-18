const express = require('express');
const router = express.Router();
const controller = require('../controllers/appointments_controller');

router.post('/', controller.postAppointment);

module.exports = router;