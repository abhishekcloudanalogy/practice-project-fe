import { addHours } from "date-fns";
import type {
  Meeting,
  MeetingFormValues,
  MeetingPriority,
  MeetingStatus,
  RecurrenceFrequency,
} from "@/store/services/scheduler/types";

export const statusOptions: Array<"All" | MeetingStatus> = ["All", "SCHEDULED", "COMPLETED", "CANCELLED"];
export const priorityOptions: MeetingPriority[] = ["LOW", "MEDIUM", "HIGH"];
export const departmentOptions = ["Sales", "Delivery", "Engineering", "Customer Success", "Marketing"];


export const repeatOptions: { value: RecurrenceFrequency; label: string }[] = [
  { value: "NONE", label: "Does not repeat" },
  { value: "DAILY", label: "Daily" },
  { value: "WEEKLY", label: "Weekly" },
  { value: "MONTHLY", label: "Monthly" },
];

export const frequencyToRule = (frequency: RecurrenceFrequency): string | null =>
  frequency === "NONE" ? null : `FREQ=${frequency}`;

export const ruleToFrequency = (rule: string | null): RecurrenceFrequency => {
  if (!rule) return "NONE";
  if (rule.includes("FREQ=DAILY")) return "DAILY";
  if (rule.includes("FREQ=WEEKLY")) return "WEEKLY";
  if (rule.includes("FREQ=MONTHLY")) return "MONTHLY";
  return "NONE";
};


export const statusColor: Record<MeetingStatus, string> = {
  SCHEDULED: "blue",
  COMPLETED: "green",
  CANCELLED: "red",
};

export const statusDot: Record<MeetingStatus, string> = {
  SCHEDULED: "#0891b2",
  COMPLETED: "#16a34a",
  CANCELLED: "#dc2626",
};

export const priorityColor: Record<MeetingPriority, string> = {
  LOW: "default",
  MEDIUM: "cyan",
  HIGH: "red",
};

export const emptyFormValues: MeetingFormValues = {
  title: "",
  description: "",
  startTime: new Date(),
  endTime: addHours(new Date(), 1),
  location: "Teams",
  meetingUrl: "",
  status: "SCHEDULED",
  priority: "MEDIUM",
  meetingType: "INTERNAL",
  department: "Sales",
  organizerId: "",
  participants: [],
  recurrenceRule: null,
  recurrenceEndDate: null,
};

// react-big-calendar needs start/end keys regardless of our field names —
// this is the one place that translation happens, so the rest of the app
// can use startTime/endTime consistently.
export const toCalendarEvent = (meeting: Meeting) => ({
  ...meeting,
  start: new Date(meeting.startTime),
  end: new Date(meeting.endTime),
  title: meeting.title,
});

export const getInitials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();