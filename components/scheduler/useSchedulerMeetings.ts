"use client";

import {
  useGetMeetingsQuery,
  useCreateMeetingMutation,
  useUpdateMeetingMutation,
  useDeleteMeetingMutation,
  type EditScope,
} from "@/store/services/scheduler/apiSlice";
import type { Meeting, MeetingFormValues } from "@/store/services/scheduler/types";

export function useSchedulerMeetings() {
  const {
    data,
    isFetching,
    isError,
    refetch,
  } = useGetMeetingsQuery();

  const meetings = data?.meetings ?? [];
  const pagination = data?.pagination;

  const [createMeetingMutation] = useCreateMeetingMutation();
  const [updateMeetingMutation] = useUpdateMeetingMutation();
  const [deleteMeetingMutation] = useDeleteMeetingMutation();

  const saveMeeting = async (
    values: MeetingFormValues,
    editingId?: string,
    scope: EditScope = "series",
  ): Promise<Meeting> => {
    const payload: MeetingFormValues = {
      ...values,
      title: values.title.trim(),
      description: values.description.trim(),
      meetingUrl: values.meetingUrl?.trim() || "",
    };

    if (editingId) {
      return updateMeetingMutation({ id: editingId, values: payload, scope }).unwrap();
    }
    return createMeetingMutation(payload).unwrap();
  };

  const deleteMeeting = async (meetingId: string, scope: EditScope = "series") => {
    await deleteMeetingMutation({ id: meetingId, scope }).unwrap();
  };

  const findMeeting = (meetingId: string): Meeting | undefined =>
    meetings.find((meeting) => meeting.id === meetingId);

  return {
    meetings,
    pagination,
    isFetching,
    isError,
    saveMeeting,
    deleteMeeting,
    findMeeting,
    refetch,
  };
}