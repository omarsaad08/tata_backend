const express = require('express');
const router = express.Router();
const controller = require('../controllers/follow_up_controller');
router.get('/:id', controller.getAllFollowUps);
router.get('/:id/last', controller.getLastFollowUp);
router.get('/:id/:date', controller.getFollowUpByDate);
router.post('/', controller.postFollowUp);
router.put('/:id', controller.updateFollowUp);
router.delete('/:id/:date', controller.deleteFollowUp);

module.exports = router;