"use client";

import { useSession } from "next-auth/react";
import { useSchedulerSocket } from "@/components/scheduler/useSchedulerSocket";

export default function SchedulerSocketBridge() {
  const { data: session } = useSession();
  useSchedulerSocket(session?.accessToken);
  return null;
}