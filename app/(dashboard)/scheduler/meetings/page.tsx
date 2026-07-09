import { Suspense } from "react";
import MeetingsListView from "@/components/scheduler/MeetingsListView";

export default function SchedulerMeetingsPage() {
  return (
    <Suspense fallback={null}>
      <MeetingsListView />
    </Suspense>
  );
}
