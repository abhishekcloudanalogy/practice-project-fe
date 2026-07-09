"use client";

import React from "react";
import styled from "styled-components";

export const FiltersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 40px;
  margin-bottom: 16px;
  padding:5px;
  margin:5px;

  @media (max-width: 860px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const FilterField = styled.div`
  flex: 1 1 240px;
  min-width: 220px;
  
 

  @media (max-width: 860px) {
    flex: 1 1 100%;
    min-width: auto;
   
  }
`;

export const FilterSelect = styled.div`
  min-width: 180px;

  @media (max-width: 860px) {
    min-width: auto;
  }
`;

export const FilterLabel = styled.label`
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.4px;
`;

export const ClearButton = styled.div`
  margin-bottom: 2px;
`;
