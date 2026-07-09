"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import Button from "@/components/common/Button";
import Tag from "@/components/common/Tag";
import { Alert } from "antd";
import {
  ClockCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  EnvironmentOutlined,
  LinkOutlined,
  RetweetOutlined,
  UserOutlined,
} from "@/components/common/antd/icons";
import { useSchedulerMeetings } from "@/components/scheduler/useSchedulerMeetings";
import { useGetMeetingQuery } from "@/store/services/scheduler/apiSlice";
import { getInitials, priorityColor, ruleToFrequency, statusColor } from "@/components/scheduler/constants";
import { useSession } from "next-auth/react";
import {
  DetailWrapper,
  DetailHero,
  DetailHeroInfo,
  DetailHeroActions,
  DetailType,
  DetailTitle,
  DetailTags,
  DetailBody,
  DetailCol,
  DetailCard,
  DetailCardHeading,
  DetailItem,
  DetailItemIcon,
  DetailItemLabel,
  DetailItemValue,
  DetailItemLink,
  DetailDescriptionValue,
  ParticipantList,
  ParticipantChip,
  ParticipantAvatar,
  ParticipantName,
  ParticipantEmail,
  OrganizerEmail,
} from "@/components/scheduler/MeetingDetail.styles";

export default function MeetingDetailPage() {
  const params = useParams<{ metingId: string }>();
  const router = useRouter();
  const { data: session } = useSession();
  const { deleteMeeting } = useSchedulerMeetings();
  const { data: meeting, isLoading } = useGetMeetingQuery(params.metingId);
  const isOrganizer = !!meeting && meeting.organizerId === session?.user?.id;
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  if (isLoading) {
    return <section className="scheduler-panel"><p className="scheduler-empty">Loading...</p></section>;
  }

  if (!meeting) {
    return (
      <section className="scheduler-panel">
        <p className="scheduler-empty">This meeting couldn&apos;t be found. It may have been deleted.</p>
        <Button onClick={() => router.push("/scheduler/meetings")}>Back to meetings</Button>
      </section>
    );
  }

  const handleDelete = async () => {
    setIsDeleting(true);
    setDeleteError("");
    try {
      await deleteMeeting(meeting.id);
      router.push("/scheduler/meetings");
    } catch {
      setDeleteError("Couldn't delete this meeting. Please try again.");
      setIsDeleting(false);
    }
  };

  const recurrenceText = meeting.recurrenceRule
    ? `${ruleToFrequency(meeting.recurrenceRule).charAt(0)}${ruleToFrequency(meeting.recurrenceRule).slice(1).toLowerCase()}${meeting.recurrenceEndDate ? ` · until ${format(new Date(meeting.recurrenceEndDate), "MMM d, yyyy")}` : " · no end date"}`
    : "Does not repeat";

  return (
    <DetailWrapper className="scheduler-panel">
      {deleteError ? (
        <Alert type="error" title={deleteError} showIcon closable onClose={() => setDeleteError("")} />
      ) : null}

      <DetailHero>
        <DetailHeroInfo>
          <DetailType>{meeting.meetingType}</DetailType>
          <DetailTitle>{meeting.title}</DetailTitle>
          <DetailTags>
            <Tag color={statusColor[meeting.status]}>{meeting.status}</Tag>
            <Tag color={priorityColor[meeting.priority]}>{meeting.priority} Priority</Tag>
          </DetailTags>
        </DetailHeroInfo>
        {isOrganizer && (
          <DetailHeroActions>
            <Button variant="icon-button-1" icon={<EditOutlined />} onClick={() => router.push(`/scheduler/meetings/${meeting.id}/edit`)} />
            <Button variant="icon-button-1" icon={<DeleteOutlined />} loading={isDeleting} onClick={handleDelete} />
          </DetailHeroActions>
        )}
      </DetailHero>

      <DetailBody>
        <DetailCol>
          <DetailCard>
            <DetailCardHeading>Schedule</DetailCardHeading>
            <DetailItem>
              <DetailItemIcon><ClockCircleOutlined /></DetailItemIcon>
              <div>
                <DetailItemLabel>When</DetailItemLabel>
                <DetailItemValue>
                  {format(new Date(meeting.startTime), "EEEE, MMMM d, yyyy")}<br />
                  {format(new Date(meeting.startTime), "h:mm a")} &ndash; {format(new Date(meeting.endTime), "h:mm a")}
                </DetailItemValue>
              </div>
            </DetailItem>
            <DetailItem>
              <DetailItemIcon><RetweetOutlined /></DetailItemIcon>
              <div>
                <DetailItemLabel>Recurrence</DetailItemLabel>
                <DetailItemValue>{recurrenceText}</DetailItemValue>
              </div>
            </DetailItem>
            <DetailItem>
              <DetailItemIcon><EnvironmentOutlined /></DetailItemIcon>
              <div>
                <DetailItemLabel>Location</DetailItemLabel>
                <DetailItemValue>{meeting.location || "—"}</DetailItemValue>
              </div>
            </DetailItem>
            {meeting.meetingUrl ? (
              <DetailItem>
                <DetailItemIcon><LinkOutlined /></DetailItemIcon>
                <div>
                  <DetailItemLabel>Meeting Link</DetailItemLabel>
                  <DetailItemLink href={meeting.meetingUrl} target="_blank" rel="noreferrer">
                    Join meeting
                  </DetailItemLink>
                </div>
              </DetailItem>
            ) : null}
          </DetailCard>

          <DetailCard>
            <DetailCardHeading>Description</DetailCardHeading>
            <DetailDescriptionValue data-filled={!!meeting.description ? "true" : "false"}>
              {meeting.description || "No description added."}
            </DetailDescriptionValue>
          </DetailCard>
        </DetailCol>

        <DetailCol>
          <DetailCard>
            <DetailCardHeading>Organizer</DetailCardHeading>
            <DetailItem>
              <DetailItemIcon><UserOutlined /></DetailItemIcon>
              <div>
                <DetailItemValue>{meeting.organizer?.name ?? meeting.organizer?.email ?? "—"}</DetailItemValue>
                {meeting.organizer?.email ? (
                  <OrganizerEmail>{meeting.organizer.email}</OrganizerEmail>
                ) : null}
              </div>
            </DetailItem>
          </DetailCard>

          <DetailCard>
            <DetailCardHeading>Participants ({meeting.participants.length})</DetailCardHeading>
            <ParticipantList>
              {meeting.participants.map((participant) => (
                <ParticipantChip key={participant.userId}>
                  <ParticipantAvatar>{getInitials(participant.name)}</ParticipantAvatar>
                  <div>
                    <ParticipantName>{participant.name}</ParticipantName>
                    <ParticipantEmail>{participant.email}</ParticipantEmail>
                  </div>
                </ParticipantChip>
              ))}
            </ParticipantList>
          </DetailCard>
        </DetailCol>
      </DetailBody>
    </DetailWrapper>
  );
}
