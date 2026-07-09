import styled from "styled-components";

export const FormWrapper = styled.div`
  max-width: 960px;
  margin: 0 auto;
  padding: 24px 16px 48px;

  @media (max-width: 640px) {
    padding: 16px 12px 32px;
  }
`;

export const FormHeader = styled.div`
  margin-bottom: 20px;

  h1 {
    font-size: 22px;
    font-weight: 600;
    color: #111827;
    margin: 0 0 4px;
    padding:2px
  }

  p {
    font-size: 14px;
    color: #6b7280;
    margin: 0;
  }
`;

export const FormContainer = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  padding: 28px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 20px;
    gap: 16px;
  }
`;

export const FormError = styled.div`
  grid-column: 1 / -1;
`;

export const FormSection = styled.div`
  grid-column: 1 / -1;
  margin-top: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f1f5f9;

  &:first-of-type {
    margin-top: 0;
  }

  h3 {
    font-size: 13px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: #6366f1;
    margin: 0;
  }
`;

export const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;

  .ant-picker,
  .ant-select,
  .ant-select-selector {
    width: 100% !important;
  }
`;

export const FormFieldWide = styled(FormField)`
  grid-column: 1 / -1;
`;

export const FormLabel = styled.label`
  font-size: 13px;
  font-weight: 500;
  color: #374151;
`;

export const FormActions = styled.div`
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 12px;
  padding-top: 20px;
  border-top: 1px solid #f1f5f9;

  @media (max-width: 480px) {
    flex-direction: column-reverse;

    button {
      width: 100%;
    }
  }
`;