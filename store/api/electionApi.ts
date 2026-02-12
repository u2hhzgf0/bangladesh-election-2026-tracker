import { baseApi } from './baseApi';
import { NewsInsight, Candidate } from '../../types';

// Election API endpoints
export const electionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get election insights
    getInsights: builder.query<NewsInsight[], void>({
      query: () => '/election/insights',
      transformResponse: (response: { success: boolean; data: NewsInsight[] }) => response.data,
      providesTags: ['Insights'],
    }),

    // Get candidate profiles
    getCandidates: builder.query<Candidate[], void>({
      query: () => '/election/candidates',
      transformResponse: (response: { success: boolean; data: Candidate[] }) => response.data,
      providesTags: ['Candidates'],
    }),
  }),
});

export const {
  useGetInsightsQuery,
  useGetCandidatesQuery,
} = electionApi;
