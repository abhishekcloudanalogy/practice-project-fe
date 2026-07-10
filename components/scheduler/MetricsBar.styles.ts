"use client";

import React from "react";
import styled from "styled-components";

export const MetricsSection = styled.section`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 15px;
  padding-bottom: 16px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const MetricCard = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  background: #ffffff;
  padding: 15px;
  box-shadow: 0 14px 34px -32px rgba(15, 23, 42, 0.55);
  transition: transform 160ms ease, box-shadow 160ms ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 18px 42px -28px rgba(15, 23, 42, 0.65);
  }

  display: flex;
  gap: 12px;
  align-items: flex-start;
`;

export const MetricIcon = styled.span`
  font-size: 24px;
  color: #0284c7;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const MetricContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const MetricLabel = styled.p`
  margin: 0;
  font-size: 12px;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const MetricValue = styled.p`
  margin: 0;
  font-size: 20px;
  font-weight: 500;
  color: #0f172a;
`;
