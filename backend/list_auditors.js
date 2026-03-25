const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const listAuditors = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const auditors = await User.find({ role: { $in: ['Auditor', 'Admin'] } }).select('name email role');
        console.log('--- AVAILABLE AUDITORS ---');
        console.log(JSON.stringify(auditors, null, 2));
        await mongoose.connection.close();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

listAuditors();
