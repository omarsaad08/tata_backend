const express = require('express');
const router = express.Router();
const controller = require('../controllers/payment_controller');

router.get('/success', controller.getSuccess);
router.get('/fail', controller.getFail);

module.exports = router;