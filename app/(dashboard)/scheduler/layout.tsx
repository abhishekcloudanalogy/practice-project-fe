import { Suspense } from "react";
import type { ReactNode } from "react";
import type { Metadata } from "next";

import { StyledSchedulerPage } from "@/components/scheduler/SchedulerPage.styles";
import SchedulerNav from "@/components/scheduler/SchedulerNav";

export const metadata: Metadata = {
  title: 'Scheduler',
  description: 'Plan, filter, and manage meetings in one calendar.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Scheduler | CloudAnalogy',
    description: 'End-to-end meeting management and scheduling.',
    type: 'website',
  },
}


export default function SchedulerLayout({ children }: { children: ReactNode }) {
  return (
    <StyledSchedulerPage>
      <div className="scheduler-shell">
        <section className="scheduler-hero">
          <div>

            <h1 className="scheduler-title">Plan, filter, and manage meetings in one calendar.</h1>
            <p className="scheduler-copy">
              Create meetings, assign participants, inspect details, and switch between calendar and list views.
            </p>
          </div>
        </section>

        <Suspense fallback={null}>
          <SchedulerNav />
        </Suspense>

        {children}
      </div>
    </StyledSchedulerPage>
  );
}
