"use client";

import { useMemo } from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import Tag from "@/components/common/Tag";
import Button from "@/components/common/Button";
import { Alert } from "antd";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@/components/common/antd/icons";
import MetricsBar from "@/components/scheduler/MetricsBar";
import FiltersToolbar from "@/components/scheduler/FiltersToolbar";
import { useSchedulerFilters } from "@/components/scheduler/useSchedulerFilters";
import { useSchedulerMeetings } from "@/components/scheduler/useSchedulerMeetings";
import { priorityColor, statusColor } from "@/components/scheduler/constants";
import {
  ListViewContainer,
  TableContainer,
  TableHead,
  ActionsHead,
  TableRow,
  TableTitle,
  ActionsCell,
  EmptyState,
   MeetingsAlertContainer,
} from "@/components/scheduler/MeetingsListView.styles";

export default function MeetingsListView() {
  const router = useRouter();
  const { filters } = useSchedulerFilters();
  const { meetings, isError, deleteMeeting } = useSchedulerMeetings();

  const filteredMeetings = useMemo(() => {
    const search = filters.search.trim().toLowerCase();
    const seenSeriesIds = new Set<string>();

    return meetings
      .filter((meeting: any) => {
        // For virtual recurrences, keep only the first occurrence per series
        if (meeting.isVirtualRecurrence) {
          const seriesId = meeting.seriesParentId ?? meeting.id;
          if (seenSeriesIds.has(seriesId)) return false;
          seenSeriesIds.add(seriesId);
        }

        const matchesSearch =
          !search ||
          meeting.title.toLowerCase().includes(search) ||
          meeting.description.toLowerCase().includes(search) ||
          meeting.participants.some((participant: { name: string }) => participant.name.toLowerCase().includes(search));

        return (
          matchesSearch &&
          (filters.status === "All" || meeting.status === filters.status) &&
          (filters.department === "All" || meeting.department === filters.department) &&
          (filters.organizerId === "All" || meeting.organizerId === filters.organizerId)
        );
      })
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  }, [filters, meetings]);

  const handleDelete = async (meetingId: string) => {
    try {
      await deleteMeeting(meetingId);
    } catch {
      // Consider surfacing a toast/Alert here if deletion fails
    }
  };

  return (
    <ListViewContainer>
      {isError ? (
        < MeetingsAlertContainer>
          <Alert type="warning" title="Couldn't load meetings from the server. Please try again shortly." showIcon closable />
        </ MeetingsAlertContainer>
      ) : null}

      <MetricsBar meetings={filteredMeetings} />

      <section className="scheduler-panel">
        <FiltersToolbar />

        <TableContainer>
          <TableHead>
            <span>Meeting</span>
            <span>When</span>
            <span>Department</span>
            <span>Organizer</span>
            <span>Status</span>
            <span>Priority</span>
            <span>Recurrence</span>
            <ActionsHead>Actions</ActionsHead>
          </TableHead>
          {filteredMeetings.length ? (
            filteredMeetings.map((meeting) => (
              <TableRow key={meeting.id}>
                <TableTitle>{meeting.title}</TableTitle>
                <span>{format(new Date(meeting.startTime), "MMM d, h:mm a")}</span>
                <span>{meeting.department}</span>
                <span>{meeting.organizer?.name ?? meeting.organizer?.email ?? "—"}</span>
                <span>
                  <Tag color={statusColor[meeting.status]}>{meeting.status}</Tag>
                </span>
                <span>
                  <Tag color={priorityColor[meeting.priority]}>{meeting.priority}</Tag>
                </span>
                <span style={{ fontSize: 13, color: (meeting as any).recurrenceRule ? "#0891b2" : "#94a3b8" }}>
                  {(meeting as any).recurrenceRule
                    ? (meeting as any).recurrenceRule.replace("FREQ=", "").charAt(0) + (meeting as any).recurrenceRule.replace("FREQ=", "").slice(1).toLowerCase()
                    : "None"}
                </span>
                <ActionsCell>
                  <Button
                    variant="icon-button-1"
                    size="small"
                    icon={<EyeOutlined />}
                    onClick={() => router.push(`/scheduler/meetings/${meeting.id}`)}
                  />
                  <Button
                    style={{ color: "purple" }}
                    variant="icon-button-1"
                    size="small"
                    icon={<EditOutlined />}
                    onClick={() => router.push(`/scheduler/meetings/${meeting.id}/edit`)}
                  />
                  <Button
                    style={{ color: "red" }}
                    variant="icon-button-1"
                    size="small"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleDelete(meeting.id)}
                  />
                </ActionsCell>
              </TableRow>
            ))
          ) : (
            <EmptyState>No meetings match your filters.</EmptyState>
          )}
        </TableContainer>
      </section>
    </ListViewContainer>
  );
}