"use client";

import "react-big-calendar/lib/css/react-big-calendar.css";

import { useMemo, useState } from "react";
import { Calendar, dateFnsLocalizer, type EventPropGetter, type SlotInfo, type View } from "react-big-calendar";
import { addHours, format, getDay, isAfter, isSameDay, parse, startOfWeek } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import { Alert, DatePicker } from "antd";
import Input from "@/components/common/Input";
import Select from "@/components/common/Select";

import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import Button from "@/components/common/Button";
import Drawer from "@/components/common/Drawer";
import Modal from "@/components/common/Modal";
import Tag from "@/components/common/Tag";
import {
  BellOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ScheduleOutlined,
  SearchOutlined,
} from "@/components/common/antd/icons";
import { useGetMeetingsQuery } from "@/store/services/scheduler/apiSlice";
import { sampleMeetings, schedulerParticipants } from "@/components/scheduler/data";
import { StyledSchedulerPage } from "@/components/scheduler/SchedulerPage.styles";
import type { Meeting, MeetingFilters, MeetingFormValues, MeetingPriority, MeetingStatus } from "@/store/services/scheduler/types";

const locales = { "en-US": enUS };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const statusOptions: Array<"All" | MeetingStatus> = ["All", "Scheduled", "In Progress", "Completed", "Cancelled"];
const priorityOptions: MeetingPriority[] = ["Low", "Medium", "High"];
const departmentOptions = ["Sales", "Delivery", "Engineering", "Customer Success", "Marketing"];
const organizerOptions = ["Aarav Sharma", "Maya Patel", "Rohan Mehta", "Neha Verma", "Ishaan Rao", "Sara Khan"];

const statusColor: Record<MeetingStatus, string> = {
  Scheduled: "blue",
  "In Progress": "gold",
  Completed: "green",
  Cancelled: "red",
};

const priorityColor: Record<MeetingPriority, string> = {
  Low: "default",
  Medium: "cyan",
  High: "red",
};

const emptyFormValues: MeetingFormValues = {
  title: "",
  description: "",
  start: new Date(),
  end: addHours(new Date(), 1),
  status: "Scheduled",
  priority: "Medium",
  department: "Sales",
  organizer: "Aarav Sharma",
  participants: [],
  location: "Teams",
  meetingUrl: "",
};

const toCalendarEvent = (meeting: Meeting) => ({
  ...meeting,
  start: meeting.start,
  end: meeting.end,
});

const getParticipants = (ids: string[]) => schedulerParticipants.filter((participant) => ids.includes(participant.id));

const createId = () => `meeting-${Date.now()}`;

export default function SchedulerPage() {
  const { data: backendMeetings, isFetching, isError } = useGetMeetingsQuery(undefined, {
    refetchOnMountOrArgChange: false,
  });
  const [localMeetings, setLocalMeetings] = useState<Meeting[]>(sampleMeetings);
  const [filters, setFilters] = useState<MeetingFilters>({
    search: "",
    status: "All",
    department: "All",
    organizer: "All",
  });
  const [calendarView, setCalendarView] = useState<View>("week");
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formValues, setFormValues] = useState<MeetingFormValues>(emptyFormValues);
  const [formError, setFormError] = useState("");

  const meetings = backendMeetings?.length ? backendMeetings : localMeetings;

  const filteredMeetings = useMemo(() => {
    const search = filters.search.trim().toLowerCase();

    return meetings.filter((meeting) => {
      const matchesSearch =
        !search ||
        meeting.title.toLowerCase().includes(search) ||
        meeting.description.toLowerCase().includes(search) ||
        meeting.participants.some((participant) => participant.name.toLowerCase().includes(search));

      return (
        matchesSearch &&
        (filters.status === "All" || meeting.status === filters.status) &&
        (filters.department === "All" || meeting.department === filters.department) &&
        (filters.organizer === "All" || meeting.organizer === filters.organizer)
      );
    });
  }, [filters, meetings]);

  const upcomingMeetings = useMemo(
    () =>
      [...filteredMeetings]
        .filter((meeting) => isAfter(meeting.start, new Date()) || isSameDay(meeting.start, new Date()))
        .sort((a, b) => a.start.getTime() - b.start.getTime())
        .slice(0, 5),
    [filteredMeetings],
  );

  const todayMeetings = filteredMeetings.filter((meeting) => isSameDay(meeting.start, new Date()));
  const calendarEvents = filteredMeetings.map(toCalendarEvent);

  const resetForm = () => {
    setFormValues({ ...emptyFormValues, start: new Date(), end: addHours(new Date(), 1) });
    setEditingMeeting(null);
    setFormError("");
  };

  const openCreateModal = (slot?: SlotInfo) => {
    const start = slot?.start ?? new Date();
    setFormValues({
      ...emptyFormValues,
      start,
      end: slot?.end && isAfter(slot.end, start) ? slot.end : addHours(start, 1),
    });
    setEditingMeeting(null);
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (meeting: Meeting) => {
    setEditingMeeting(meeting);
    setFormValues({
      title: meeting.title,
      description: meeting.description,
      start: meeting.start,
      end: meeting.end,
      status: meeting.status,
      priority: meeting.priority,
      department: meeting.department,
      organizer: meeting.organizer,
      participants: meeting.participants.map((participant) => participant.id),
      location: meeting.location,
      meetingUrl: meeting.meetingUrl ?? "",
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const saveMeeting = () => {
    if (!formValues.title.trim()) {
      setFormError("Meeting title is required.");
      return;
    }

    if (!isAfter(formValues.end, formValues.start)) {
      setFormError("End time must be after start time.");
      return;
    }

    if (!formValues.participants.length) {
      setFormError("Add at least one participant.");
      return;
    }

    const nextMeeting: Meeting = {
      id: editingMeeting?.id ?? createId(),
      ...formValues,
      title: formValues.title.trim(),
      description: formValues.description.trim(),
      participants: getParticipants(formValues.participants),
      meetingUrl: formValues.meetingUrl?.trim() || undefined,
    };

    setLocalMeetings((current) =>
      editingMeeting
        ? current.map((meeting) => (meeting.id === editingMeeting.id ? nextMeeting : meeting))
        : [nextMeeting, ...current],
    );
    setSelectedMeeting(nextMeeting);
    closeModal();
  };

  const deleteMeeting = (meetingId: string) => {
    setLocalMeetings((current) => current.filter((meeting) => meeting.id !== meetingId));
    setSelectedMeeting(null);
  };

  const setDateField = (field: "start" | "end", value: Dayjs | null) => {
    if (!value) return;

    setFormValues((current) => ({
      ...current,
      [field]: value.toDate(),
    }));
  };

  const eventStyleGetter: EventPropGetter<Meeting> = (event) => {
    const backgroundColor =
      event.status === "Completed" ? "#16a34a" : event.status === "Cancelled" ? "#dc2626" : event.priority === "High" ? "#0284c7" : "#0891b2";

    return {
      style: {
        backgroundColor,
        color: "#ffffff",
      },
    };
  };

  return (
    <StyledSchedulerPage>
      <div className="scheduler-shell">
        <section className="scheduler-hero">
          <div>
            <p className="scheduler-kicker">Smart Meeting Scheduler</p>
            <h1 className="scheduler-title">Plan, filter, and manage meetings in one calendar.</h1>
            <p className="scheduler-copy">
              Create meetings, assign participants, inspect details, and switch between month, week, day, and agenda views.
            </p>
          </div>
          <div className="scheduler-hero-actions">
            <Button type="primary" size="large" icon={<PlusOutlined />} onClick={() => openCreateModal()}>
              Create Meeting
            </Button>
            <Button size="large" icon={<ScheduleOutlined />} onClick={() => setCalendarView("month")}>
              Month View
            </Button>
          </div>
        </section>

        <section className="scheduler-metrics">
          <div className="scheduler-metric">
            <p className="scheduler-metric__label">Visible meetings</p>
            <p className="scheduler-metric__value">{filteredMeetings.length}</p>
          </div>
          <div className="scheduler-metric">
            <p className="scheduler-metric__label">Today</p>
            <p className="scheduler-metric__value">{todayMeetings.length}</p>
          </div>
          <div className="scheduler-metric">
            <p className="scheduler-metric__label">Upcoming</p>
            <p className="scheduler-metric__value">{upcomingMeetings.length}</p>
          </div>
          <div className="scheduler-metric">
            <p className="scheduler-metric__label">High priority</p>
            <p className="scheduler-metric__value">{filteredMeetings.filter((meeting) => meeting.priority === "High").length}</p>
          </div>
        </section>

       

        <section className="scheduler-grid">
          <div className="scheduler-panel">
            <div className="scheduler-toolbar">
              <Input
                allowClear
                prefix={<SearchOutlined />}
                placeholder="Search meetings or people"
                value={filters.search}
                onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
              />
              <Select
                value={filters.status}
                options={statusOptions.map((status) => ({ value: status, label: status }))}
                onChange={(status) => setFilters((current) => ({ ...current, status }))}
              />
              <Select
                value={filters.department}
                options={["All", ...departmentOptions].map((department) => ({ value: department, label: department }))}
                onChange={(department) => setFilters((current) => ({ ...current, department }))}
              />
              <Select
                value={filters.organizer}
                options={["All", ...organizerOptions].map((organizer) => ({ value: organizer, label: organizer }))}
                onChange={(organizer) => setFilters((current) => ({ ...current, organizer }))}
              />
            </div>
            <div className="scheduler-calendar-wrap">
              <Calendar
                localizer={localizer}
                events={calendarEvents}
                startAccessor="start"
                endAccessor="end"
                titleAccessor="title"
                views={["month", "week", "day", "agenda"]}
                view={calendarView}
                onView={setCalendarView}
                selectable
                popup
                step={30}
                timeslots={2}
                onSelectSlot={openCreateModal}
                onSelectEvent={(event) => setSelectedMeeting(event)}
                eventPropGetter={eventStyleGetter}
                style={{ minHeight: 650 }}
              />
            </div>
          </div>

          <aside className="scheduler-side">
            <div className="scheduler-side-panel">
              <p className="scheduler-side-title">
                <BellOutlined /> Upcoming
              </p>
              <p className="scheduler-side-copy">Next meetings from the active filters.</p>
              <div className="meeting-list">
                {upcomingMeetings.map((meeting) => (
                  <button key={meeting.id} className="meeting-card" type="button" onClick={() => setSelectedMeeting(meeting)}>
                    <span className="meeting-card__top">
                      <span>
                        <span className="meeting-card__title">{meeting.title}</span>
                        <span className="meeting-card__meta">
                          {format(meeting.start, "MMM d, h:mm a")} - {meeting.department}
                        </span>
                      </span>
                      <Tag color={statusColor[meeting.status]}>{meeting.status}</Tag>
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="scheduler-side-panel">
              <p className="scheduler-side-title">Quick Filters</p>
              <p className="scheduler-side-copy">Jump into the views your team checks most often.</p>
              <div className="meeting-list">
                <Button onClick={() => setFilters((current) => ({ ...current, status: "Scheduled" }))}>Scheduled only</Button>
                <Button onClick={() => setFilters((current) => ({ ...current, department: "Sales" }))}>Sales calendar</Button>
                <Button onClick={() => setFilters({ search: "", status: "All", department: "All", organizer: "All" })}>Reset filters</Button>
              </div>
            </div>
          </aside>
        </section>
      </div>

      <Drawer
        title={selectedMeeting?.title}
        open={Boolean(selectedMeeting)}
        width={430}
        onClose={() => setSelectedMeeting(null)}
        extra={
          selectedMeeting ? (
            <div style={{ display: "flex", gap: 8 }}>
              <Button icon={<EditOutlined />} onClick={() => openEditModal(selectedMeeting)} />
              <Button danger icon={<DeleteOutlined />} onClick={() => deleteMeeting(selectedMeeting.id)} />
            </div>
          ) : null
        }
      >
        {selectedMeeting ? (
          <div className="meeting-drawer-stack">
            <div>
              <Tag color={statusColor[selectedMeeting.status]}>{selectedMeeting.status}</Tag>{" "}
              <Tag color={priorityColor[selectedMeeting.priority]}>{selectedMeeting.priority} Priority</Tag>
            </div>
            <div className="meeting-detail-row">
              <span className="meeting-detail-label">When</span>
              <span className="meeting-detail-value">
                {format(selectedMeeting.start, "EEEE, MMMM d, yyyy")} from {format(selectedMeeting.start, "h:mm a")} to{" "}
                {format(selectedMeeting.end, "h:mm a")}
              </span>
            </div>
            <div className="meeting-detail-row">
              <span className="meeting-detail-label">Organizer</span>
              <span className="meeting-detail-value">{selectedMeeting.organizer}</span>
            </div>
            <div className="meeting-detail-row">
              <span className="meeting-detail-label">Location</span>
              <span className="meeting-detail-value">{selectedMeeting.location}</span>
            </div>
            <div className="meeting-detail-row">
              <span className="meeting-detail-label">Description</span>
              <span className="meeting-detail-value">{selectedMeeting.description || "No description added."}</span>
            </div>
            <div className="meeting-detail-row">
              <span className="meeting-detail-label">Participants</span>
              <span className="meeting-participants">
                {selectedMeeting.participants.map((participant) => (
                  <Tag key={participant.id}>{participant.name}</Tag>
                ))}
              </span>
            </div>
          </div>
        ) : null}
      </Drawer>

      <Modal
        title={editingMeeting ? "Edit meeting" : "Create meeting"}
        open={isModalOpen}
        onCancel={closeModal}
        width={760}
        footer={[
          <Button key="cancel" onClick={closeModal}>
            Cancel
          </Button>,
          <Button key="save" type="primary" onClick={saveMeeting} loading={isFetching}>
            {editingMeeting ? "Save Changes" : "Create Meeting"}
          </Button>,
        ]}
      >
        <div className="meeting-form-grid">
          {formError ? (
            <div className="meeting-form-field meeting-form-field--wide">
              <Alert type="error" showIcon message={formError} />
            </div>
          ) : null}

          <label className="meeting-form-field meeting-form-field--wide">
            <span className="meeting-form-label">Title</span>
            <Input value={formValues.title} onChange={(event) => setFormValues((current) => ({ ...current, title: event.target.value }))} />
          </label>

          <label className="meeting-form-field meeting-form-field--wide">
            <span className="meeting-form-label">Description</span>
            <Input.TextArea
              rows={3}
              value={formValues.description}
              onChange={(event) => setFormValues((current) => ({ ...current, description: event.target.value }))}
            />
          </label>

          <label className="meeting-form-field">
            <span className="meeting-form-label">Start Date/Time</span>
            <DatePicker showTime value={dayjs(formValues.start)} onChange={(value) => setDateField("start", value)} />
          </label>

          <label className="meeting-form-field">
            <span className="meeting-form-label">End Date/Time</span>
            <DatePicker showTime value={dayjs(formValues.end)} onChange={(value) => setDateField("end", value)} />
          </label>

          <label className="meeting-form-field">
            <span className="meeting-form-label">Status</span>
            <Select
              value={formValues.status}
              options={statusOptions.filter((status) => status !== "All").map((status) => ({ value: status, label: status }))}
              onChange={(status) => setFormValues((current) => ({ ...current, status }))}
            />
          </label>

          <label className="meeting-form-field">
            <span className="meeting-form-label">Priority</span>
            <Select
              value={formValues.priority}
              options={priorityOptions.map((priority) => ({ value: priority, label: priority }))}
              onChange={(priority) => setFormValues((current) => ({ ...current, priority }))}
            />
          </label>

          <label className="meeting-form-field">
            <span className="meeting-form-label">Department</span>
            <Select
              value={formValues.department}
              options={departmentOptions.map((department) => ({ value: department, label: department }))}
              onChange={(department) => setFormValues((current) => ({ ...current, department }))}
            />
          </label>

          <label className="meeting-form-field">
            <span className="meeting-form-label">Organizer</span>
            <Select
              value={formValues.organizer}
              options={organizerOptions.map((organizer) => ({ value: organizer, label: organizer }))}
              onChange={(organizer) => setFormValues((current) => ({ ...current, organizer }))}
            />
          </label>

          <label className="meeting-form-field meeting-form-field--wide">
            <span className="meeting-form-label">Participants</span>
            <Select
              mode="multiple"
              value={formValues.participants}
              options={schedulerParticipants.map((participant) => ({
                value: participant.id,
                label: `${participant.name} - ${participant.department}`,
              }))}
              onChange={(participants) => setFormValues((current) => ({ ...current, participants }))}
            />
          </label>

          <label className="meeting-form-field">
            <span className="meeting-form-label">Location</span>
            <Input value={formValues.location} onChange={(event) => setFormValues((current) => ({ ...current, location: event.target.value }))} />
          </label>

          <label className="meeting-form-field">
            <span className="meeting-form-label">Meeting URL</span>
            <Input
              value={formValues.meetingUrl}
              onChange={(event) => setFormValues((current) => ({ ...current, meetingUrl: event.target.value }))}
            />
          </label>
        </div>
      </Modal>
    </StyledSchedulerPage>
  );
}
