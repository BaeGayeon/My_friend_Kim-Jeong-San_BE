const express = require('express');
const paymentController = require('../controllers/paymentController');
const router = express.Router();

router.get('/:roomId/room', paymentController.getRoomPayments);
router.post('/vote', paymentController.doVote);
router.patch('/vote', paymentController.doVoteAgain);

module.exports = router;
