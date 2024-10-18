const express = require('express');
const router = express.Router();
const controller = require('../controllers/doctors_controller');

router.get('/', controller.getAllDoctors);
router.get('/:id', controller.getDoctor);
router.post('/', controller.postDoctor);
router.put('/', controller.updateDoctor);
router.delete('/', controller.deleteDoctor);

module.exports = router;