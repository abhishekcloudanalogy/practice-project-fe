import { isAfter, isSameDay } from "date-fns";
import { BellOutlined, CalendarOutlined, ClockCircleOutlined, FireOutlined } from "@/components/common/antd/icons";
import type { Meeting } from "@/store/services/scheduler/types";
import {
  MetricsSection,
  MetricCard,
  MetricIcon,
  MetricContent,
  MetricLabel,
  MetricValue,
} from "@/components/scheduler/MetricsBar.styles";

export default function MetricsBar({ meetings }: { meetings: Meeting[] }) {
  const today = meetings.filter((meeting) => isSameDay(new Date(meeting.startTime), new Date()));
  const upcoming = meetings.filter(
    (meeting) => isAfter(new Date(meeting.startTime), new Date()) || isSameDay(new Date(meeting.startTime), new Date()),
  );
  const highPriority = meetings.filter((meeting) => meeting.priority === "HIGH");

  return (
    <MetricsSection>
      <MetricCard>
        <MetricIcon>
          <CalendarOutlined />
        </MetricIcon>
        <MetricContent>
          <MetricLabel>Visible meetings</MetricLabel>
          <MetricValue>{meetings.length}</MetricValue>
        </MetricContent>
      </MetricCard>

      <MetricCard>
        <MetricIcon>
          <ClockCircleOutlined />
        </MetricIcon>
        <MetricContent>
          <MetricLabel>Today</MetricLabel>
          <MetricValue>{today.length}</MetricValue>
        </MetricContent>
      </MetricCard>

      <MetricCard>
        <MetricIcon>
          <BellOutlined />
        </MetricIcon>
        <MetricContent>
          <MetricLabel>Upcoming</MetricLabel>
          <MetricValue>{upcoming.length}</MetricValue>
        </MetricContent>
      </MetricCard>

      <MetricCard>
        <MetricIcon>
          <FireOutlined />
        </MetricIcon>
        <MetricContent>
          <MetricLabel>High priority</MetricLabel>
          <MetricValue>{highPriority.length}</MetricValue>
        </MetricContent>
      </MetricCard>
    </MetricsSection>
  );
}