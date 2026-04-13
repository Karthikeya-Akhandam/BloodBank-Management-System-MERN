const Inventory = require('../models/Inventory');

// @desc    Get current organization's inventory
// @route   GET /api/inventory/me
// @access  Private (Organization)
exports.getMe = async (req, res) => {
    try {
        let inventory = await Inventory.findOne({ organization: req.user._id });

        if (!inventory) {
            // Create initial inventory if not found
            inventory = await Inventory.create({ organization: req.user._id });
        }

        res.json({ success: true, data: inventory });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update organization's inventory manually
// @route   PUT /api/inventory/update
// @access  Private (Organization)
exports.updateInventory = async (req, res) => {
    try {
        const { bloodGroup, quantity } = req.body; // quantity is the NEW total amount
        
        let inventory = await Inventory.findOne({ organization: req.user._id });

        if (!inventory) {
            inventory = new Inventory({ organization: req.user._id });
        }

        if (!inventory[bloodGroup] && inventory[bloodGroup] !== 0) {
            return res.status(400).json({ success: false, message: 'Invalid blood group' });
        }

        inventory[bloodGroup] = quantity;
        await inventory.save();

        res.json({ success: true, data: inventory });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all inventories (for hospitals and donors to see)
// @route   GET /api/inventory
// @access  Private (All authenticated users)
exports.getAllInventories = async (req, res) => {
    try {
        const inventories = await Inventory.find().populate('organization', 'organizationName address phone email');
        res.json({ success: true, data: inventories });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
