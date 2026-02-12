# Bangladesh Election 2026 Tracker - Complete Guide

A comprehensive, real-time election tracking application for the Bangladesh 2026 General Election with backend server support.

## 🌟 Features

- ✅ **Real-time vote counting** with Socket.io
- ✅ **Live countdown timer** to election day
- ✅ **NID verification** with image upload support
- ✅ **Election insights** in Bengali
- ✅ **Referendum voting** system
- ✅ **Candidate profiles** comparison
- ✅ **RESTful API** backend
- ✅ **Image storage** with Multer
- ✅ **No external API dependencies** - fully self-contained

## 📁 Project Structure

```
bangladesh-election-2026-tracker/
├── server/                     # Backend server
│   ├── controllers/           # Request handlers
│   ├── routes/               # API routes
│   ├── services/             # Business logic
│   ├── middleware/           # Custom middleware (Multer)
│   ├── uploads/              # Uploaded NID images
│   ├── index.js              # Server entry point
│   ├── package.json          # Server dependencies
│   └── .env                  # Server environment variables
├── src/                      # Frontend (React + TypeScript)
│   ├── components/           # React components
│   ├── services/             # API & Socket services
│   ├── App.tsx               # Main app component
│   └── ...
├── package.json              # Frontend dependencies
└── README.md                 # This file
```

## 🚀 Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### 1. Install Frontend Dependencies

```bash
npm install
```

### 2. Install Backend Dependencies

```bash
cd server
npm install
cd ..
```

### 3. Environment Configuration

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:5002/api
VITE_SOCKET_URL=http://localhost:5002
```

**Backend (server/.env):**
```env
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

## 🎯 Running the Application

### Start the Backend Server

```bash
cd server
npm run dev
```

The server will start on `http://localhost:5002`

### Start the Frontend

In a new terminal:

```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

## 📡 Complete API Documentation

### Election Endpoints

#### Get Election Insights
```
GET /api/election/insights
```

Response:
```json
{
  "success": true,
  "data": [
    {
      "title": "ভোটার উপস্থিতির প্রবণতা",
      "summary": "প্রাথমিক পূর্বাভাস...",
      "category": "বিশ্লেষণ"
    }
  ]
}
```

#### Get Candidate Profiles
```
GET /api/election/candidates
```

### Vote Endpoints

#### Get Current Votes
```
GET /api/vote/current
```

#### Cast a Vote
```
POST /api/vote/cast
Content-Type: application/json

{
  "party": "rice" // or "scale"
}
```

#### Get Referendum Data
```
GET /api/vote/referendum
```

#### Cast Referendum Vote
```
POST /api/vote/referendum
Content-Type: application/json

{
  "choice": "yes" // or "no"
}
```

#### Get Countdown
```
GET /api/vote/countdown
```

### NID Endpoints

#### 1. Verify NID (Base64) - For camera capture
```
POST /api/nid/verify
Content-Type: application/json

{
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
}
```

#### 2. Verify NID (File Upload with Multer) - For file selection
```
POST /api/nid/upload
Content-Type: multipart/form-data

Form Data:
- nidImage: [Image File]
```

Response:
```json
{
  "success": true,
  "data": {
    "isValid": true,
    "name": "মো: আব্দুল করিম",
    "nidNumber": "1234567890",
    "uploadedImage": {
      "filename": "nid-1709123456-987654321.jpg",
      "path": "/uploads/nid-images/nid-1709123456-987654321.jpg",
      "size": 123456
    },
    "fileInfo": {
      "originalName": "my-nid.jpg",
      "size": 123456,
      "mimetype": "image/jpeg"
    }
  }
}
```

#### 3. Get Uploaded NID Image
```
GET /api/nid/images/:filename

Example:
GET /api/nid/images/nid-1709123456-987654321.jpg
```

## 🔌 WebSocket Events

### Connection

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:5002');
```

### Server → Client Events

#### `initial-data`
Sent immediately when client connects:
```json
{
  "votes": {
    "partyA": 42350670,
    "partyB": 39882140,
    "totalVotes": 82232810
  },
  "referendum": {
    "yes": 12540,
    "no": 8430
  },
  "countdown": {
    "days": 300,
    "hours": 12,
    "minutes": 45,
    "seconds": 30,
    "isElectionDay": false
  }
}
```

#### `vote-update`
Sent every 5 seconds with updated vote counts:
```json
{
  "votes": { ... },
  "referendum": { ... }
}
```

#### `countdown-update`
Sent every second with countdown data:
```json
{
  "days": 300,
  "hours": 12,
  "minutes": 45,
  "seconds": 30,
  "isElectionDay": false
}
```

## 📤 Using Multer File Upload

### Frontend Example (React with FormData)

```javascript
import React, { useState } from 'react';

function NIDUploadComponent() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);

    // Create FormData
    const formData = new FormData();
    formData.append('nidImage', file);

    try {
      // Upload to server
      const response = await fetch('http://localhost:5002/api/nid/upload', {
        method: 'POST',
        body: formData // Don't set Content-Type, browser will set it automatically
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.data);
        console.log('NID Verified:', data.data.name);
        console.log('Uploaded file:', data.data.uploadedImage.path);
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={loading}
      />

      {loading && <p>Uploading and verifying...</p>}

      {result && (
        <div>
          <p>Name: {result.name}</p>
          <p>NID: {result.nidNumber}</p>
          <img
            src={`http://localhost:5002${result.uploadedImage.path}`}
            alt="Uploaded NID"
            style={{ maxWidth: '300px' }}
          />
        </div>
      )}
    </div>
  );
}
```

### Using cURL

```bash
# Upload NID image
curl -X POST http://localhost:5002/api/nid/upload \
  -F "nidImage=@/path/to/your/nid-card.jpg"

# Get uploaded image
curl http://localhost:5002/api/nid/images/nid-1709123456-987654321.jpg \
  --output downloaded-nid.jpg
```

### Using Postman

1. Set method to `POST`
2. URL: `http://localhost:5002/api/nid/upload`
3. Go to `Body` tab
4. Select `form-data`
5. Add key: `nidImage`, type: `File`
6. Select your image file
7. Click `Send`

## 🛠️ Technologies Used

### Frontend
- React 19
- TypeScript
- Tailwind CSS
- Socket.io Client
- Vite

### Backend
- Node.js
- Express.js
- Socket.io
- Multer (file uploads)
- CORS
- dotenv

## 📝 File Upload Configuration

### Multer Settings

Location: `server/middleware/upload.js`

```javascript
- Max file size: 10MB
- Allowed formats: JPEG, JPG, PNG, GIF, WebP
- Storage location: server/uploads/nid-images/
- Filename format: nid-[timestamp]-[random].ext
```

### Security Features

✅ File type validation (only images)
✅ File size limits (10MB max)
✅ Unique filename generation
✅ Path traversal prevention
✅ Automatic cleanup on errors
✅ Safe file serving

## 🔒 Additional Security Notes

- All uploaded files are validated before storage
- Files are stored with unique names to prevent overwrites
- Directory traversal attacks are prevented
- CORS is properly configured
- File paths are sanitized

## 📊 Testing the Upload Feature

### Test with Sample Image

1. Start the backend server
2. Use cURL or Postman to upload an image
3. Check `server/uploads/nid-images/` for the stored file
4. Access the image via browser: `http://localhost:5002/uploads/nid-images/[filename]`

### Expected Flow

1. User selects NID image
2. Frontend sends FormData to `/api/nid/upload`
3. Multer processes the upload
4. File is saved to `server/uploads/nid-images/`
5. NID verification simulates processing
6. Server returns verification result + file path
7. Frontend can display the uploaded image

## 🐛 Troubleshooting

### "No file uploaded" error
- Ensure form field name is `nidImage`
- Check Content-Type is `multipart/form-data`
- Verify file is actually selected

### "Invalid file type" error
- Only JPEG, PNG, GIF, and WebP are allowed
- Check file extension and MIME type

### File too large error
- Maximum file size is 10MB
- Compress image before uploading

### Cannot access uploaded image
- Verify server is running
- Check file exists in `server/uploads/nid-images/`
- Ensure static file serving is enabled

## 📄 License

MIT

---

**Note:** This is an educational simulation. All data is fictitious and for demonstration purposes only.
