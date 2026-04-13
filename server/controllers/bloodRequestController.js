const BloodRequest = require('../models/BloodRequest');
const Inventory = require('../models/Inventory');

// @desc    Create a blood request
// @route   POST /api/requests/create
// @access  Private (Hospital)
exports.createRequest = async (req, res) => {
    try {
        const { organization, bloodGroup, quantity } = req.body;

        const request = await BloodRequest.create({
            hospital: req.user._id,
            organization,
            bloodGroup,
            quantity
        });

        // Emit notification to organization
        const io = req.app.get('socketio');
        io.to(organization).emit('new-request', { request, hospitalName: req.user.hospitalName });

        res.status(201).json({ success: true, data: request });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get hospital's requests
// @route   GET /api/requests/my
// @access  Private (Hospital)
exports.getMyRequests = async (req, res) => {
    try {
        const requests = await BloodRequest.find({ hospital: req.user._id })
            .populate('organization', 'organizationName address phone email');
        res.json({ success: true, data: requests });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get organization's blood requests
// @route   GET /api/requests/org
// @access  Private (Organization)
exports.getOrgRequests = async (req, res) => {
    try {
        const requests = await BloodRequest.find({ organization: req.user._id })
            .populate('hospital', 'hospitalName email phone address');
        res.json({ success: true, data: requests });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update blood request status
// @route   PUT /api/requests/:id/status
// @access  Private (Organization)
exports.updateRequestStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const request = await BloodRequest.findById(req.params.id);

        if (!request) {
            return res.status(404).json({ success: false, message: 'Request not found' });
        }

        if (request.organization.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        if (request.status !== 'pending') {
            return res.status(400).json({ success: false, message: 'Request already processed' });
        }

        if (status === 'accepted') {
            const inventory = await Inventory.findOne({ organization: req.user._id });
            
            if (!inventory || (inventory[request.bloodGroup] || 0) < request.quantity) {
                return res.status(400).json({ success: false, message: 'Insufficient inventory' });
            }

            // Reduce inventory
            inventory[request.bloodGroup] -= request.quantity;
            await inventory.save();
        }

        request.status = status;
        await request.save();

        // Emit notification to hospital
        const io = req.app.get('socketio');
        io.to(request.hospital.toString()).emit('request-status-update', { request });

        res.json({ success: true, data: request });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
