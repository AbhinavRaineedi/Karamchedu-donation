const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { Parser } = require('json2csv');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');

// MongoDB Connection String
const MONGODB_URI = 'mongodb+srv://suryaraineedi61:f6Ib5mRD5vWNFFob@cluster0.mtatdd3.mongodb.net/argumentor?retryWrites=true&w=majority&appName=Cluster0';

const app = express();

// Security and performance middleware
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// CORS configuration for global deployment
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-domain.com'] // Replace with your actual domain
    : ['http://localhost:3000'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// MongoDB connection with retry logic
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ MongoDB connected successfully');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  }
};

connectDB();

const donationSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  fatherName: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  country: { type: String, required: true, trim: true },
  amount: { type: Number, required: true, min: 0 },
  currency: { type: String, required: true, default: 'USD ($)' },
  cause: { type: String, required: true, enum: ['Eldercare', 'Education', 'Health', 'Employment Training'] },
  createdAt: { type: Date, default: Date.now }
});

const Donation = mongoose.model('Donation', donationSchema);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.post('/api/submit', async (req, res) => {
  try {
    const { name, fatherName, phone, city, country, amount, currency, cause } = req.body;
    if (!name || !fatherName || !phone || !city || !country || !amount || !currency || !cause) {
      return res.status(400).json({ success: false, error: 'All fields are required.' });
    }
    const donation = new Donation({
      name,
      fatherName,
      phone,
      city,
      country,
      amount,
      currency,
      cause,
      date: new Date()
    });
    await donation.save();
    res.json({ success: true, message: 'Donation saved successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to save donation.' });
  }
});

app.get('/api/responses', async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });
    res.json(Array.isArray(donations) ? donations : []);
  } catch (err) {
    res.status(500).json([]);
  }
});

// Delete single donation
app.delete('/api/donation/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid donation ID' 
      });
    }
    
    // Find and delete the donation
    const deletedDonation = await Donation.findByIdAndDelete(id);
    
    if (!deletedDonation) {
      return res.status(404).json({ 
        success: false, 
        error: 'Donation not found' 
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Donation deleted successfully',
      deletedDonation 
    });
    
  } catch (error) {
    console.error('Error deleting donation:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete donation' 
    });
  }
});

app.get('/api/export', async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });
    if (!Array.isArray(donations) || donations.length === 0) {
      return res.status(200).send('No donations to export');
    }
    const fields = ['name', 'fatherName', 'phone', 'city', 'country', 'amount', 'currency', 'cause', 'createdAt'];
    const csvRows = [fields.join(',')];
    donations.forEach(d => {
      csvRows.push(fields.map(f => '"' + (d[f] ? String(d[f]).replace(/"/g, '""') : '') + '"').join(','));
    });
    res.header('Content-Type', 'text/csv');
    res.attachment('donations.csv');
    res.send(csvRows.join('\n'));
  } catch (err) {
    res.status(500).send('Error exporting CSV');
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false,
    error: 'Something went wrong!' 
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📝 Submit donations: http://localhost:${PORT}/api/submit`);
  console.log(`📊 View donations: http://localhost:${PORT}/api/responses`);
  console.log(`🗑️ Delete donation: http://localhost:${PORT}/api/donation/:id`);
  console.log(`📥 Export CSV: http://localhost:${PORT}/api/export`);
}); 