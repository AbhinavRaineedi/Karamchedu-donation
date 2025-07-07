# 🌟 Karamchedu Donation Survey App

A globally deployable, responsive web survey application for collecting donations with a beautiful, modern UI.

## ✨ Features

- **📝 Donation Form**: Collect donor information with currency selection
- **📊 Data Management**: View all donations in a responsive table
- **🗑️ Individual Delete**: Delete specific donations with confirmation
- **📥 CSV Export**: Download all donation data for analysis
- **🎨 Modern UI**: Vibrant design with animations and glassmorphism effects
- **📱 Responsive**: Works perfectly on all devices
- **🌍 Global Ready**: Deployable worldwide

## 🚀 Live Demo

[Your Render URL will be here after deployment]

## 🛠️ Tech Stack

- **Frontend**: React.js with modern CSS animations
- **Backend**: Node.js with Express.js
- **Database**: MongoDB Atlas
- **Deployment**: Render (Free tier available)

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account
- GitHub account
- Render account

## 🔧 Local Development Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/karamchedu-donation-app.git
cd karamchedu-donation-app
```

### 2. Install Dependencies
```bash
npm run install-all
```

### 3. Set Up MongoDB Atlas
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Update the `MONGODB_URI` in `server/index.js`

### 4. Start Development Servers
```bash
npm run dev
```

This will start:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## 🌐 Global Deployment to Render

### Step 1: Prepare Your Repository

1. **Push to GitHub** (if not already done):
```bash
git add .
git commit -m "Initial commit for deployment"
git push origin main
```

2. **Verify your repository structure**:
```
karamchedu-donation-app/
├── client/
│   ├── src/
│   ├── package.json
│   └── ...
├── server/
│   ├── index.js
│   ├── package.json
│   └── ...
├── package.json
├── .gitignore
└── README.md
```

### Step 2: Deploy to Render

1. **Sign up/Login to Render**:
   - Go to [render.com](https://render.com)
   - Sign up with your GitHub account

2. **Create New Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the `karamchedu-donation-app` repository

3. **Configure the Service**:
   ```
   Name: karamchedu-donation-app
   Environment: Node
   Build Command: npm run install-all && npm run build
   Start Command: npm start
   ```

4. **Set Environment Variables** (if needed):
   - `NODE_ENV`: `production`
   - `PORT`: `10000` (Render's default)

5. **Deploy**:
   - Click "Create Web Service"
   - Render will automatically build and deploy your app

### Step 3: Update Frontend API URL

After deployment, update the API base URL in `client/src/App.js`:

```javascript
// Change from:
const API_BASE = 'http://localhost:5000';

// To:
const API_BASE = process.env.NODE_ENV === 'production' 
  ? 'https://your-app-name.onrender.com' 
  : 'http://localhost:5000';
```

### Step 4: Redeploy

After updating the API URL:
```bash
git add .
git commit -m "Update API URL for production"
git push origin main
```

Render will automatically redeploy your app.

## 🔒 Environment Variables

For production, you can set these in Render's dashboard:

- `NODE_ENV`: `production`
- `MONGODB_URI`: Your MongoDB Atlas connection string
- `PORT`: `10000` (Render default)

## 📱 API Endpoints

- `GET /api/health` - Health check
- `POST /api/submit` - Submit donation
- `GET /api/responses` - Get all donations
- `DELETE /api/donation/:id` - Delete specific donation
- `GET /api/export` - Export CSV

## 🎨 Customization

### Colors and Styling
Edit `client/src/App.css` to customize:
- Color schemes
- Animations
- Layout styles

### Form Fields
Modify `client/src/App.js` to:
- Add/remove form fields
- Change validation rules
- Update success messages

## 🚨 Troubleshooting

### Common Issues:

1. **Build Fails**:
   - Check Node.js version (needs 14+)
   - Verify all dependencies are installed
   - Check for syntax errors

2. **MongoDB Connection Issues**:
   - Verify connection string
   - Check IP whitelist in MongoDB Atlas
   - Ensure database exists

3. **CORS Errors**:
   - Verify CORS configuration in server
   - Check API URL in frontend

4. **Render Deployment Issues**:
   - Check build logs in Render dashboard
   - Verify start command
   - Check environment variables

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Review Render's deployment logs
3. Verify your MongoDB Atlas connection
4. Check the browser console for errors

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Made with ❤️ for Karamchedu Community** 