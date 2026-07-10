"use client";

import React from "react";
import styled from "styled-components";

export const ListViewContainer = styled.section`
  width: 100%;
`;

export const TableContainer = styled.div`
  min-width: 0;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  background: #ffffff;
  box-shadow: 0 18px 50px -40px rgba(15, 23, 42, 0.35);
  overflow: hidden;
`;

export const TableHead = styled.div`
  display: grid;
  grid-template-columns: 2fr 1.5fr 1.2fr 1.2fr 1fr 0.8fr 1fr 0.8fr;
  gap: 16px;
  padding: 16px 20px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  font-size: 12px;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(5, 1fr);
    gap: 10px;

    span:last-child {
      display: none;
    }
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const ActionsHead = styled.span`
  text-align: right;

  @media (max-width: 1024px) {
    grid-column: 5;
    text-align: center;
  }
`;

export const TableRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1.5fr 1.2fr 1.2fr 1fr 0.8fr 1fr 0.8fr;
  gap: 16px;
  padding: 16px 20px;
  border-bottom: 1px solid #e2e8f0;
  align-items: center;
  font-size: 14px;
  color: #0f172a;
  transition: background-color 160ms ease;

  &:hover {
    background-color: #f8fafc;
  }

  @media (max-width: 1024px) {
    grid-template-columns: repeat(5, 1fr);
    gap: 10px;

    span:nth-child(7),
    span:nth-child(8) {
      display: none;
    }
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 12px 16px;
  }
`;

export const TableTitle = styled.span`
  font-weight: 700;
  color: #0f172a;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 768px) {
    font-size: 16px;
    font-weight: 800;
  }
`;

export const ActionsCell = styled.span`
  display: flex;
  gap: 8px;
  justify-content: flex-end;

  @media (max-width: 1024px) {
    grid-column: 5;
    justify-content: center;
  }

  @media (max-width: 768px) {
    justify-content: flex-start;
  }
`;

export const EmptyState = styled.p`
  padding: 40px 20px;
  text-align: center;
  color: #64748b;
  font-size: 14px;
  margin: 0;
`;

export const MeetingsAlertContainer = styled.div`
  margin-bottom: 16px;
`;