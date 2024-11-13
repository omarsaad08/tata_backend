const express = require('express');
const router = express.Router();
const controller = require('../controllers/babies_controller');

router.get('/', controller.getAllBabies);
router.get('/:id', controller.getBabyById);
router.get('/email/:email', controller.getBabyByEmail)
router.post('/', controller.postBaby);
router.put('/', controller.updateBaby);
router.delete('/', controller.deleteBaby);

module.exports = router;