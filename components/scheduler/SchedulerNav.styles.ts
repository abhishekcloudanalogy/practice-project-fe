"use client";

import React from "react";
import styled from "styled-components";
import Link from "next/link";

export const NavContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 8px;
  transition: border-color 160ms ease;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const TabsContainer = styled.div`
  display: flex;
  gap: 4px;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const NavLink = styled(Link).withConfig({
  shouldForwardProp: (prop) => prop !== "isActive",
})<{ isActive?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  color: ${(props) => (props.isActive ? "#0369a1" : "#475569")};
  text-decoration: none;
  white-space: nowrap;
  background-color: ${(props) => (props.isActive ? "#e0f2fe" : "transparent")};
  transition: background-color 160ms ease, color 160ms ease;

  &:hover {
    background-color: ${(props) => (props.isActive ? "#e0f2fe" : "#f1f5f9")};
    color: ${(props) => (props.isActive ? "#0369a1" : "#334155")};
  }

  @media (max-width: 768px) {
    flex: 1;
    justify-content: center;
  }
`;

export const CreateButtonContainer = styled.div`
  display: flex;

  @media (max-width: 768px) {
    width: 100%;
  }
`;
