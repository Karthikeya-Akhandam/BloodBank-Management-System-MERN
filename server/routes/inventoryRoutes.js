const express = require('express');
const router = express.Router();
const { getMe, updateInventory, getAllInventories } = require('../controllers/inventoryController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.get('/me', protect, authorize('organization'), getMe);
router.put('/update', protect, authorize('organization'), updateInventory);
router.get('/', protect, getAllInventories);

module.exports = router;
