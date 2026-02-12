import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { baseApi } from './api/baseApi';
import realtimeReducer from './slices/realtimeSlice';
import { socketMiddleware } from './middleware/socketMiddleware';

// Configure Redux store
export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    realtime: realtimeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore socket.io actions
        ignoredActions: ['socket/connect', 'socket/disconnect'],
      },
    })
      .concat(baseApi.middleware)
      .concat(socketMiddleware),
});

// Enable refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch);

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
