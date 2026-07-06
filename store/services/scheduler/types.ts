export type MeetingStatus = "Scheduled" | "In Progress" | "Completed" | "Cancelled";

export type MeetingPriority = "Low" | "Medium" | "High";

export type MeetingParticipant = {
  id: string;
  name: string;
  email: string;
  department: string;
};

export type Meeting = {
  id: string;
  title: string;
  description: string;
  start: Date;
  end: Date;
  status: MeetingStatus;
  priority: MeetingPriority;
  department: string;
  organizer: string;
  participants: MeetingParticipant[];
  location: string;
  meetingUrl?: string;
};

export type MeetingApiRecord = Omit<Meeting, "start" | "end"> & {
  start: string;
  end: string;
};

export type MeetingFilters = {
  search: string;
  status: "All" | MeetingStatus;
  department: "All" | string;
  organizer: "All" | string;
};

export type MeetingFormValues = {
  title: string;
  description: string;
  start: Date;
  end: Date;
  status: MeetingStatus;
  priority: MeetingPriority;
  department: string;
  organizer: string;
  participants: string[];
  location: string;
  meetingUrl?: string;
};
