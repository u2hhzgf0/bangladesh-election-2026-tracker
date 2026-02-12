# Installation & Setup Guide

Complete setup instructions for Bangladesh Election 2026 Tracker with Redux Toolkit Query.

## 📋 Prerequisites

- **Node.js** v16 or higher
- **npm** or **yarn**
- A modern web browser (Chrome, Firefox, Edge)

## 🚀 Step-by-Step Installation

### 1. Navigate to Frontend Directory

```bash
cd "c:\Users\Shadat\Desktop\All Project\Vot\bangladesh-election-2026-tracker"
```

### 2. Install Frontend Dependencies

```bash
npm install
```

This installs:
- React 19
- Redux Toolkit
- React-Redux
- Socket.io Client
- TypeScript
- Vite

### 3. Navigate to Backend Directory

```bash
cd "../bangladesh-election-server"
```

### 4. Install Backend Dependencies

```bash
npm install
```

This installs:
- Express
- Socket.io
- CORS
- Multer (for file uploads)
- dotenv

### 5. Configure Environment Variables

**Frontend (.env):**
```bash
cd "../bangladesh-election-2026-tracker"
```

Create/edit `.env`:
```env
VITE_API_URL=https://votapi.wixford.com/api
VITE_SOCKET_URL=https://votapi.wixford.com
```

**Backend (.env):**
```bash
cd "../bangladesh-election-server"
```

Edit `.env` (should already exist):
```env
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

## ▶️ Running the Application

### Terminal 1: Start Backend Server

```bash
cd "c:\Users\Shadat\Desktop\All Project\Vot\bangladesh-election-server"
npm run dev
```

You should see:
```
🚀 Bangladesh Election 2026 Server
📡 Server running on https://votapi.wixford.com
🔌 WebSocket ready for real-time updates
⏰ Countdown timer active
📊 Vote counting in progress
```

### Terminal 2: Start Frontend

```bash
cd "c:\Users\Shadat\Desktop\All Project\Vot\bangladesh-election-2026-tracker"
npm run dev
```

You should see:
```
  VITE v6.2.0  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### 3. Open in Browser

Navigate to: **http://localhost:5173**

You should see:
- ✅ Green "LIVE" indicator (Socket.io connected)
- ✅ Vote counts updating
- ✅ Countdown timer ticking

## 🧪 Verify Installation

### Check Backend Health

```bash
curl https://votapi.wixford.com/api/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "Bangladesh Election 2026 Server is running",
  "timestamp": "2026-02-12T..."
}
```

### Check Frontend Connection

Open browser console (F12):
```
✅ Connected to election server
```

## 📦 Package Versions

### Frontend Dependencies
```json
{
  "react": "^19.2.4",
  "react-dom": "^19.2.4",
  "react-redux": "^9.1.0",
  "@reduxjs/toolkit": "^2.2.1",
  "socket.io-client": "^4.7.2"
}
```

### Backend Dependencies
```json
{
  "express": "^4.18.2",
  "socket.io": "^4.7.2",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1",
  "multer": "^1.4.5-lts.1"
}
```

## 🛠️ Troubleshooting

### Port Already in Use

**Frontend (5173):**
```bash
# Kill process on Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Or use different port
npm run dev -- --port 5174
```

**Backend (5000):**
```bash
# Kill process on Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or change PORT in .env
PORT=5001
```

### Socket.io Not Connecting

1. **Check backend is running**
   ```bash
   curl https://votapi.wixford.com/api/health
   ```

2. **Check CORS settings**
   - Backend `.env`: `CORS_ORIGIN=http://localhost:5173`
   - Frontend should match this URL

3. **Check browser console**
   - Look for Socket.io connection errors
   - May need to allow mixed content in browser

### RTK Query Not Working

1. **Check Redux DevTools**
   - Install: [Redux DevTools Extension](https://github.com/reduxjs/redux-devtools)
   - Open: Browser DevTools → Redux tab
   - Look for actions and state

2. **Check API URL**
   ```bash
   # Frontend .env
   VITE_API_URL=https://votapi.wixford.com/api
   ```

3. **Check network tab**
   - Open browser DevTools → Network
   - Should see API calls to localhost:5000

### TypeScript Errors

```bash
# Install missing type definitions
npm install --save-dev @types/react @types/react-dom

# Clear cache and rebuild
rm -rf node_modules
npm install
```

### Build Errors

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

## 📝 Development Commands

### Frontend

```bash
# Development mode (with hot reload)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Backend

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

## 🔍 Testing the Setup

### 1. Test Vote Casting

1. Click "ভোট দিন" button
2. Allow camera access
3. Show any image (will be accepted for simulation)
4. Select party symbol
5. Check if vote count increases

### 2. Test Real-time Updates

1. Open two browser windows
2. Cast vote in one window
3. See both windows update simultaneously
4. Check "LIVE" indicator is green

### 3. Test API Endpoints

```bash
# Get election insights
curl https://votapi.wixford.com/api/election/insights

# Get current votes
curl https://votapi.wixford.com/api/vote/current

# Get countdown
curl https://votapi.wixford.com/api/vote/countdown
```

## 📚 Next Steps

1. ✅ Read [RTK-QUERY-GUIDE.md](RTK-QUERY-GUIDE.md) for API usage
2. ✅ Read [COMPLETE-GUIDE.md](COMPLETE-GUIDE.md) for full documentation
3. ✅ Open Redux DevTools to inspect state
4. ✅ Try uploading NID image
5. ✅ Cast some votes and see real-time updates

## 🎉 Success!

If you can:
- ✅ See the frontend at http://localhost:5173
- ✅ See "LIVE" indicator in green
- ✅ See vote counts updating
- ✅ Cast votes and see them reflected

**Congratulations! Your installation is complete!** 🚀

---

Need help? Check the troubleshooting section or open an issue.
