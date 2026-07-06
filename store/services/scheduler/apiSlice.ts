import baseApi from "@/store/services/baseApi";
import type { Meeting, MeetingApiRecord, MeetingFormValues } from "@/store/services/scheduler/types";

const toMeeting = (meeting: MeetingApiRecord): Meeting => ({
  ...meeting,
  start: new Date(meeting.start),
  end: new Date(meeting.end),
});

const toPayload = (meeting: MeetingFormValues | Meeting): Omit<MeetingApiRecord, "id"> & { id?: string } => ({
  ...meeting,
  start: meeting.start.toISOString(),
  end: meeting.end.toISOString(),
});

export const schedulerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMeetings: builder.query<Meeting[], void>({
      query: () => "/meetings",
      transformResponse: (response: MeetingApiRecord[]) => response.map(toMeeting),
      providesTags: ["Meeting"],
    }),
    createMeeting: builder.mutation<Meeting, MeetingFormValues>({
      query: (meeting) => ({
        url: "/meetings",
        method: "POST",
        body: toPayload(meeting),
      }),
      transformResponse: (response: MeetingApiRecord) => toMeeting(response),
      invalidatesTags: ["Meeting"],
    }),
    updateMeeting: builder.mutation<Meeting, Meeting>({
      query: (meeting) => ({
        url: `/meetings/${meeting.id}`,
        method: "PUT",
        body: toPayload(meeting),
      }),
      transformResponse: (response: MeetingApiRecord) => toMeeting(response),
      invalidatesTags: ["Meeting"],
    }),
    deleteMeeting: builder.mutation<{ id: string }, string>({
      query: (id) => ({
        url: `/meetings/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Meeting"],
    }),
  }),
});

export const {
  useGetMeetingsQuery,
  useCreateMeetingMutation,
  useUpdateMeetingMutation,
  useDeleteMeetingMutation,
} = schedulerApi;
