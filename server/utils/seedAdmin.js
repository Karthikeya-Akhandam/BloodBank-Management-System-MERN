const User = require('../models/User');

const seedAdmin = async () => {
    try {
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@bloodconnect.com';
        
        // Check if admin already exists
        const adminExists = await User.findOne({ email: adminEmail });

        if (!adminExists) {
            console.log('Seeding Admin User...');
            await User.create({
                role: 'admin',
                name: process.env.ADMIN_NAME || 'System Admin',
                email: adminEmail,
                password: process.env.ADMIN_PASSWORD || 'admin123',
                address: 'System Headquarters',
                phone: '0000000000'
            });
            console.log('Admin User Created Successfully');
        } else {
            console.log('Admin User already exists, skipping seeding.');
        }
    } catch (error) {
        console.error('Error seeding admin user:', error.message);
    }
};

module.exports = seedAdmin;
