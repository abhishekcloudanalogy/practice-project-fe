"use client";

import styled from "styled-components";

export const DetailWrapper = styled.div`
  overflow: hidden;
  border-radius: 20px;
`;

export const DetailHero = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 28px 28px 24px;
  border-bottom: 1px solid #e2e8f0;
  background: radial-gradient(circle at top right, rgba(14, 165, 233, 0.08), transparent 50%),
    linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
`;

export const DetailHeroInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const DetailHeroActions = styled.div`
  display: flex;
  gap: 8px;
  flex-shrink: 0;
`;

export const DetailType = styled.p`
  margin: 0 0 6px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #0284c7;
`;

export const DetailTitle = styled.h2`
  margin: 0 0 12px;
  font-size: clamp(20px, 3vw, 26px);
  font-weight: 700;
  color: #0f172a;
  line-height: 1.2;
`;

export const DetailTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const DetailBody = styled.div`
  display: grid;
  grid-template-columns: 1fr 340px;
  align-items: start;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

export const DetailCol = styled.div`
  display: grid;
  gap: 1px;
  background: #e2e8f0;

  &:first-child {
    border-right: 1px solid #e2e8f0;

    @media (max-width: 860px) {
      border-right: none;
      border-bottom: 1px solid #e2e8f0;
    }
  }
`;

export const DetailCard = styled.div`
  padding: 22px 24px;
  background: #ffffff;
  display: grid;
  gap: 16px;
`;

export const DetailCardHeading = styled.p`
  margin: 0;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #0284c7;
`;

export const DetailItem = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
`;

export const DetailItemIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: #f0f9ff;
  color: #0284c7;
  font-size: 14px;
  flex-shrink: 0;
  margin-top: 2px;
`;

export const DetailItemLabel = styled.p`
  margin: 0 0 2px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #94a3b8;
`;

export const DetailItemValue = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  color: #0f172a;
`;

export const DetailItemLink = styled.a`
  font-size: 14px;
  line-height: 1.5;
  color: #0284c7;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

export const DetailDescriptionValue = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 1.7;
  color: #94a3b8;

  &[data-filled="true"] {
    color: #0f172a;
  }
`;

export const ParticipantList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const ParticipantChip = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: #f8fafc;
`;

export const ParticipantAvatar = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0284c7, #0891b2);
  color: #ffffff;
  font-size: 11px;
  font-weight: 700;
  flex-shrink: 0;
`;

export const ParticipantName = styled.span`
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #0f172a;
`;

export const ParticipantEmail = styled.span`
  display: block;
  font-size: 11px;
  color: #64748b;
`;

export const OrganizerEmail = styled.p`
  margin: 2px 0 0;
  font-size: 12px;
  color: #64748b;
`;
