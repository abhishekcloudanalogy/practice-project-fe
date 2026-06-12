import { z } from "zod";

const emptyToNull = (val: unknown) =>
  val === "" || val === undefined ? null : val;

const nullableString = z.preprocess(
  emptyToNull,
  z.string().trim().nullable().optional(),
);

const nullableEmail = z.preprocess(
  emptyToNull,
  z
    .string()
    .trim()
    .email("Invalid email address")
    .nullable()
    .optional(),
);

export const addPartnerSchema = z.object({
  partnerName: z.string().trim().min(1, "Partner name is required"),
  externalId: nullableString,
  parentPartner: nullableString,
  pmId: nullableString,
  url: nullableString,
  email: nullableEmail,
});

export const addProgramSchema = z.object({
  partnerName: z.string().trim().min(1, "Partner name is required"),
  partnerProgramName: z.string().trim().optional(),
  description: z.string().trim().optional(),
});

export type AddPartnerInput = z.infer<typeof addPartnerSchema>;
export type AddProgramInput = z.infer<typeof addProgramSchema>;
