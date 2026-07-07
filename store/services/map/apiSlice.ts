import { baseApi } from '../baseApi';
import type { ApiResponse } from '../types';

export interface SavedLocation {
  id: string;
  userId: string;
  label?: string;
  latitude: number;
  longitude: number;
  shareToken: string;
  createdAt: string;
  updatedAt: string;
}

export interface SaveLocationPayload {
  latitude: number;
  longitude: number;
  label?: string;
}

export const mapApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    saveLocation: builder.mutation<ApiResponse<SavedLocation>, SaveLocationPayload>({
      query: (body) => ({ url: '/api/map', method: 'POST', body }),
      invalidatesTags: [{ type: 'SavedLocation', id: 'LIST' }],
    }),

    getSavedLocations: builder.query<SavedLocation[], void>({
      query: () => '/api/map',
      transformResponse: (response: ApiResponse<SavedLocation[]>) =>
        Array.isArray(response.data) ? response.data : [],
      providesTags: [{ type: 'SavedLocation', id: 'LIST' }],
    }),
  }),
  overrideExisting: process.env.NODE_ENV === 'development',
});

export const { useSaveLocationMutation, useGetSavedLocationsQuery } = mapApi;
