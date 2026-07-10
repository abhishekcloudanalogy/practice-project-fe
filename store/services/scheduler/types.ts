export type MeetingStatus = "SCHEDULED" | "COMPLETED" | "CANCELLED";
export type MeetingPriority = "LOW" | "MEDIUM" | "HIGH";
export type MeetingType = "INTERNAL" | "EXTERNAL";
export type ResponseStatus = "PENDING" | "ACCEPTED" | "DECLINED" | "TENTATIVE";

export type MeetingParticipant = {
  userId: string;
  name: string;
  email: string;
  responseStatus: ResponseStatus;
};

export type MeetingOrganizer = {
  id: string;
  name: string;
  email: string;
};

export type Meeting = {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  meetingUrl: string;
  status: MeetingStatus;
  priority: MeetingPriority;
  meetingType: MeetingType;
  department: string;
  organizerId: string;
  organizer: MeetingOrganizer;
  participants: MeetingParticipant[];
  recurrenceRule: string | null;
  recurrenceEndDate: string | null;
};


export type MeetingApiRecord = Omit<
  Meeting,
  "startTime" | "endTime" | "participants" | "description" | "location" | "meetingUrl" | "department"
> & {
  startTime: string;
  endTime: string;
  description: string | null;
  location: string | null;
  meetingUrl: string | null;
  department: string | null;
  participants: {
    id: string;
    userId: string;
    responseStatus: ResponseStatus;
    user: { id: string; name: string | null; email: string };
  }[];
};

export type MeetingListApiResponse = {
  meetings: MeetingApiRecord[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
};

export type MeetingListResult = {
  meetings: Meeting[];
  pagination: MeetingListApiResponse["pagination"];
};

export type MeetingFilters = {
  search: string;
  status: "All" | MeetingStatus;
  department: "All" | string;
  organizerId: "All" | string;
};

export type MeetingQueryArgs = Partial<MeetingFilters> & {
  page?: number;
  limit?: number;
  dateFrom?: string;
  dateTo?: string;
};

export type MeetingFormValues = {
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: string;
  meetingUrl: string;
  status: MeetingStatus;
  priority: MeetingPriority;
  meetingType: MeetingType;
  department: string;
  organizerId: string;
  participants: string[];
  recurrenceRule: string | null;       // e.g. "FREQ=WEEKLY" — null means one-off
  recurrenceEndDate: Date | null;

};

export type RecurrenceFrequency = "NONE" | "DAILY" | "WEEKLY" | "MONTHLY";

