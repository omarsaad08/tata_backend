const express = require('express');
const router = express.Router();
const controller = require('../controllers/doctor_availability_controller');

router.get('/', controller.getAllDoctorAvailability);
router.get('/:id', controller.getDoctorsAvailabilityById);
router.post('/', controller.postDoctorAvailability);
router.get('/week/:doctor_id', controller.doctorWeekAvailability);

module.exports = router;