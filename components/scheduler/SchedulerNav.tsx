"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import Button from "@/components/common/Button";
import { CalendarOutlined, PlusOutlined, UnorderedListOutlined } from "@/components/common/antd/icons";
import {
  NavContainer,
  TabsContainer,
  NavLink,
  CreateButtonContainer,
} from "@/components/scheduler/SchedulerNav.styles";

export default function SchedulerNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.toString();
  const suffix = query ? `?${query}` : "";

  const isCalendar = pathname === "/scheduler";
  const isList = pathname === "/scheduler/meetings";

  return (
    <NavContainer>
      <TabsContainer>
        <NavLink href={`/scheduler${suffix}`} isActive={isCalendar}>
          <CalendarOutlined /> Calendar
        </NavLink>
        <NavLink href={`/scheduler/meetings${suffix}`} isActive={isList}>
          <UnorderedListOutlined /> Meetings List
        </NavLink>
      </TabsContainer>
      <CreateButtonContainer>
        <Link href="/scheduler/meetings/new">
          <Button type="primary" icon={<PlusOutlined />}>
            Create Meeting
          </Button>
        </Link>
      </CreateButtonContainer>
    </NavContainer>
  );
}
