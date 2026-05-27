"use client";

import { useAppSelector } from '@/store/hooks'

const Page = () => {
  const summaryCards = useAppSelector((state) => state.dashboard.summaryCards)
  const salesChartData = useAppSelector((state) => state.dashboard.salesChartData)
  const ticketsData = useAppSelector((state) => state.dashboard.ticketsData)
  const updatesData = useAppSelector((state) => state.dashboard.updatesData)

  return (
    <section className="mx-auto flex w-full max-w-360 flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <section className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Dashboard
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
          Welcome to your dashboard. Use the sidebar to move between the main
          CRM sections.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <article key={card.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60">
            <p className="text-sm font-medium text-slate-500">{card.title}</p>
            <div className="mt-2 text-2xl font-semibold text-slate-900">{card.amount}</div>
            <p className="mt-1 text-xs text-slate-500">{card.subtitle}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60">
          <h2 className="text-lg font-semibold text-slate-900">Weekly Revenue</h2>
          <div className="mt-4 space-y-3">
            {salesChartData.map((item) => (
              <div key={item.day} className="flex items-center justify-between text-sm text-slate-600">
                <span>{item.day}</span>
                <span>Revenue {item.revenue} / Returns {item.returns}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60">
          <h2 className="text-lg font-semibold text-slate-900">Recent Updates</h2>
          <div className="mt-4 space-y-4">
            {updatesData.map((item) => (
              <div key={item.id} className="border-b border-slate-200 pb-3 last:border-b-0 last:pb-0">
                <p className="text-sm font-medium text-slate-900">{item.title}</p>
                <p className="mt-1 text-sm text-slate-600">{item.description}</p>
                <p className="mt-1 text-xs text-slate-500">{item.time}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60">
        <h2 className="text-lg font-semibold text-slate-900">Support Tickets</h2>
        <div className="mt-4 space-y-3">
          {ticketsData.map((ticket) => (
            <div key={ticket.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-slate-900">{ticket.name}</p>
                <p className="text-xs text-slate-500">{ticket.project} · {ticket.location}</p>
              </div>
              <div className="text-right text-xs text-slate-500">
                <p>{ticket.date}</p>
                <p>{ticket.time}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </section>
  )
}

export default Page