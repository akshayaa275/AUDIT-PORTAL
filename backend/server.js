const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/audits', require('./routes/auditRoutes'));
app.use('/api/findings', require('./routes/findingRoutes'));
app.use('/api/actions', require('./routes/actionRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));

// Admin only routes (could be separate files, but for brevity using simple routing)
const { getUsers, updateUser } = require('./controllers/userController');
const { getActivityLogs } = require('./controllers/logController');
const { protect, authorize } = require('./middleware/auth');

app.get('/api/users', protect, authorize('Admin', 'Auditor'), getUsers);
app.put('/api/users/:id', protect, authorize('Admin'), updateUser);
app.get('/api/activity-logs', protect, authorize('Admin'), getActivityLogs);

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
