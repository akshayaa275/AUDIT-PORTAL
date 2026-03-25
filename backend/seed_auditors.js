const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

dotenv.config();

const seedAuditors = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        const auditors = [
            { name: 'Sarah Jenkins', email: 'sarah.j@audit.com', password: 'password123', role: 'Auditor' },
            { name: 'Marcus Aurelius', email: 'marcus.a@audit.com', password: 'password123', role: 'Auditor' },
            { name: 'Linda Kawasaki', email: 'linda.k@audit.com', password: 'password123', role: 'Auditor' },
            { name: 'Kevin Baxter', email: 'kevin.b@audit.com', password: 'password123', role: 'Auditor' }
        ];

        for (const auditorData of auditors) {
            const exists = await User.findOne({ email: auditorData.email });
            if (!exists) {
                const salt = await bcrypt.genSalt(10);
                auditorData.password = await bcrypt.hash(auditorData.password, salt);
                await User.create(auditorData);
                console.log(`Created auditor: ${auditorData.name}`);
            } else {
                console.log(`Auditor already exists: ${auditorData.name}`);
            }
        }

        console.log('--- SEEDING COMPLETE ---');
        await mongoose.connection.close();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedAuditors();
