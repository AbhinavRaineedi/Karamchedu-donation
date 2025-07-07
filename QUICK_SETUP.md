# Quick MongoDB Setup for Karamchedu Donation App

## 🚀 Fastest Way: MongoDB Atlas (Recommended)

**No installation needed - Cloud database ready in 5 minutes!**

### Step 1: Create MongoDB Atlas Account
1. The browser should have opened https://www.mongodb.com/atlas
2. Click "Try Free" or "Sign Up"
3. Create a free account

### Step 2: Create Database
1. Click "Build a Database"
2. Choose "FREE" tier (M0)
3. Select any cloud provider (AWS/Google Cloud/Azure)
4. Choose a region close to you
5. Click "Create"

### Step 3: Set Up Access
1. **Database Access:**
   - Go to "Database Access" in left sidebar
   - Click "Add New Database User"
   - Username: `karamchedu_admin`
   - Password: `YourSecurePassword123!`
   - Select "Read and write to any database"
   - Click "Add User"

2. **Network Access:**
   - Go to "Network Access" in left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Click "Confirm"

### Step 4: Get Connection String
1. Go back to "Database" in left sidebar
2. Click "Connect"
3. Choose "Connect your application"
4. Copy the connection string

### Step 5: Update Your App
1. Open `server/.env.local`
2. Replace the content with your connection string:
   ```
   MONGODB_URI=mongodb+srv://karamchedu_admin:YourSecurePassword123!@your-cluster.mongodb.net/karamchedu_donations?retryWrites=true&w=majority
   ```
   (Replace `your-cluster` with your actual cluster name)

### Step 6: Test Your Setup
```bash
cd server
npm run setup-db
```

## 🔧 Alternative: Local MongoDB Installation

If you prefer local installation:

### Step 1: Download MongoDB
1. Go to: https://www.mongodb.com/try/download/community
2. Select: Windows x64
3. Click "Download"

### Step 2: Install
1. Run the `.msi` file as Administrator
2. Choose "Complete" installation
3. Install MongoDB Compass when prompted

### Step 3: Update Connection String
Your `server/.env.local` should contain:
```
MONGODB_URI=mongodb://127.0.0.1:27017/karamchedu_donations
```

## 🎯 Start Your Application

Once MongoDB is set up:

```bash
# Terminal 1: Start Backend
cd server
npm start

# Terminal 2: Start Frontend  
cd client
npm start
```

## ✅ Test Everything Works

1. **Backend Health Check:**
   - Open: http://localhost:5000/api/health
   - Should show: `{"status":"OK","timestamp":"..."}`

2. **Frontend:**
   - Open: http://localhost:3000
   - Fill out the donation form
   - Submit and check "View Data" tab

3. **Database:**
   - Your survey data will be stored in MongoDB
   - Use "Export CSV" to download all data

## 🆘 Need Help?

- **MongoDB Atlas Issues:** Check the detailed guide in `DATABASE_SETUP.md`
- **Connection Problems:** Make sure your IP is whitelisted in Atlas
- **App Not Starting:** Check that both backend and frontend are running

---

**🎉 Your donation survey app will be fully functional once MongoDB is connected!** 