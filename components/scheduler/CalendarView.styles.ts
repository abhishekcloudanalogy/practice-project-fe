"use client";

import React from "react";
import styled from "styled-components";

export const CalendarViewContainer = styled.div`
  width: 100%;
`;

export const CalendarHeader = styled.div`
  margin-bottom: 20px;
`;

export const LegendContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 20px;
  font-size: 13px;
  color: #475569;
`;

export const LegendItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
`;

export const LegendDot = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
  display: inline-block;
`;

export const CalendarWrapper = styled.div`
  padding: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: #ffffff;
  position: relative;

  .rbc-calendar {
    color: #0f172a;
  }

  .rbc-toolbar {
    align-items: center;
    gap: 10px;
    margin-bottom: 16px;
    flex-wrap: wrap;
    display: flex;
    position: relative;
    z-index: 10;
  }

  .rbc-toolbar-label {
    flex: 1;
    font-weight: 600;
    padding: 0 16px;
    text-align: center;
    font-size: 16px;
    color: #0f172a;
  }

  .rbc-toolbar button {
    appearance: none;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    color: #475569;
    padding: 8px 14px;
    background: #ffffff;
    cursor: pointer;
    font-size: 14px;
    font-family: inherit;
    font-weight: 500;
    transition: all 120ms ease;
    position: relative;
    z-index: 10;
    pointer-events: auto !important;
    user-select: none;
    white-space: nowrap;
    outline: none;
    line-height: 1.4;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    min-width: 40px;
    min-height: 36px;

    svg {
      font-size: 16px;
    }

    &:not(:disabled) {
      cursor: pointer;
    }

    &:hover:not(:disabled):not(.rbc-active) {
      border-color: #0284c7;
      color: #0369a1;
      background: #f0f9ff;
    }

    &.rbc-active {
      border-color: #0284c7;
      background: #e0f2fe;
      color: #0369a1;
      font-weight: 600;
      box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.1);
    }

    &:active:not(:disabled) {
      transform: translateY(1px);
      box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    &:focus {
      box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.2);
      outline: 2px solid #0284c7;
      outline-offset: 0;
    }
  }

  .rbc-btn-group {
    display: inline-flex;
    gap: 6px;
    position: relative;
    z-index: 10;
    background: transparent;
    border: none;
    padding: 0;
    align-items: center;

    button {
      flex: 0 1 auto;
      min-width: 40px;
      padding: 8px 14px;
      
      &:hover {
        border-color: #0284c7;
        color: #0369a1;
        background: #f0f9ff;
      }
    }
  }

  .rbc-event {
    border: 0;
    border-radius: 8px;
    padding: 4px 6px;
    background: #0284c7;
    color: #ffffff;
    cursor: pointer;
    z-index: 5;
  }

  .rbc-today {
    background: #f0f9ff;
  }

  .rbc-off-range-bg {
    background: #f8fafc;
  }

  .rbc-header {
    padding: 10px 3px;
    font-weight: 600;
    font-size: 14px;
    color: #0f172a;
    border-bottom: 2px solid #e2e8f0;
  }

  .rbc-time-view {
    border: 1px solid #e2e8f0;
    border-radius: 8px;
  }
      .rbc-allday-cell {
    display: none;
  }

  @media (max-width: 860px) {
    padding: 12px;
    min-height: 620px;

    .rbc-toolbar {
      align-items: stretch;
      flex-direction: column;
      gap: 8px;
    }

    .rbc-btn-group {
      display: flex;
      width: 100%;
      gap: 4px;

      button {
        flex: 1;
        min-width: auto;
      }
    }

    .rbc-toolbar-label {
      padding: 8px 0;
    }
  }
`;

export const AlertContainer = styled.div`
  margin-bottom: 16px;
`;

export const SidePanelSection = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  background: #ffffff;
  padding: 16px;
  box-shadow: 0 18px 50px -40px rgba(15, 23, 42, 0.35);
`;

export const SidePanelTitle = styled.p`
  margin: 0;
  font-size: 16px;
  font-weight: 800;
  color: #0f172a;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const SidePanelCopy = styled.p`
  margin: 5px 0 0;
  font-size: 13px;
  line-height: 1.6;
  color: #64748b;
`;

export const MeetingList = styled.div`
  display: grid;
  gap: 10px;
  margin-top: 14px;
`;

export const MeetingCardButton = styled.button`
  cursor: pointer;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  background: #f8fafc;
  padding: 12px;
  transition: border-color 160ms ease, transform 160ms ease, background 160ms ease;
  text-align: left;
  width: 100%;
  font-family: inherit;

  &:hover {
    transform: translateY(-1px);
    border-color: #38bdf8;
    background: #ffffff;
  }

  &:active {
    transform: translateY(0);
  }
`;

export const MeetingCardTop = styled.span`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: flex-start;
`;

export const MeetingCardContent = styled.span`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
`;

export const MeetingCardTitle = styled.span`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const MeetingCardMeta = styled.span`
  margin: 0;
  font-size: 12px;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const MeetingCardTags = styled.span`
  display: flex;
  gap: 6px;
  flex-shrink: 0;
  flex-wrap: wrap;
  justify-content: flex-end;
`;

export const EmptyMeetingState = styled.p`
  margin: 20px 0 0;
  font-size: 13px;
  color: #64748b;
  text-align: center;
`;

export const SidePanel = styled.aside`
  display: grid;
  gap: 16px;

  @media (max-width: 1180px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;
