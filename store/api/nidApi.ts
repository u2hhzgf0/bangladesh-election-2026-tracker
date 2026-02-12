import { baseApi } from './baseApi';

interface NIDVerificationResult {
  success: boolean;
  isValid: boolean;
  message?: string;
  imagePath?: string;
  name?: string;
  nidNumber?: string;
  hasVoted?: boolean;
  hasVotedInReferendum?: boolean;
}

// NID API endpoints
export const nidApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Verify NID with base64 image
    verifyNID: builder.mutation<NIDVerificationResult, { image: string }>({
      query: (body) => ({
        url: '/nid/verify',
        method: 'POST',
        body,
      }),
      transformResponse: (response: { success: boolean; data: NIDVerificationResult }) => response.data,
    }),

    // Verify NID with file upload (Multer)
    verifyNIDWithUpload: builder.mutation<NIDVerificationResult, FormData>({
      query: (formData) => ({
        url: '/nid/upload',
        method: 'POST',
        body: formData,
        // Don't set Content-Type header, let the browser set it with boundary
        prepareHeaders: (headers: Headers) => {
          headers.delete('Content-Type');
          return headers;
        },
      }),
      transformResponse: (response: { success: boolean; data: NIDVerificationResult }) => response.data,
      invalidatesTags: ['NID'],
    }),

    // Get NID image
    getNIDImage: builder.query<string, string>({
      query: (filename) => `/nid/images/${filename}`,
      providesTags: ['NID'],
    }),
  }),
});

export const {
  useVerifyNIDMutation,
  useVerifyNIDWithUploadMutation,
  useGetNIDImageQuery,
} = nidApi;
