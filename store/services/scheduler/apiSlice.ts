import baseApi from "@/store/services/baseApi";
import type {
  Meeting,
  MeetingApiRecord,
  MeetingFormValues,
  MeetingListApiResponse,
  MeetingListResult,
  MeetingQueryArgs,
  RecurrenceFrequency,
} from "@/store/services/scheduler/types";

const toMeeting = (record: MeetingApiRecord): Meeting => ({
  ...record,
  description: record.description ?? "",
  location: record.location ?? "",
  meetingUrl: record.meetingUrl ?? "",
  department: record.department ?? "",
  recurrenceRule: record.recurrenceRule ?? null,
  recurrenceEndDate: record.recurrenceEndDate ?? null,
  participants: record.participants.map((p) => ({
    userId: p.userId,
    name: p.user.name ?? p.user.email,
    email: p.user.email,
    responseStatus: p.responseStatus,
  })),
});

const toDateString = (value: Date | string | null | undefined) => {
  if (!value) return undefined;
  return value instanceof Date ? value.toISOString() : value;
};

// Shared normalization for optional string fields: "" -> undefined so the
// backend's Zod `.optional().nullable()` fields behave as "not provided"
// rather than "explicitly empty string".
const toPayload = (values: MeetingFormValues) => ({
  title: values.title,
  description: values.description || undefined,
  startTime: toDateString(values.startTime),
  endTime: toDateString(values.endTime),
  location: values.location || undefined,
  meetingUrl: values.meetingUrl || undefined,
  status: values.status,
  priority: values.priority,
  meetingType: values.meetingType,
  department: values.department || undefined,
  organizerId: values.organizerId || undefined,
  participants: values.participants,
  recurrenceRule: values.recurrenceRule || undefined,
  recurrenceEndDate: toDateString(values.recurrenceEndDate),
});

// Partial variant for PUT — only normalizes fields that were actually
// provided, so untouched fields aren't accidentally sent as undefined
// and dropped, and cleared fields ("") are sent as undefined rather than "".
const toUpdatePayload = (values: Partial<MeetingFormValues>) => {
  const payload: Record<string, unknown> = { ...values };

  if (values.description !== undefined) payload.description = values.description || undefined;
  if (values.location !== undefined) payload.location = values.location || undefined;
  if (values.meetingUrl !== undefined) payload.meetingUrl = values.meetingUrl || undefined;
  if (values.department !== undefined) payload.department = values.department || undefined;
  if (values.organizerId !== undefined) payload.organizerId = values.organizerId || undefined;
  if (values.startTime !== undefined) payload.startTime = toDateString(values.startTime);
  if (values.endTime !== undefined) payload.endTime = toDateString(values.endTime);
  if (values.recurrenceRule !== undefined) payload.recurrenceRule = values.recurrenceRule || undefined;
  if (values.recurrenceEndDate !== undefined) payload.recurrenceEndDate = toDateString(values.recurrenceEndDate);

  return payload;
};

export type EditScope = "occurrence" | "series";

export const schedulerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMeetings: builder.query<MeetingListResult, MeetingQueryArgs | void>({
      query: (args) => ({
        url: "/api/scheduler",
        params: args ?? {},
      }),
      transformResponse: (response: { data: MeetingListApiResponse }) => ({
        meetings: response.data.meetings.map(toMeeting),
        pagination: response.data.pagination,
      }),
      providesTags: ["Meeting"],
    }),
    getMeeting: builder.query<Meeting, string>({
      // id may be a virtual instance id ("parentId::2026-07-14") — the
      // backend already knows how to split and resolve this.
      query: (id) => `/api/scheduler/${id}`,
      transformResponse: (response: { data: MeetingApiRecord }) => toMeeting(response.data),
      providesTags: (result, error, id) => [{ type: "Meeting", id }],
    }),
    createMeeting: builder.mutation<Meeting, MeetingFormValues>({
      query: (values) => ({
        url: "/api/scheduler",
        method: "POST",
        body: toPayload(values),
      }),
      transformResponse: (response: { data: MeetingApiRecord }) => toMeeting(response.data),
      invalidatesTags: ["Meeting"],
    }),
    updateMeeting: builder.mutation<Meeting, { id: string; values: Partial<MeetingFormValues>; scope?: EditScope }>({
      query: ({ id, values, scope }) => ({
        url: `/api/scheduler/${id}`,
        method: "PUT",
        params: scope ? { scope } : undefined,
        body: toUpdatePayload(values),
      }),
      transformResponse: (response: { data: MeetingApiRecord }) => toMeeting(response.data),
      invalidatesTags: (result, error, { id }) => ["Meeting", { type: "Meeting", id }],
    }),
    deleteMeeting: builder.mutation<{ id: string }, { id: string; scope?: EditScope }>({
      query: ({ id, scope }) => ({
        url: `/api/scheduler/${id}`,
        method: "DELETE",
        params: scope ? { scope } : undefined,
      }),
      transformResponse: (response: { data: { id: string } }) => ({ id: response.data.id }),
      invalidatesTags: (result, error, { id }) => ["Meeting", { type: "Meeting", id }],
    }),
  }),
});

export const {
  useGetMeetingsQuery,
  useGetMeetingQuery,
  useCreateMeetingMutation,
  useUpdateMeetingMutation,
  useDeleteMeetingMutation,
} = schedulerApi;