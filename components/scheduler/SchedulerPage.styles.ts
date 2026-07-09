"use client";

import styled from "styled-components";

export const StyledSchedulerPage = styled.section`
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 18px 16px 32px;

  .scheduler-shell {
    display: grid;
    gap: 16px;
  }

  .scheduler-hero {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: space-between;
    gap: 18px;
    padding: 22px;
    border: 1px solid #e2e8f0;
    border-radius: 24px;
    background:
      radial-gradient(circle at top right, rgba(14, 165, 233, 0.16), transparent 34%),
      linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
    box-shadow: 0 18px 50px -42px rgba(15, 23, 42, 0.42);
  }

  .scheduler-kicker {
    margin: 0 0 7px;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #0284c7;
  }

  .scheduler-title {
    margin: 0;
    font-size: clamp(25px, 4vw, 25px);
    font-weight: 680;
    line-height: 1.08;
    color: #0f172a;
  }

  .scheduler-copy {
    max-width: 680px;
    margin: 10px 0 0;
    font-size: 14px;
    line-height: 1.7;
    color: #475569;
  }

  .scheduler-hero-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .scheduler-metrics {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 12px;
  }

  .scheduler-metric {
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    background: #ffffff;
    padding: 15px;
    box-shadow: 0 14px 34px -32px rgba(15, 23, 42, 0.55);
  }

  .scheduler-metric__label {
    margin: 0;
    font-size: 12px;
    font-weight: 700;
    color: #64748b;
  }

  .scheduler-metric__value {
    margin: 8px 0 0;
    font-size: 26px;
    font-weight: 700;
    color: #0f172a;
  }

  .scheduler-grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 320px;
    gap: 16px;
    align-items: start;
  }

  .scheduler-panel {
    min-width: 0;
    border: 1px solid #e2e8f0;
    border-radius: 20px;
    background: #ffffff;
    box-shadow: 0 18px 50px -40px rgba(15, 23, 42, 0.35);
  }

  .scheduler-toolbar {
    display: grid;
    grid-template-columns: minmax(220px, 1fr) repeat(3, minmax(150px, 190px));
    gap: 10px;
    padding: 16px;
    border-bottom: 1px solid #e2e8f0;
  }

  .scheduler-calendar-wrap {
    min-height: 680px;
    padding: 16px;
  }

  .scheduler-side {
    display: grid;
    gap: 16px;
  }

  .scheduler-side-panel {
    border: 1px solid #e2e8f0;
    border-radius: 20px;
    background: #ffffff;
    padding: 16px;
    box-shadow: 0 18px 50px -40px rgba(15, 23, 42, 0.35);
  }

  .scheduler-side-title {
    margin: 0;
    font-size: 16px;
    font-weight: 700;
    color: #0f172a;
  }

  .scheduler-side-copy {
    margin: 5px 0 0;
    font-size: 13px;
    line-height: 1.6;
    color: #64748b;
  }

  .meeting-list {
    display: grid;
    gap: 10px;
    margin-top: 14px;
  }

  .meeting-card {
    cursor: pointer;
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    background: #f8fafc;
    padding: 12px;
    transition: border-color 160ms ease, transform 160ms ease, background 160ms ease;
  }

  .meeting-card:hover {
    transform: translateY(-1px);
    border-color: #38bdf8;
    background: #ffffff;
  }

  .meeting-card__top {
    display: flex;
    justify-content: space-between;
    gap: 10px;
  }

  .meeting-card__title {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
    color: #0f172a;
  }

  .meeting-card__meta {
    margin: 5px 0 0;
    font-size: 12px;
    color: #64748b;
  }



  .meeting-form-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
  }

  .meeting-form-field {
    display: grid;
    gap: 6px;
  }

  .meeting-form-field--wide {
    grid-column: 1 / -1;
  }

  .meeting-form-label {
    font-size: 12px;
    font-weight: 800;
    color: #334155;
  }

  .meeting-form-error {
    font-size: 12px;
    color: #dc2626;
  }

  .rbc-calendar {
    color: #0f172a;
  }

  .rbc-toolbar {
    align-items: center;
    gap: 10px;
    margin-bottom: 16px;
  }

  .rbc-toolbar button {
    border: 1px solid #dbeafe;
    border-radius: 9px;
    color: #1e293b;
  }

  .rbc-toolbar button.rbc-active,
  .rbc-toolbar button:active,
  .rbc-toolbar button:hover {
    border-color: #0284c7;
    background: #e0f2fe;
    color: #0369a1;
  }

  .rbc-event {
    border: 0;
    border-radius: 8px;
    padding: 4px 6px;
    background: #0284c7;
  }

  .rbc-today {
    background: #f0f9ff;
  }

  .rbc-off-range-bg {
    background: #f8fafc;
  }

  @media (max-width: 1180px) {
    .scheduler-grid {
      grid-template-columns: 1fr;
    }

    .scheduler-side {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 860px) {
    padding: 12px 10px 24px;

    .scheduler-metrics,
    .scheduler-side,
    .scheduler-toolbar,
    .meeting-form-grid {
      grid-template-columns: 1fr;
    }

    .scheduler-calendar-wrap {
      min-height: 620px;
      padding: 12px;
    }

    .rbc-toolbar {
      align-items: stretch;
      flex-direction: column;
    }

    .rbc-btn-group {
      display: flex;
      width: 100%;
    }

    .rbc-btn-group button {
      flex: 1;
    }
  }
`;
