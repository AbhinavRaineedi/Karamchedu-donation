# Database Setup Guide for Karamchedu Donation App

## 🎯 Quick Setup Options

### Option 1: MongoDB Atlas (Recommended - Cloud Database)
**Best for: Global deployment, no local installation needed**

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for a free account
   - Create a new project

2. **Create a Cluster**
   - Click "Build a Database"
   - Choose "FREE" tier (M0)
   - Select your preferred cloud provider and region
   - Click "Create"

3. **Set Up Database Access**
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Create a username and password (save these!)
   - Select "Read and write to any database"
   - Click "Add User"

4. **Set Up Network Access**
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Click "Confirm"

5. **Get Your Connection String**
   - Go back to "Database" in the left sidebar
   - Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string

6. **Update Your .env.local File**
   ```
   MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/karamchedu_donations?retryWrites=true&w=majority
   ```
   Replace:
   - `your_username` with your database username
   - `your_password` with your database password
   - `your_cluster` with your actual cluster name

### Option 2: Local MongoDB Installation
**Best for: Development, offline work**

1. **Install MongoDB Community Server**
   - Download from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - Install with default settings
   - Start MongoDB service

2. **Your .env.local file should contain:**
   ```
   MONGODB_URI=mongodb://127.0.0.1:27017/karamchedu_donations
   ```

## 🚀 Testing Your Database Connection

### Step 1: Run the Database Setup Script
```bash
cd server
node db-setup.js
```

**Expected Output:**
```
✅ MongoDB connected successfully
✅ Test donation saved successfully
✅ Test data cleaned up
🎉 Database setup completed successfully!
📊 Collection "donations" is ready to store survey data
```

### Step 2: Start the Backend Server
```bash
cd server
npm start
```

**Expected Output:**
```
Server running on port 5000 in development mode
MongoDB connected successfully
```

### Step 3: Test the API
```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Expected response:
{"status":"OK","timestamp":"2024-01-01T12:00:00.000Z"}
```

## 📊 Database Structure

The application creates a collection called `donations` with the following structure:

```javascript
{
  _id: ObjectId,           // Auto-generated unique ID
  name: String,            // Donor's full name
  fatherName: String,      // Father's name
  phone: String,           // Phone number
  city: String,            // City of residence
  country: String,         // Country of residence
  amount: Number,          // Donation amount
  cause: String,           // One of: Eldercare, Education, Health, Employment Training
  createdAt: Date          // Timestamp of submission
}
```

## 🔧 Troubleshooting

### Common Issues:

1. **"MongoDB connection error: connect ECONNREFUSED"**
   - **Solution**: MongoDB is not running locally
   - **Fix**: Install MongoDB or use MongoDB Atlas

2. **"Authentication failed"**
   - **Solution**: Wrong username/password in connection string
   - **Fix**: Check your MongoDB Atlas credentials

3. **"Network access denied"**
   - **Solution**: IP address not whitelisted in MongoDB Atlas
   - **Fix**: Add your IP to MongoDB Atlas Network Access

4. **"Invalid connection string"**
   - **Solution**: Malformed MongoDB URI
   - **Fix**: Check your .env.local file format

### Testing Commands:

```bash
# Test database connection
node db-setup.js

# Test server health
curl http://localhost:5000/api/health

# Test API endpoints
curl -X POST http://localhost:5000/api/submit \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","fatherName":"Test","phone":"123","city":"Test","country":"Test","amount":100,"cause":"Education"}'
```

## 🌐 Production Deployment

For production deployment, make sure to:

1. **Use MongoDB Atlas** (recommended for global deployment)
2. **Set proper environment variables:**
   ```
   MONGODB_URI=your_production_mongodb_uri
   NODE_ENV=production
   PORT=process.env.PORT
   ```
3. **Update CORS origins** in `server/index.js` to your actual domain
4. **Enable MongoDB Atlas security features** (IP whitelist, etc.)

## 📱 Frontend Integration

The frontend automatically connects to the backend using:
- **Development**: `http://localhost:5000`
- **Production**: Same domain as the frontend

The React app will automatically:
- Submit survey data to the database
- Display all collected donations
- Export data as CSV files

## ✅ Success Checklist

- [ ] MongoDB Atlas account created (or local MongoDB installed)
- [ ] Database user created with read/write permissions
- [ ] Network access configured
- [ ] Connection string added to `.env.local`
- [ ] Database setup script runs successfully
- [ ] Backend server starts without errors
- [ ] Health endpoint responds correctly
- [ ] Frontend can connect to backend
- [ ] Survey form submits data successfully
- [ ] Data appears in the "View Data" tab
- [ ] CSV export works correctly

---

**🎉 Once all steps are completed, your donation survey app will be fully functional with a working database!** 