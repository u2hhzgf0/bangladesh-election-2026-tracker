import { baseApi } from './baseApi';
import { VoteData, ReferendumData } from '../../types';

interface CountdownData {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isElectionDay: boolean;
}

// Vote API endpoints
export const voteApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get current votes
    getCurrentVotes: builder.query<VoteData, void>({
      query: () => '/votes',
      transformResponse: (response: { success: boolean; data: VoteData }) => response.data,
      providesTags: ['Votes'],
    }),

    // Cast a vote
    castVote: builder.mutation<VoteData, { party: 'rice' | 'scale' }>({
      query: (body) => ({
        url: '/votes',
        method: 'POST',
        body,
      }),
      transformResponse: (response: { success: boolean; data: VoteData }) => response.data,
      invalidatesTags: ['Votes'],
    }),

    // Get referendum data
    getReferendum: builder.query<ReferendumData, void>({
      query: () => '/votes/referendum',
      transformResponse: (response: { success: boolean; data: ReferendumData }) => response.data,
      providesTags: ['Referendum'],
    }),

    // Cast referendum vote
    castReferendumVote: builder.mutation<ReferendumData, { choice: 'yes' | 'no' }>({
      query: (body) => ({
        url: '/votes/referendum',
        method: 'POST',
        body,
      }),
      transformResponse: (response: { success: boolean; data: ReferendumData }) => response.data,
      invalidatesTags: ['Referendum'],
    }),

    // Get countdown
    getCountdown: builder.query<CountdownData, void>({
      query: () => '/votes/countdown',
      transformResponse: (response: { success: boolean; data: CountdownData }) => response.data,
      providesTags: ['Countdown'],
    }),
  }),
});

export const {
  useGetCurrentVotesQuery,
  useCastVoteMutation,
  useGetReferendumQuery,
  useCastReferendumVoteMutation,
  useGetCountdownQuery,
} = voteApi;
