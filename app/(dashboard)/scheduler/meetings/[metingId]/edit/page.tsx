"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Alert } from "antd";
import Button from "@/components/common/Button";
import { useSchedulerMeetings } from "@/components/scheduler/useSchedulerMeetings";
import { useGetMeetingQuery } from "@/store/services/scheduler/apiSlice";
import MeetingForm from "@/components/scheduler/MeetingForm";
import type { MeetingFormValues } from "@/store/services/scheduler/types";

export default function EditMeetingPage() {
  const params = useParams<{ metingId: string }>();
  const router = useRouter();
  const { saveMeeting } = useSchedulerMeetings();
  const { data: meeting, isLoading } = useGetMeetingQuery(params.metingId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  if (isLoading) {
    return <section className="scheduler-panel"><p className="scheduler-empty">Loading...</p></section>;
  }

  if (!meeting) {
    return (
      <section className="scheduler-panel">
        <p className="scheduler-empty">This meeting couldn&apos;t be found. It may have been deleted.</p>
        <Button onClick={() => router.push("/scheduler/meetings")}>Back to meetings</Button>
      </section>
    );
  }

  const initialValues: MeetingFormValues = {
    title: meeting.title,
    description: meeting.description,
    startTime: new Date(meeting.startTime),
    endTime: new Date(meeting.endTime),
    status: meeting.status,
    priority: meeting.priority,
    meetingType: meeting.meetingType,
    department: meeting.department,
    organizerId: meeting.organizerId,
    participants: meeting.participants.map((participant) => participant.userId),
    location: meeting.location,
    meetingUrl: meeting.meetingUrl ?? "",
    recurrenceRule: meeting.recurrenceRule ?? null,
    recurrenceEndDate: meeting.recurrenceEndDate ? new Date(meeting.recurrenceEndDate) : null,
  };

  const handleSubmit = async (values: MeetingFormValues) => {
    setIsSubmitting(true);
    setSubmitError("");
    try {
      const updated = await saveMeeting(values, meeting.id);
      router.push(`/scheduler/meetings/${updated.id}`);
    } catch {
      setSubmitError("Couldn't save changes. Please check the details and try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <section className="scheduler-panel">

      {submitError ? (
        <Alert type="error" title={submitError} showIcon closable onClose={() => setSubmitError("")} style={{ marginBottom: 16 }} />
      ) : null}
      <MeetingForm
        initialValues={initialValues}
        submitLabel="Edit Meeting"
        submitting={isSubmitting}
        isEditMode={true}
        onCancel={() => router.push(`/scheduler/meetings/${meeting.id}`)}
        onSubmit={handleSubmit}
      />
    </section>
  );
}