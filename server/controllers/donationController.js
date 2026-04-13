const Donation = require('../models/Donation');
const Inventory = require('../models/Inventory');

// @desc    Book a donation slot
// @route   POST /api/donations/book
// @access  Private (Donor)
exports.bookSlot = async (req, res) => {
    try {
        const { organization, bloodGroup, date, time } = req.body;

        const donation = await Donation.create({
            donor: req.user._id,
            organization,
            bloodGroup,
            date,
            time
        });

        // Emit notification to organization
        const io = req.app.get('socketio');
        io.to(organization).emit('new-donation', { donation, donorName: req.user.name });

        res.status(201).json({ success: true, data: donation });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get donor's bookings
// @route   GET /api/donations/my
// @access  Private (Donor)
exports.getMyDonations = async (req, res) => {
    try {
        const donations = await Donation.find({ donor: req.user._id })
            .populate('organization', 'organizationName address phone');
        res.json({ success: true, data: donations });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get organization's donation bookings
// @route   GET /api/donations/org
// @access  Private (Organization)
exports.getOrgDonations = async (req, res) => {
    try {
        const donations = await Donation.find({ organization: req.user._id })
            .populate('donor', 'name email phone address');
        res.json({ success: true, data: donations });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update donation status (and update inventory if fulfilled)
// @route   PUT /api/donations/:id/status
// @access  Private (Organization)
exports.updateDonationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const donation = await Donation.findById(req.params.id);

        if (!donation) {
            return res.status(404).json({ success: false, message: 'Donation not found' });
        }

        if (donation.organization.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        // Only allow status update if not already fulfilled
        if (donation.status === 'fulfilled') {
            return res.status(400).json({ success: false, message: 'Already fulfilled' });
        }

        donation.status = status;
        await donation.save();

        // Emit notification to donor
        const io = req.app.get('socketio');
        io.to(donation.donor.toString()).emit('donation-status-update', { donation });

        // If status is fulfilled, increase inventory
        if (status === 'fulfilled') {
            let inventory = await Inventory.findOne({ organization: req.user._id });
            if (!inventory) {
                inventory = new Inventory({ organization: req.user._id });
            }
            inventory[donation.bloodGroup] = (inventory[donation.bloodGroup] || 0) + 1; // Assuming 1 unit per donation
            await inventory.save();
        }

        res.json({ success: true, data: donation });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
