import type { AddPartnerInput, AddProgramInput } from "@/lib/validations/partner.schema";

export type PartnerProgramRow = {
  Id: number;
  "Partner Program Name": string;
  Description: string;
  "Verification Step": boolean;
  Template: string;
  "Login Template": string;
  "Login Script": string;
};

export type ModalType = "partner" | "program" | "edit-partner" | null;

export type PartnerFormValues = AddPartnerInput;

export type ProgramFormValues = AddProgramInput;
