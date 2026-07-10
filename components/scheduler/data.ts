import { addDays, addHours, setHours, setMinutes } from "date-fns";
import type { Meeting, MeetingParticipant } from "../../store/services/scheduler/types";

export const schedulerParticipants: MeetingParticipant[] = [
  { id: "u-1", name: "Aarav Sharma", email: "aarav.sharma@cloudanalogy.com", department: "Sales" },
  { id: "u-2", name: "Maya Patel", email: "maya.patel@cloudanalogy.com", department: "Delivery" },
  { id: "u-3", name: "Rohan Mehta", email: "rohan.mehta@cloudanalogy.com", department: "Engineering" },
  { id: "u-4", name: "Neha Verma", email: "neha.verma@cloudanalogy.com", department: "Customer Success" },
  { id: "u-5", name: "Ishaan Rao", email: "ishaan.rao@cloudanalogy.com", department: "Marketing" },
  { id: "u-6", name: "Sara Khan", email: "sara.khan@cloudanalogy.com", department: "Sales" },
];

const atTime = (date: Date, hour: number, minute = 0) => setMinutes(setHours(date, hour), minute);

const today = new Date();

export const sampleMeetings: Meeting[] = [
  {
    id: "meeting-1",
    title: "Pipeline Review",
    description: "Review open opportunities, stalled deals, and next actions for enterprise accounts.",
    start: atTime(today, 10, 30),
    end: atTime(today, 11, 30),
    status: "Scheduled",
    priority: "High",
    department: "Sales",
    organizer: "Aarav Sharma",
    participants: [schedulerParticipants[0], schedulerParticipants[5], schedulerParticipants[3]],
    location: "Teams",
    meetingUrl: "https://teams.microsoft.com/l/meetup-join/pipeline-review",
  },
  {
    id: "meeting-2",
    title: "Implementation Sync",
    description: "Confirm release tasks, blockers, QA ownership, and customer handoff notes.",
    start: atTime(addDays(today, 1), 14),
    end: atTime(addDays(today, 1), 15),
    status: "Scheduled",
    priority: "Medium",
    department: "Delivery",
    organizer: "Maya Patel",
    participants: [schedulerParticipants[1], schedulerParticipants[2], schedulerParticipants[3]],
    location: "Conference Room B",
  },
  {
    id: "meeting-3",
    title: "Product Demo Prep",
    description: "Prepare flow, demo data, and ownership for the customer presentation.",
    start: atTime(addDays(today, 2), 12, 30),
    end: addHours(atTime(addDays(today, 2), 12, 30), 1),
    status: "In Progress",
    priority: "High",
    department: "Engineering",
    organizer: "Rohan Mehta",
    participants: [schedulerParticipants[2], schedulerParticipants[0], schedulerParticipants[4]],
    location: "Teams",
    meetingUrl: "https://teams.microsoft.com/l/meetup-join/demo-prep",
  },
  {
    id: "meeting-4",
    title: "Customer Health Check",
    description: "Walk through open issues, adoption health, risks, and renewal notes.",
    start: atTime(addDays(today, -1), 16),
    end: atTime(addDays(today, -1), 16, 45),
    status: "Completed",
    priority: "Medium",
    department: "Customer Success",
    organizer: "Neha Verma",
    participants: [schedulerParticipants[3], schedulerParticipants[1]],
    location: "Teams",
  },
  {
    id: "meeting-5",
    title: "Campaign Planning",
    description: "Plan launch messaging, channels, owner assignments, and first-week reporting.",
    start: atTime(addDays(today, 5), 9, 30),
    end: atTime(addDays(today, 5), 10, 15),
    status: "Scheduled",
    priority: "Low",
    department: "Marketing",
    organizer: "Ishaan Rao",
    participants: [schedulerParticipants[4], schedulerParticipants[5]],
    location: "Marketing War Room",
  },
];
