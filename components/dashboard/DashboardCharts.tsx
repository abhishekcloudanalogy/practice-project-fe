"use client";

import { useEffect, useRef, useState } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import type {
  DownloadData,
  SalesChartDatum,
  SalesStat,
  SmallChartDatum,
  UsersData,
  ProjectsData,
} from '@/constants/dashboard'

type DashboardChartsProps = {
  salesStats: SalesStat[]
  salesChartData: SalesChartDatum[]
  usersData: UsersData
  usersChartData: SmallChartDatum[]
  projectsData: ProjectsData
  projectsChartData: SmallChartDatum[]
  downloadsData: DownloadData[]
}

const chartTheme = {
  grid: '#e2e8f0',
  axis: '#94a3b8',
  revenue: '#60a5fa',
  returns: '#fb7185',
  users: '#10b981',
  projects: '#3b82f6',
}

type Size = {
  width: number
  height: number
}

function useElementSize<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)
  const [size, setSize] = useState<Size>({ width: 0, height: 0 })

  useEffect(() => {
    const element = ref.current

    if (!element) {
      return
    }

    const updateSize = () => {
      const rect = element.getBoundingClientRect()

      setSize({
        width: Math.max(0, Math.floor(rect.width)),
        height: Math.max(0, Math.floor(rect.height)),
      })
    }

    updateSize()

    const observer = new ResizeObserver(() => {
      updateSize()
    })

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [])

  return { ref, size }
}

function MetricCard({
  title,
  value,
  growth,
  description,
  chartData,
  accent,
}: {
  title: string
  value: string
  growth: string
  description: string
  chartData: SmallChartDatum[]
  accent: string
}) {
  const chartSeries = chartData.map((item) => ({
    name: item.name,
    value: item.value,
  }))
  const { ref: sparklineRef, size: sparklineSize } = useElementSize<HTMLDivElement>()

  const gradientId = `fill-${title.toLowerCase().replace(/\s+/g, '-')}`

  return (
    <article className="min-w-0 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500">{title}</p>
          <div className="mt-2 flex items-end gap-3">
            <h3 className="text-3xl font-semibold tracking-tight text-slate-950">{value}</h3>
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600">
              {growth}
            </span>
          </div>
          <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">{description}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-right text-xs text-slate-500">
          <div className="font-medium text-slate-700">Latest</div>
          <div className="mt-1 text-base font-semibold text-slate-950">{chartSeries.at(-1)?.value ?? 0}%</div>
        </div>
      </div>

      <div ref={sparklineRef} className="mt-5 h-24 w-full min-w-0">
        {sparklineSize.width > 0 && sparklineSize.height > 0 && (
          <AreaChart width={sparklineSize.width} height={sparklineSize.height} data={chartSeries}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={accent} stopOpacity={0.3} />
                <stop offset="95%" stopColor={accent} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <Tooltip
              cursor={false}
              contentStyle={{
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                background: '#fff',
                boxShadow: '0 12px 24px rgba(15, 23, 42, 0.08)',
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={accent}
              strokeWidth={3}
              fill={`url(#${gradientId})`}
              dot={false}
            />
          </AreaChart>
        )}
      </div>
    </article>
  )
}

function RingChart({
  label,
  value,
  color,
}: {
  label: string
  value: number
  color: string
}) {
  const data = [
    { name: 'filled', value },
    { name: 'rest', value: 100 - value },
  ]

  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-center">
      <div className="h-28 w-28">
        <PieChart width={112} height={112}>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={34}
            outerRadius={48}
            startAngle={90}
            endAngle={-270}
            stroke="none"
          >
            <Cell fill={color} />
            <Cell fill="#e2e8f0" />
          </Pie>
          <text x="50%" y="46%" textAnchor="middle" className="fill-slate-950 text-[18px] font-semibold">
            {`${value}%`}
          </text>
          <text x="50%" y="61%" textAnchor="middle" className="fill-slate-500 text-[10px] font-medium uppercase tracking-[0.22em]">
            {label}
          </text>
        </PieChart>
      </div>
    </div>
  )
}

function DownloadsCard({ downloadsData }: { downloadsData: DownloadData[] }) {
  return (
    <article className="min-w-0 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500">Downloads</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-950">Offline vs online activity</h3>
          <p className="mt-2 max-w-lg text-sm leading-6 text-slate-500">
            Recharts ring charts keep the same dashboard feel with a real chart library.
          </p>
        </div>

        <div className="rounded-2xl bg-slate-50 px-3 py-2 text-right text-xs text-slate-500">
          <div className="font-medium text-slate-700">Status</div>
          <div className="mt-1 text-sm font-semibold text-slate-950">Live</div>
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {downloadsData.map((download) => (
          <div key={download.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-500">{download.label}</p>
                <p className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">{download.value}</p>
              </div>

              <RingChart label={download.label} value={download.progress} color={download.color} />
            </div>
          </div>
        ))}
      </div>
    </article>
  )
}

function SalesChartCard({
  salesStats,
  salesChartData,
}: {
  salesStats: SalesStat[]
  salesChartData: SalesChartDatum[]
}) {
  const { ref: lineChartRef, size: lineChartSize } = useElementSize<HTMLDivElement>()

  return (
    <article className="min-w-0 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500">Total Sales</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Weekly revenue overview</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            This dashboard section is rendered from the extracted chart component.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {salesStats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">{stat.label}</p>
              <p className="mt-1 text-lg font-semibold text-slate-950">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 rounded-3xl bg-gradient-to-b from-slate-50 to-white p-4">
        <div ref={lineChartRef} className="h-[22rem] w-full min-w-0">
          {lineChartSize.width > 0 && lineChartSize.height > 0 && (
            <LineChart
              width={lineChartSize.width}
              height={lineChartSize.height}
              data={salesChartData}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="revenue-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={chartTheme.revenue} stopOpacity={0.28} />
                  <stop offset="100%" stopColor={chartTheme.revenue} stopOpacity={0.04} />
                </linearGradient>
                <linearGradient id="returns-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={chartTheme.returns} stopOpacity={0.24} />
                  <stop offset="100%" stopColor={chartTheme.returns} stopOpacity={0.04} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={chartTheme.grid} strokeDasharray="6 8" vertical={false} />
              <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: chartTheme.axis, fontSize: 12 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: chartTheme.axis, fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                  background: '#fff',
                  boxShadow: '0 12px 24px rgba(15, 23, 42, 0.08)',
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke={chartTheme.revenue}
                strokeWidth={3}
                fill="url(#revenue-fill)"
                dot={{ r: 4, strokeWidth: 2, fill: chartTheme.revenue, stroke: '#fff' }}
              />
              <Line
                type="monotone"
                dataKey="returns"
                stroke={chartTheme.returns}
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2, fill: chartTheme.returns, stroke: '#fff' }}
              />
            </LineChart>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-sky-400" />
            Revenue
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-rose-400" />
            Returns
          </div>
        </div>
      </div>
    </article>
  )
}

const DashboardCharts = ({
  salesStats,
  salesChartData,
  usersData,
  usersChartData,
  projectsData,
  projectsChartData,
  downloadsData,
}: DashboardChartsProps) => {
  return (
    <section className="grid gap-4 lg:grid-cols-[1.6fr_1fr] [&>*]:min-w-0">
      <SalesChartCard salesStats={salesStats} salesChartData={salesChartData} />

      <div className="space-y-4">
        <MetricCard
          title="Users"
          value={usersData.totalUsers}
          growth={usersData.growth}
          description={usersData.description}
          chartData={usersChartData}
          accent={chartTheme.users}
        />

        <MetricCard
          title="Projects"
          value={projectsData.percentage}
          growth={projectsData.growth}
          description={projectsData.description}
          chartData={projectsChartData}
          accent={chartTheme.projects}
        />

        <DownloadsCard downloadsData={downloadsData} />
      </div>
    </section>
  )
}

export default DashboardCharts
