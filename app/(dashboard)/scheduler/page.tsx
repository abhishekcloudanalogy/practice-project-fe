import { Suspense } from "react";
import CalendarView from "@/components/scheduler/CalendarView";

export default function SchedulerCalendarPage() {
  return (
    <Suspense fallback={null}>
      <CalendarView />
    </Suspense>
  );
}
