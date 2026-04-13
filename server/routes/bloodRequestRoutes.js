const express = require('express');
const router = express.Router();
const { createRequest, getMyRequests, getOrgRequests, updateRequestStatus } = require('../controllers/bloodRequestController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.post('/create', protect, authorize('hospital'), createRequest);
router.get('/my', protect, authorize('hospital'), getMyRequests);
router.get('/org', protect, authorize('organization'), getOrgRequests);
router.put('/:id/status', protect, authorize('organization'), updateRequestStatus);

module.exports = router;
