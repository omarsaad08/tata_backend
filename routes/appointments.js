const express = require('express');
const router = express.Router();
const controller = require('../controllers/appointments_controller');

router.get('/', controller.getAllAppointments);
router.post('/', controller.postAppointment);
router.get('/next/doctor/:id', controller.getNextAppointment);
router.get('/next/:id', controller.getNextappointmentForBaby);
router.get('/today/:id', controller.getTodaysAppointments);
router.get('/token', controller.generateToken);
router.patch('/:id', controller.updateAppointment);
router.get('/previous/:id', controller.fetchPreviousBookingsForBaby);
router.get('/:status/:id', controller.getRequestedAppointments);

module.exports = router;