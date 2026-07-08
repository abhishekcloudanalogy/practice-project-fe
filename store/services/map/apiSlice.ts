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

export interface SharedWithMeItem {
  id: string;
  createdAt: string;
  sharedBy: { id: string; name: string | null; email: string };
  location: SavedLocation;
}

export interface SharedByMeItem {
  id: string;
  createdAt: string;
  sharedTo: { id: string; name: string | null; email: string };
  location: SavedLocation;
}

export interface UserForSharing {
  id: string;
  name: string | null;
  email: string;
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

    shareLocation: builder.mutation<ApiResponse<unknown>, { locationId: string; sharedToId: string }>({
      query: (body) => ({ url: '/api/map/share', method: 'POST', body }),
    }),

    getSharedWithMe: builder.query<SharedWithMeItem[], void>({
      query: () => '/api/map/shared-with-me',
      transformResponse: (response: ApiResponse<SharedWithMeItem[]>) =>
        Array.isArray(response.data) ? response.data : [],
      providesTags: [{ type: 'SavedLocation', id: 'SHARED' }],
    }),

    getSharedByMe: builder.query<SharedByMeItem[], void>({
      query: () => '/api/map/shared-by-me',
      transformResponse: (response: ApiResponse<SharedByMeItem[]>) =>
        Array.isArray(response.data) ? response.data : [],
      providesTags: [{ type: 'SavedLocation', id: 'SHARED_BY_ME' }],
    }),

    getUsersForSharing: builder.query<UserForSharing[], void>({
      query: () => '/api/map/users-for-sharing',
      transformResponse: (response: ApiResponse<UserForSharing[]>) =>
        Array.isArray(response.data) ? response.data : [],
    }),
  }),
  overrideExisting: process.env.NODE_ENV === 'development',
});

export const { useSaveLocationMutation, useGetSavedLocationsQuery, useShareLocationMutation, useGetSharedWithMeQuery, useGetSharedByMeQuery, useGetUsersForSharingQuery } = mapApi;
