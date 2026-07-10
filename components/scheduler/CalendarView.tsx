"use client";

import { useMemo, useState } from "react";
import { Calendar, dateFnsLocalizer, type EventPropGetter, type View } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, getDay, isAfter, isSameDay, parse, startOfWeek } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import { useRouter } from "next/navigation";
import { Alert } from "antd";
import Button from "@/components/common/Button";
import Tag from "@/components/common/Tag";
import { BellOutlined, ClockCircleOutlined, ArrowLeftOutlined, ArrowRightOutlined, RetweetOutlined } from "@/components/common/antd/icons";
import MetricsBar from "@/components/scheduler/MetricsBar";
import FiltersToolbar from "@/components/scheduler/FiltersToolbar";
import { useSchedulerFilters } from "@/components/scheduler/useSchedulerFilters";
import { useSchedulerMeetings } from "@/components/scheduler/useSchedulerMeetings";
import { priorityColor, statusColor, statusDot, toCalendarEvent } from "@/components/scheduler/constants";
import { getIndianFestivals } from "@/components/scheduler/holidays";
import type { Meeting } from "@/store/services/scheduler/types";
import {
  CalendarWrapper,
  SidePanelSection,
  SidePanelTitle,
  SidePanelCopy,
  MeetingList,
  MeetingCardButton,
  MeetingCardTop,
  MeetingCardContent,
  MeetingCardTitle,
  MeetingCardMeta,
  MeetingCardTags,
  EmptyMeetingState,
  SidePanel,
} from "@/components/scheduler/CalendarView.styles";

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

interface CustomToolbarProps {
  date: Date;
  onNavigate: (action: "PREV" | "TODAY" | "NEXT") => void;
  onView: (view: View) => void;
  view: View;
  views: View[];
  localizer: any;
}

// Meeting ids for recurring occurrences look like "parentId::2026-07-14" —
// encode them so the "::" survives as a single URL path segment rather
// than being misread as part of the route structure.
const meetingDetailPath = (meetingId: string) => `/scheduler/meetings/${encodeURIComponent(meetingId)}`;

function CustomToolbar({ date, onNavigate, onView, view, views }: CustomToolbarProps) {
  return (
    <div className="rbc-toolbar">
      <div className="rbc-btn-group">
        <Button variant="bgclear" htmlType="button" onClick={() => onNavigate("PREV")}>
          <ArrowLeftOutlined />
        </Button>
        <Button variant="bgclear" htmlType="button" onClick={() => onNavigate("TODAY")}>
          Today
        </Button>
        <Button variant="bgclear" htmlType="button" onClick={() => onNavigate("NEXT")}>
          <ArrowRightOutlined />
        </Button>
      </div>

      <span className="rbc-toolbar-label">{format(date, "MMMM yyyy")}</span>

      <div className="rbc-btn-group">
        {views.map((v) => (
          <Button
            key={v}
            variant="link"
            htmlType="button"
            className={view === v ? "rbc-active" : ""}
            onClick={() => onView(v as View)}
          >
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </Button>
        ))}
      </div>
    </div>
  );
}

export default function CalendarView() {
  const router = useRouter();
  const { filters } = useSchedulerFilters();
  const { meetings, isError } = useSchedulerMeetings();
  const [calendarView, setCalendarView] = useState<View>("month");
  const [calendarDate, setCalendarDate] = useState(new Date());

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
        (filters.organizerId === "All" || meeting.organizerId === filters.organizerId)
      );
    });
  }, [filters, meetings]);

  const upcomingMeetings = useMemo(
    () =>
      [...filteredMeetings]
        .filter((meeting) => isAfter(new Date(meeting.startTime), new Date()) || isSameDay(new Date(meeting.startTime), new Date()))
        .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
        .slice(0, 5),
    [filteredMeetings],
  );

  const calendarEvents = useMemo(() => {
    const meetingEvents = filteredMeetings.map(toCalendarEvent);
    const year = calendarDate.getFullYear();
    const festivals = getIndianFestivals(year);
    return [...meetingEvents, ...festivals];
  }, [filteredMeetings, calendarDate]);

  const eventStyleGetter: EventPropGetter<Meeting | any> = (event) => {
    if (event.isHoliday) {
      return {
        style: {
          backgroundColor: "#e2e8f0",
          color: "#475569",
          borderRadius: 6,
          border: "1px solid #cbd5e1",
          fontWeight: 600,
        },
      };
    }

    const backgroundColor =
      event.status === "COMPLETED"
        ? "#16a34a"
        : event.status === "CANCELLED"
          ? "#dc2626"
          : event.priority === "HIGH"
            ? "#0284c7"
            : "#0891b2";

    // Recurring instances get a dashed border so they're visually
    // distinguishable from one-off meetings at a glance.
    const isRecurring = Boolean(event.isVirtualRecurrence || event.recurrenceRule);

    return {
      style: {
        backgroundColor,
        color: "#ffffff",
        borderRadius: 6,
        border: isRecurring ? "1px dashed rgba(255,255,255,0.7)" : "none",
      },
    };
  };

  return (
    <>
      {isError ? (
        <Alert type="warning" title="Couldn't load meetings from the server. Please try again shortly." showIcon closable style={{ marginBottom: 16 }} />
      ) : null}
      <MetricsBar meetings={filteredMeetings} />

      <section className="scheduler-grid">
        <div className="scheduler-panel" style={{ padding: 24 }}>
          <div style={{ marginBottom: 20 }}>
            <FiltersToolbar />
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 20, fontSize: 13, color: "#475569" }}>
            {(Object.keys(statusDot) as Array<keyof typeof statusDot>).map((status) => (
              <span key={status} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    backgroundColor: statusDot[status],
                    display: "inline-block",
                  }}
                />
                {status}
              </span>
            ))}
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  backgroundColor: "#e2e8f0",
                  display: "inline-block",
                  border: "1px solid #cbd5e1",
                }}
              />
              Holiday
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <RetweetOutlined style={{ fontSize: 12 }} />
              Recurring (dashed border)
            </span>
          </div>

          <CalendarWrapper>
            <Calendar
              localizer={localizer}
              events={calendarEvents}
              startAccessor="start"
              endAccessor="end"
              titleAccessor="title"
              views={["month", "week", "day", "agenda"]}
              view={calendarView}
              date={calendarDate}
              onView={setCalendarView}
              onNavigate={setCalendarDate}
              selectable
              popup
              step={30}
              timeslots={2}
              onSelectSlot={(slotInfo) => {
                const params = new URLSearchParams({
                  start: slotInfo.start.toISOString(),
                  end: slotInfo.end.toISOString(),
                });
                router.push(`/scheduler/meetings/new?${params.toString()}`);
              }}
              onSelectEvent={(event: any) => {
                if (event.isHoliday) return;
                router.push(meetingDetailPath(event.id));
              }}
              eventPropGetter={eventStyleGetter}
              style={{ height: 680 }}
              components={{
                toolbar: (props: any) => (
                  <CustomToolbar
                    {...props}
                    onNavigate={(action: "PREV" | "TODAY" | "NEXT") => {
                      if (action === "TODAY") {
                        setCalendarDate(new Date());
                      } else if (action === "NEXT") {
                        const newDate = new Date(calendarDate);
                        if (calendarView === "month") newDate.setMonth(newDate.getMonth() + 1);
                        else if (calendarView === "week") newDate.setDate(newDate.getDate() + 7);
                        else if (calendarView === "day") newDate.setDate(newDate.getDate() + 1);
                        setCalendarDate(newDate);
                      } else if (action === "PREV") {
                        const newDate = new Date(calendarDate);
                        if (calendarView === "month") newDate.setMonth(newDate.getMonth() - 1);
                        else if (calendarView === "week") newDate.setDate(newDate.getDate() - 7);
                        else if (calendarView === "day") newDate.setDate(newDate.getDate() - 1);
                        setCalendarDate(newDate);
                      }
                    }}
                  />
                ),
              }}
            />
          </CalendarWrapper>
        </div>

        <SidePanel>
          <SidePanelSection>
            <SidePanelTitle>
              <BellOutlined /> Upcoming
            </SidePanelTitle>
            <SidePanelCopy>Next meetings from the active filters.</SidePanelCopy>
            <MeetingList>
              {upcomingMeetings.length ? (
                upcomingMeetings.map((meeting) => (
                  <MeetingCardButton key={meeting.id} onClick={() => router.push(meetingDetailPath(meeting.id))}>
                    <MeetingCardTop>
                      <MeetingCardContent>
                        <MeetingCardTitle>
                          {meeting.title}
                          {meeting.recurrenceRule ? <RetweetOutlined style={{ marginLeft: 6, fontSize: 12, color: "#64748b" }} /> : null}
                        </MeetingCardTitle>
                        <MeetingCardMeta>
                          <ClockCircleOutlined /> {format(new Date(meeting.startTime), "MMM d, h:mm a")} &middot; {meeting.department}
                        </MeetingCardMeta>
                      </MeetingCardContent>
                      <MeetingCardTags>
                        <Tag color={statusColor[meeting.status]}>{meeting.status}</Tag>
                        {meeting.priority === "HIGH" ? <Tag color={priorityColor[meeting.priority]}>High</Tag> : null}
                      </MeetingCardTags>
                    </MeetingCardTop>
                  </MeetingCardButton>
                ))
              ) : (
                <EmptyMeetingState>No upcoming meetings match your filters.</EmptyMeetingState>
              )}
            </MeetingList>
          </SidePanelSection>
        </SidePanel>
      </section>
    </>
  );
}