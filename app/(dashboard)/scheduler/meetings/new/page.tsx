"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Alert } from "antd";
import { addHours, subDays } from "date-fns";
import { useSession } from "next-auth/react";

import { emptyFormValues } from "@/components/scheduler/constants";
import { useSchedulerMeetings } from "@/components/scheduler/useSchedulerMeetings";
import MeetingForm from "@/components/scheduler/MeetingForm";
import type { MeetingFormValues } from "@/store/services/scheduler/types";


function buildInitialValues(searchParams: URLSearchParams): MeetingFormValues {
  const startParam = searchParams.get("start");
  const endParam = searchParams.get("end");

  if (!startParam) {
    return emptyFormValues;
  }

  const rawStart = new Date(startParam);
  if (Number.isNaN(rawStart.getTime())) {
    return emptyFormValues;
  }

  const rawEnd = endParam ? new Date(endParam) : null;
  const hasValidEnd = rawEnd && !Number.isNaN(rawEnd.getTime()) && rawEnd > rawStart;

  const isMidnight = (date: Date) =>
    date.getHours() === 0 && date.getMinutes() === 0 && date.getSeconds() === 0;

  const isMonthViewSlotSelection = isMidnight(rawStart) && (!hasValidEnd || isMidnight(rawEnd));

  if (isMonthViewSlotSelection) {
    const start = new Date(rawStart);
    start.setHours(9, 0, 0, 0);
    const end = addHours(start, 1);

    // Month view's `end` is exclusive (day after the last selected day),
    // so convert to inclusive before using it as the repeat-until date.
    const inclusiveEnd = hasValidEnd ? subDays(rawEnd, 1) : null;
    const spansMultipleDays = inclusiveEnd && inclusiveEnd.getTime() - rawStart.getTime() >= 24 * 60 * 60 * 1000;

    return {
      ...emptyFormValues,
      startTime: start,
      endTime: end,
      recurrenceRule: spansMultipleDays ? "FREQ=DAILY" : null,
      recurrenceEndDate: spansMultipleDays ? inclusiveEnd : null,
    };
  }

  const end = hasValidEnd ? rawEnd : addHours(rawStart, 1);
  return { ...emptyFormValues, startTime: rawStart, endTime: end };
}

function NewMeetingPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { saveMeeting } = useSchedulerMeetings();
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const initialValues = {
    ...buildInitialValues(searchParams),
    organizerId: session?.user?.id ?? "",
  };

  const handleSubmit = async (values: MeetingFormValues) => {
    setIsSubmitting(true);
    setSubmitError("");
    try {
      const meeting = await saveMeeting(values);
      router.push(`/scheduler/meetings/${meeting.id}`);
    } catch {
      setSubmitError("Couldn't create the meeting. Please check the details and try again.");
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
        submitLabel="Create Meeting"
        submitting={isSubmitting}
        onCancel={() => router.push("/scheduler")}
        onSubmit={handleSubmit}
        isEditMode={false}
      />
    </section>
  );
}

export default function NewMeetingPage() {
  return (
    <Suspense fallback={null}>
      <NewMeetingPageContent />
    </Suspense>
  );
}