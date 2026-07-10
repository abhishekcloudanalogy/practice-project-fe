"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { MeetingFilters } from "@/store/services/scheduler/types";

const defaultFilters: MeetingFilters = {
  search: "",
  status: "All",
  department: "All",
  organizerId: "All",
};

export function useSchedulerFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters: MeetingFilters = {
    search: searchParams.get("search") ?? defaultFilters.search,
    status: (searchParams.get("status") as MeetingFilters["status"]) ?? defaultFilters.status,
    department: searchParams.get("department") ?? defaultFilters.department,
    organizerId: searchParams.get("organizerId") ?? defaultFilters.organizerId,
  };

  const setFilters = (next: Partial<MeetingFilters>) => {
    const merged = { ...filters, ...next };
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(merged).forEach(([key, value]) => {
      if (!value || value === "All") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  const resetFilters = () => router.push(pathname);

  return { filters, setFilters, resetFilters };
}