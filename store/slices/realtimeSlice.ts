import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { VoteData, ReferendumData } from '../../types';

interface CountdownData {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isElectionDay: boolean;
}

interface RealtimeState {
  votes: VoteData;
  referendum: ReferendumData;
  countdown: CountdownData;
  isConnected: boolean;
}

const initialState: RealtimeState = {
  votes: {
    partyA: 0,
    partyB: 0,
    totalVotes: 0,
  },
  referendum: {
    yes: 0,
    no: 0,
  },
  countdown: {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isElectionDay: false,
  },
  isConnected: false,
};

export const realtimeSlice = createSlice({
  name: 'realtime',
  initialState,
  reducers: {
    // Socket connection status
    setConnectionStatus: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },

    // Update votes from socket
    updateVotes: (state, action: PayloadAction<VoteData>) => {
      state.votes = action.payload;
    },

    // Update referendum from socket
    updateReferendum: (state, action: PayloadAction<ReferendumData>) => {
      state.referendum = action.payload;
    },

    // Update countdown from socket
    updateCountdown: (state, action: PayloadAction<CountdownData>) => {
      state.countdown = action.payload;
    },

    // Update all data (initial data)
    updateAllData: (state, action: PayloadAction<{
      votes?: VoteData;
      referendum?: ReferendumData;
      countdown?: CountdownData;
    }>) => {
      if (action.payload.votes) state.votes = action.payload.votes;
      if (action.payload.referendum) state.referendum = action.payload.referendum;
      if (action.payload.countdown) state.countdown = action.payload.countdown;
    },
  },
});

export const {
  setConnectionStatus,
  updateVotes,
  updateReferendum,
  updateCountdown,
  updateAllData,
} = realtimeSlice.actions;

export default realtimeSlice.reducer;
