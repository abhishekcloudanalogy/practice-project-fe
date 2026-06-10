import { PartnerRow } from "@/lib/api/auth.api";

import type { PartnerProgramRow } from "./types";

export const initialData: PartnerRow[] = [
  {
    Id: 1,
    "External id": 1001,
    "partner Name": "Microsoft",
    "parent Partner": "Global Partners",
    "PM Id": "PM001",
    URL: "https://microsoft.com",
    Email: "partner@microsoft.com",
  },
  {
    Id: 2,
    "External id": 1002,
    "partner Name": "Google",
    "parent Partner": "Global Partners",
    "PM Id": "PM002",
    URL: "https://google.com",
    Email: "partner@google.com",
  },
];

export const expandedDataSource: Record<number, PartnerProgramRow[]> = {
  1: [
    {
      Id: 11,
      "Partner Program Name": "Microsoft Program",
      Description: "Partner onboarding and verification",
      "Verification Step": true,
      Template: "View",
      "Login Template": "View Login Template",
      "Login Script": "View Login Script",
    },
  ],
  2: [
    {
      Id: 12,
      "Partner Program Name": "Google Program",
      Description: "Partner onboarding and verification",
      "Verification Step": true,
      Template: "View",
      "Login Template": "View Login Template",
      "Login Script": "View Login Script",
    },
  ],
};
