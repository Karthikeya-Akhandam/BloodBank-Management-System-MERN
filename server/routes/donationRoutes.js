const express = require('express');
const router = express.Router();
const { bookSlot, getMyDonations, getOrgDonations, updateDonationStatus, downloadCertificate } = require('../controllers/donationController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.post('/book', protect, authorize('donor'), bookSlot);
router.get('/my', protect, authorize('donor'), getMyDonations);
router.get('/org', protect, authorize('organization'), getOrgDonations);
router.put('/:id/status', protect, authorize('organization'), updateDonationStatus);
router.get('/:id/certificate', protect, authorize('donor'), downloadCertificate);

module.exports = router;
