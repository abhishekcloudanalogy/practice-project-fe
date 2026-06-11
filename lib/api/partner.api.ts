import { getSession } from "next-auth/react";
import { isAxiosError } from "axios";
import api from "@/lib/axios/axios";

type PartnerData = {
  externalId?: string | null;
  partnerName: string;
  parentPartner?: string | null;
  pmId?: string | null;
  url?: string | null;
  email?: string | null;
}

export const addpartner = async (partnerData: PartnerData) => {
  const session = await getSession();

  try {
    const res = await api.post("/api/partners/addpartner", partnerData, {
      headers: session?.accessToken
        ? { Authorization: `Bearer ${session.accessToken}` }
        : {},
    });

    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.log("Status:", error.response?.status);
      console.log("Response:", error.response?.data);
      console.log("Request Data:", partnerData);
    }
    console.log("FULL ERROR:", error);
    // return error;

    throw error;
  }
};

export const getPartners = async () => {
  const session = await getSession();

  try {
    const res = await api.get("/api/partners/names", {
      headers: session?.accessToken
        ? { Authorization: `Bearer ${session.accessToken}` }
        : {},
    });

    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.log("Status:", error.response?.status);
      console.log("Response:", error.response?.data);
    }
    console.log("FULL ERROR:", error);
    throw error;
  }
};