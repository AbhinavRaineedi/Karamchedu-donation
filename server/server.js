const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGODB_URI = 'mongodb+srv://abhi:abhi123@cluster0.mongodb.net/karamchedu_donations?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Donation Schema
const donationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  fatherName: { type: String, required: true },
  phone: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true, default: 'USD ($)' },
  cause: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Donation = mongoose.model('Donation', donationSchema);

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running!' });
});

// Submit donation
app.post('/api/submit', async (req, res) => {
  try {
    const { name, fatherName, phone, city, country, amount, currency, cause } = req.body;
    
    // Validation
    if (!name || !fatherName || !phone || !city || !country || !amount || !currency || !cause) {
      return res.status(400).json({ 
        success: false, 
        error: 'All fields are required' 
      });
    }

    if (amount <= 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Amount must be greater than 0' 
      });
    }

    // Create new donation
    const donation = new Donation({
      name,
      fatherName,
      phone,
      city,
      country,
      amount: parseFloat(amount),
      currency,
      cause
    });

    await donation.save();
    
    res.status(201).json({ 
      success: true, 
      message: 'Donation submitted successfully',
      data: donation 
    });
    
  } catch (error) {
    console.error('Error submitting donation:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to submit donation' 
    });
  }
});

// Get all donations
app.get('/api/responses', async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });
    res.json({ 
      success: true, 
      data: donations 
    });
  } catch (error) {
    console.error('Error fetching donations:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch donations' 
    });
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

// Export CSV
app.get('/api/export', async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });
    
    // Create CSV content
    const csvHeader = 'Name,Father\'s Name,Phone,City,Country,Amount,Currency,Cause,Date\n';
    const csvRows = donations.map(donation => {
      const date = new Date(donation.createdAt).toLocaleDateString();
      return `"${donation.name}","${donation.fatherName}","${donation.phone}","${donation.city}","${donation.country}",${donation.amount},"${donation.currency}","${donation.cause}","${date}"`;
    }).join('\n');
    
    const csvContent = csvHeader + csvRows;
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="karamchedu_donations.csv"');
    res.send(csvContent);
    
  } catch (error) {
    console.error('Error exporting CSV:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to export CSV' 
    });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📝 Submit donations: http://localhost:${PORT}/api/submit`);
  console.log(`📊 View donations: http://localhost:${PORT}/api/responses`);
  console.log(`🗑️ Delete donation: http://localhost:${PORT}/api/donation/:id`);
  console.log(`📥 Export CSV: http://localhost:${PORT}/api/export`);
}); 