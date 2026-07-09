"use client";

import { useState } from "react";
import { Alert, DatePicker } from "antd";
import dayjs, { type Dayjs } from "dayjs";
import { isAfter } from "date-fns";
import Input from "@/components/common/Input";
import Select from "@/components/common/Select";
import Button from "@/components/common/Button";
import { useGetUserDirectoryQuery } from "@/store/services/user/apiSlice";
import {
  departmentOptions,
  priorityOptions,
  statusOptions,
  repeatOptions,
  frequencyToRule,
  ruleToFrequency,
} from "@/components/scheduler/constants";
import type { MeetingFormValues, RecurrenceFrequency } from "@/store/services/scheduler/types";
import {
  FormWrapper,
  FormContainer,
  FormField,
  FormFieldWide,
  FormLabel,
  FormSection,
  FormActions,
  FormError,
  FormHeader,
} from "@/components/scheduler/MeetingForm.styles";

interface MeetingFormProps {
  initialValues: MeetingFormValues;
  submitLabel: string;
  submitting?: boolean;
  isEditMode?: boolean;
  onCancel: () => void;
  onSubmit: (values: MeetingFormValues) => void;
}

export default function MeetingForm({ initialValues, submitLabel, submitting, isEditMode = false, onCancel, onSubmit }: MeetingFormProps) {
  const [formValues, setFormValues] = useState<MeetingFormValues>(initialValues);
  const [formError, setFormError] = useState("");

  const { data: directory = [], isLoading: isDirectoryLoading } = useGetUserDirectoryQuery();

  const userOptions = directory.map((user) => ({
    value: user.id,
    label: user.name ? `${user.name} (${user.email})` : user.email,
  }));

  const setDateField = (field: "startTime" | "endTime", value: Dayjs | null) => {
    if (!value) return;
    setFormValues((current) => ({ ...current, [field]: value.toDate() }));
  };

  const handleSubmit = () => {
    if (!formValues.title.trim()) {
      setFormError("Meeting title is required.");
      return;
    }
    if (!isAfter(formValues.endTime, formValues.startTime)) {
      setFormError("End time must be after start time.");
      return;
    }
    if (isEditMode && !formValues.organizerId) {
      setFormError("Please select an organizer.");
      return;
    }
    if (!formValues.participants.length) {
      setFormError("Add at least one participant.");
      return;
    }
    if (formValues.recurrenceRule && formValues.recurrenceEndDate && formValues.recurrenceEndDate <= formValues.startTime) {
      setFormError("Repeat-until date must be after the meeting start time.");
      return;
    }
    setFormError("");
    onSubmit(formValues);
  };

  return (
    <FormWrapper>
      <FormHeader>
        <h1>{submitLabel.includes("Edit") ? "Edit Meeting" : "Create Meeting"}</h1>
        <p>Fill in the details below to {submitLabel.includes("Edit") ? "update" : "create"} a meeting</p>
      </FormHeader>

      <FormContainer>
        {formError ? (
          <FormError>
            <Alert type="error" title={formError} showIcon closable onClose={() => setFormError("")} />
          </FormError>
        ) : null}

        <FormSection>
          <h3>Meeting Details</h3>
        </FormSection>

        <FormFieldWide>
          <FormLabel>Title *</FormLabel>
          <Input
            placeholder="Enter meeting title"
            value={formValues.title}
            onChange={(event) => setFormValues((current) => ({ ...current, title: event.target.value }))}
          />
        </FormFieldWide>

        <FormFieldWide>
          <FormLabel>Description</FormLabel>
          <Input.TextArea
            placeholder="Enter meeting description (optional)"
            rows={3}
            value={formValues.description}
            onChange={(event) => setFormValues((current) => ({ ...current, description: event.target.value }))}
          />
        </FormFieldWide>

        <FormSection>
          <h3>Schedule</h3>
        </FormSection>

        <FormField>
          <FormLabel>Start Date/Time *</FormLabel>
          <DatePicker
            showTime={{ format: "hh:mm A", use12Hours: true }}
            format="YYYY-MM-DD hh:mm A"
            value={dayjs(formValues.startTime)}
            onChange={(value) => setDateField("startTime", value)}
          />
        </FormField>

        <FormField>
          <FormLabel>End Date/Time *</FormLabel>
          <DatePicker
            showTime={{ format: "hh:mm A", use12Hours: true }}
            format="YYYY-MM-DD hh:mm A"
            value={dayjs(formValues.endTime)}
            onChange={(value) => setDateField("endTime", value)}
          />
        </FormField>

        <FormField>
          <FormLabel>Repeat</FormLabel>
          <Select
            value={ruleToFrequency(formValues.recurrenceRule)}
            options={repeatOptions}
            onChange={(frequency: RecurrenceFrequency) =>
              setFormValues((current) => ({
                ...current,
                recurrenceRule: frequencyToRule(frequency),
                recurrenceEndDate: frequency === "NONE" ? null : current.recurrenceEndDate,
              }))
            }
          />
        </FormField>

        {formValues.recurrenceRule ? (
          <FormField>
            <FormLabel>Repeat Until</FormLabel>
            <DatePicker
              value={formValues.recurrenceEndDate ? dayjs(formValues.recurrenceEndDate) : null}
              onChange={(value) =>
                setFormValues((current) => ({
                  ...current,
                  recurrenceEndDate: value ? value.toDate() : null,
                }))
              }
              disabledDate={(current) => !!current && current.isBefore(dayjs(formValues.startTime), "day")}
              placeholder="Optional — leave blank to repeat indefinitely"
            />
          </FormField>
        ) : null}

        {isEditMode ? (
          <FormField>
            <FormLabel>Status</FormLabel>
            <Select
              value={formValues.status}
              placeholder="Select status"
              options={statusOptions.filter((status) => status !== "All").map((status) => ({ value: status, label: status }))}
              onChange={(status) => setFormValues((current) => ({ ...current, status }))}
            />
          </FormField>
        ) : null}

        <FormField>
          <FormLabel>Priority</FormLabel>
          <Select
            value={formValues.priority}
            placeholder="Select priority"
            options={priorityOptions.map((priority) => ({ value: priority, label: priority }))}
            onChange={(priority) => setFormValues((current) => ({ ...current, priority }))}
          />
        </FormField>

        <FormSection>
          <h3>Assignment &amp; Location</h3>
        </FormSection>

        <FormField>
          <FormLabel>Department</FormLabel>
          <Select
            value={formValues.department}
            placeholder="Select department"
            options={departmentOptions.map((department) => ({ value: department, label: department }))}
            onChange={(department) => setFormValues((current) => ({ ...current, department }))}
          />
        </FormField>

        {isEditMode ? (
          <FormField>
            <FormLabel>Organizer *</FormLabel>
            <Select
              value={formValues.organizerId || undefined}
              placeholder={isDirectoryLoading ? "Loading users..." : "Select organizer"}
              options={userOptions}
              loading={isDirectoryLoading}
              onChange={(organizerId) => setFormValues((current) => ({ ...current, organizerId }))}
            />
          </FormField>
        ) : null}

        <FormFieldWide>
          <FormLabel>Participants *</FormLabel>
          <Select
            mode="multiple"
            placeholder={isDirectoryLoading ? "Loading users..." : "Select participants (at least one required)"}
            value={formValues.participants}
            options={userOptions}
            loading={isDirectoryLoading}
            onChange={(participants) => setFormValues((current) => ({ ...current, participants }))}
          />
        </FormFieldWide>

        <FormField>
          <FormLabel>Location</FormLabel>
          <Input
            placeholder="e.g., Conference Room A"
            value={formValues.location}
            onChange={(event) => setFormValues((current) => ({ ...current, location: event.target.value }))}
          />
        </FormField>

        <FormField>
          <FormLabel>Meeting URL</FormLabel>
          <Input
            placeholder="e.g., https://meet.google.com/..."
            value={formValues.meetingUrl}
            onChange={(event) => setFormValues((current) => ({ ...current, meetingUrl: event.target.value }))}
          />
        </FormField>

        <FormActions>
          <Button variant="dashed" size="large" onClick={onCancel}>Cancel</Button>
          <Button variant="dashed" size="large" type="primary" loading={submitting} onClick={handleSubmit}>
            Save
          </Button>
        </FormActions>
      </FormContainer>
    </FormWrapper>
  );
}