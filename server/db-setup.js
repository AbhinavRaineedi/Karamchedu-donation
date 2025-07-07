const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './.env.local' });

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ MongoDB connected successfully');
    
    // Create the donation schema and model
    const donationSchema = new mongoose.Schema({
      name: { type: String, required: true, trim: true },
      fatherName: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true },
      city: { type: String, required: true, trim: true },
      country: { type: String, required: true, trim: true },
      amount: { type: Number, required: true, min: 0 },
      cause: { type: String, required: true, enum: ['Eldercare', 'Education', 'Health', 'Employment Training'] },
      createdAt: { type: Date, default: Date.now }
    });

    const Donation = mongoose.model('Donation', donationSchema);
    
    // Test the collection by creating a sample document
    const testDonation = new Donation({
      name: 'Test User',
      fatherName: 'Test Father',
      phone: '+1234567890',
      city: 'Test City',
      country: 'Test Country',
      amount: 100,
      cause: 'Education'
    });
    
    await testDonation.save();
    console.log('✅ Test donation saved successfully');
    
    // Clean up test data
    await Donation.deleteOne({ name: 'Test User' });
    console.log('✅ Test data cleaned up');
    
    console.log('🎉 Database setup completed successfully!');
    console.log('📊 Collection "donations" is ready to store survey data');
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Database setup failed:', err.message);
    console.log('\n📋 To fix this, you need to:');
    console.log('1. Install MongoDB locally, OR');
    console.log('2. Set up MongoDB Atlas (cloud database)');
    console.log('\n🔗 MongoDB Atlas Setup:');
    console.log('1. Go to https://www.mongodb.com/atlas');
    console.log('2. Create a free account');
    console.log('3. Create a new cluster');
    console.log('4. Get your connection string');
    console.log('5. Update .env.local with your connection string');
    process.exit(1);
  }
};

connectDB(); 