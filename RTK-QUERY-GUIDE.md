# Redux Toolkit (RTK) Query Integration Guide

Complete API integration with Redux Toolkit Query and Socket.io for real-time updates.

## 🎯 What Was Implemented

### ✅ Complete Redux Toolkit Setup
- RTK Query for API calls
- Redux slices for real-time state
- Socket.io middleware for WebSocket
- TypeScript support

## 📁 Project Structure

```
bangladesh-election-2026-tracker/
├── store/
│   ├── api/                    # RTK Query API slices
│   │   ├── baseApi.ts         # Base API configuration
│   │   ├── electionApi.ts     # Election endpoints
│   │   ├── voteApi.ts         # Vote endpoints
│   │   └── nidApi.ts          # NID verification endpoints
│   ├── slices/                # Redux slices
│   │   └── realtimeSlice.ts   # Real-time data state
│   ├── middleware/            # Custom middleware
│   │   └── socketMiddleware.ts # Socket.io integration
│   ├── index.ts               # Store configuration
│   └── hooks.ts               # Typed Redux hooks
├── main.tsx                   # Redux Provider setup
├── App.tsx                    # Main app with RTK Query hooks
└── components/
    └── VotingModal.tsx        # Using RTK Query mutations
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

This will install:
- `@reduxjs/toolkit` - Redux Toolkit
- `react-redux` - React bindings
- `socket.io-client` - WebSocket client

### 2. Start Backend Server

```bash
cd ../bangladesh-election-server
npm install
npm run dev
```

Server runs on: `http://localhost:5002`

### 3. Start Frontend

```bash
npm run dev
```

Frontend runs on: `http://localhost:5173`

## 📡 RTK Query APIs

### Election API ([electionApi.ts](store/api/electionApi.ts))

```typescript
import { useGetInsightsQuery, useGetCandidatesQuery } from './store/api/electionApi';

// In your component
const { data: insights, isLoading } = useGetInsightsQuery();
const { data: candidates } = useGetCandidatesQuery();
```

**Endpoints:**
- `useGetInsightsQuery()` - Get election insights
- `useGetCandidatesQuery()` - Get candidate profiles

### Vote API ([voteApi.ts](store/api/voteApi.ts))

```typescript
import {
  useGetCurrentVotesQuery,
  useCastVoteMutation,
  useGetReferendumQuery,
  useCastReferendumVoteMutation,
  useGetCountdownQuery,
} from './store/api/voteApi';

// Queries
const { data: votes } = useGetCurrentVotesQuery();
const { data: referendum } = useGetReferendumQuery();
const { data: countdown } = useGetCountdownQuery();

// Mutations
const [castVote] = useCastVoteMutation();
const [castReferendumVote] = useCastReferendumVoteMutation();

// Cast a vote
await castVote({ party: 'rice' }).unwrap();
await castReferendumVote({ choice: 'yes' }).unwrap();
```

**Endpoints:**
- `useGetCurrentVotesQuery()` - Get current vote counts
- `useCastVoteMutation()` - Cast a vote
- `useGetReferendumQuery()` - Get referendum data
- `useCastReferendumVoteMutation()` - Cast referendum vote
- `useGetCountdownQuery()` - Get countdown timer

### NID API ([nidApi.ts](store/api/nidApi.ts))

```typescript
import {
  useVerifyNIDMutation,
  useVerifyNIDWithUploadMutation,
  useGetNIDImageQuery,
} from './store/api/nidApi';

// Base64 verification
const [verifyNID] = useVerifyNIDMutation();
const result = await verifyNID({ image: base64String }).unwrap();

// File upload verification
const [verifyWithUpload] = useVerifyNIDWithUploadMutation();
const formData = new FormData();
formData.append('nidImage', file);
const result = await verifyWithUpload(formData).unwrap();

// Get uploaded image
const { data: imageUrl } = useGetNIDImageQuery(filename);
```

**Endpoints:**
- `useVerifyNIDMutation()` - Verify NID with base64 image
- `useVerifyNIDWithUploadMutation()` - Verify NID with file upload
- `useGetNIDImageQuery()` - Get uploaded NID image

## 🔄 Real-time Updates with Socket.io

### Socket Middleware ([socketMiddleware.ts](store/middleware/socketMiddleware.ts))

Automatically connects to Socket.io server and dispatches Redux actions:

```typescript
// Connection events
- socket.on('connect') → setConnectionStatus(true)
- socket.on('disconnect') → setConnectionStatus(false)

// Data events
- socket.on('initial-data') → updateAllData(data)
- socket.on('vote-update') → updateVotes(data) + updateReferendum(data)
- socket.on('countdown-update') → updateCountdown(data)
```

### Using Real-time Data

```typescript
import { useAppSelector } from './store/hooks';

// In your component
const { votes, referendum, countdown, isConnected } = useAppSelector(
  (state) => state.realtime
);

// votes, referendum, and countdown auto-update via Socket.io!
```

## 🎨 Component Examples

### App.tsx - Main Application

```typescript
import { useAppSelector } from './store/hooks';
import { useGetInsightsQuery } from './store/api/electionApi';
import { useCastVoteMutation } from './store/api/voteApi';

const App = () => {
  // Real-time data from Socket.io
  const { votes, referendum, countdown, isConnected } = useAppSelector(
    (state) => state.realtime
  );

  // API data from RTK Query
  const { data: insights = [], isLoading } = useGetInsightsQuery();

  // Mutations
  const [castVote] = useCastVoteMutation();

  const handleVote = async (party: 'rice' | 'scale') => {
    await castVote({ party }).unwrap();
  };

  return (
    <div>
      {isConnected && <span>● LIVE</span>}
      <VoteDisplay data={votes} />
      <button onClick={() => handleVote('rice')}>Vote Rice</button>
    </div>
  );
};
```

### VotingModal.tsx - NID Verification

```typescript
import { useVerifyNIDMutation } from '../store/api/nidApi';

const VotingModal = () => {
  const [verifyNID, { isLoading }] = useVerifyNIDMutation();

  const handleVerify = async (imageData: string) => {
    try {
      const result = await verifyNID({ image: imageData }).unwrap();
      if (result.isValid) {
        // Proceed with voting
      }
    } catch (error) {
      console.error('Verification failed:', error);
    }
  };

  return (
    <div>
      {isLoading ? 'Verifying...' : 'Ready'}
      <button onClick={() => handleVerify(image)}>Verify NID</button>
    </div>
  );
};
```

## 🔧 Advanced Features

### Automatic Cache Invalidation

RTK Query automatically refetches data when mutations occur:

```typescript
// When you cast a vote
await castVote({ party: 'rice' }).unwrap();

// RTK Query automatically invalidates 'Votes' tag
// useGetCurrentVotesQuery() will refetch fresh data
```

### Error Handling

```typescript
const [castVote, { isLoading, error }] = useCastVoteMutation();

try {
  await castVote({ party: 'rice' }).unwrap();
} catch (err) {
  // Handle error
  console.error('Failed:', err);
}

// Or use the error from the hook
if (error) {
  return <div>Error: {error.message}</div>;
}
```

### Loading States

```typescript
const { data, isLoading, isFetching, error } = useGetInsightsQuery();

if (isLoading) return <div>Loading...</div>;
if (error) return <div>Error!</div>;
return <div>{data.map(insight => ...)}</div>;
```

### Manual Refetch

```typescript
const { data, refetch } = useGetCurrentVotesQuery();

// Manually refetch
const handleRefresh = () => {
  refetch();
};
```

## 🏷️ Cache Tags

RTK Query uses tags for cache invalidation:

| Tag | Endpoints | Invalidated By |
|-----|-----------|----------------|
| `Votes` | getCurrentVotes | castVote |
| `Referendum` | getReferendum | castReferendumVote |
| `Countdown` | getCountdown | - |
| `Insights` | getInsights | - |
| `Candidates` | getCandidates | - |
| `NID` | getNIDImage | verifyNIDWithUpload |

## 🧪 Testing API Calls

### Using Redux DevTools

1. Install [Redux DevTools Extension](https://github.com/reduxjs/redux-devtools)
2. Open browser DevTools → Redux tab
3. See all actions and state changes
4. Track API calls and responses

### Console Logging

```typescript
const [castVote] = useCastVoteMutation();

const handleVote = async (party: 'rice' | 'scale') => {
  try {
    const result = await castVote({ party }).unwrap();
    console.log('✅ Vote successful:', result);
  } catch (error) {
    console.error('❌ Vote failed:', error);
  }
};
```

## 📊 Data Flow

```
┌─────────────────────────────────────────────────────────┐
│                     User Action                         │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              RTK Query Mutation/Query                    │
│           (castVote, getInsights, etc.)                 │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  Backend API                            │
│            (Express + Socket.io)                        │
└────────────┬───────────────────┬────────────────────────┘
             │                   │
             │ HTTP Response     │ Socket.io Event
             ▼                   ▼
┌─────────────────────┐  ┌──────────────────────────────┐
│  RTK Query Cache    │  │   Socket Middleware          │
│  (API responses)    │  │   (Real-time updates)        │
└──────────┬──────────┘  └────────────┬─────────────────┘
           │                          │
           │                          │
           ▼                          ▼
┌─────────────────────────────────────────────────────────┐
│                   Redux Store                           │
│         (api + realtime state)                          │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│               React Components                          │
│         (Auto re-render on state change)                │
└─────────────────────────────────────────────────────────┘
```

## 🎯 Benefits of This Setup

### ✅ Automatic Caching
- API responses cached automatically
- Reduces unnecessary network requests
- Shared cache across components

### ✅ Real-time Updates
- Socket.io seamlessly integrated
- State updates automatically
- All components stay in sync

### ✅ Type Safety
- Full TypeScript support
- Auto-completion in IDE
- Catch errors at compile time

### ✅ Developer Experience
- Redux DevTools integration
- Clear data flow
- Easy debugging

### ✅ Performance
- Automatic request deduplication
- Background refetching
- Optimistic updates support

## 🐛 Troubleshooting

### API calls not working
```bash
# Check if backend is running
curl http://localhost:5002/api/health

# Check environment variables
cat .env
# Should have:
# VITE_API_URL=http://localhost:5002/api
# VITE_SOCKET_URL=http://localhost:5002
```

### Socket.io not connecting
```typescript
// Check browser console for:
✅ Connected to election server  // Good!
❌ Connection error: ...         // Check backend running
```

### Redux state not updating
```typescript
// Use Redux DevTools to check:
1. Actions being dispatched
2. State changes in store
3. Component subscriptions
```

## 📚 Further Reading

- [RTK Query Documentation](https://redux-toolkit.js.org/rtk-query/overview)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [Socket.io Client Documentation](https://socket.io/docs/v4/client-api/)

---

**Complete implementation ready!** All API calls now use RTK Query with automatic caching, real-time Socket.io updates, and full TypeScript support. 🎉
