export type DashboardSummaryCard = {
  id: string
  title: string
  amount: string
  subtitle: string
  icon: string
  color: string
}

export type SalesStat = {
  label: string
  value: string
}

export type SalesChartDatum = {
  day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat'
  revenue: number
  returns: number
}

export type UsersData = {
  totalUsers: string
  growth: string
  description: string
}

export type SmallChartDatum = {
  name: string
  value: number
}

export type ProjectsData = {
  percentage: string
  growth: string
  description: string
}

export type DownloadData = {
  id: string
  label: string
  value: string
  progress: number
  color: string
}

export type TicketData = {
  id: string
  initials: string
  name: string
  location: string
  date: string
  time: string
  project: string
  status: 'Open' | 'In Progress' | 'Resolved' | 'Waiting'
  avatarColor: string
}

export type UpdateData = {
  id: string
  title: string
  description: string
  time: string
}

export const summaryCards: DashboardSummaryCard[] = [
  {
    id: 'total-sales',
    title: 'Total Sales',
    amount: '$128,450',
    subtitle: '+12.4% from last month',
    icon: 'trending-up',
    color: '#2563eb',
  },
  {
    id: 'total-purchases',
    title: 'Total Purchases',
    amount: '$86,120',
    subtitle: '+8.1% from last month',
    icon: 'shopping-bag',
    color: '#0f766e',
  },
  {
    id: 'total-orders',
    title: 'Total Orders',
    amount: '1,248',
    subtitle: '94 pending approvals',
    icon: 'package',
    color: '#7c3aed',
  },
  {
    id: 'total-growth',
    title: 'Total Growth',
    amount: '18.6%',
    subtitle: 'Steady quarter-over-quarter growth',
    icon: 'chart-bar',
    color: '#ea580c',
  },
]

export const salesStats: SalesStat[] = [
  { label: 'Revenue', value: '$42,800' },
  { label: 'Returns', value: '$3,240' },
  { label: 'Queries', value: '1,120' },
  { label: 'Invoices', value: '864' },
]

export const salesChartData: SalesChartDatum[] = [
  { day: 'Mon', revenue: 120, returns: 20 },
  { day: 'Tue', revenue: 180, returns: 32 },
  { day: 'Wed', revenue: 145, returns: 24 },
  { day: 'Thu', revenue: 210, returns: 40 },
  { day: 'Fri', revenue: 260, returns: 36 },
  { day: 'Sat', revenue: 230, returns: 28 },
]

export const usersData: UsersData = {
  totalUsers: '24,582',
  growth: '+14.2%',
  description: 'Active users grew steadily across the last 30 days.',
}

export const usersChartData: SmallChartDatum[] = [
  { name: 'Active', value: 68 },
  { name: 'New', value: 22 },
  { name: 'Churn', value: 10 },
]

export const projectsData: ProjectsData = {
  percentage: '74%',
  growth: '+9.8%',
  description: 'Projects are progressing on schedule with strong milestone delivery.',
}

export const projectsChartData: SmallChartDatum[] = [
  { name: 'Completed', value: 54 },
  { name: 'In Progress', value: 31 },
  { name: 'Pending', value: 15 },
]

export const downloadsData: DownloadData[] = [
  {
    id: 'offline-downloads',
    label: 'Offline',
    value: '12.4k',
    progress: 72,
    color: '#2563eb',
  },
  {
    id: 'online-downloads',
    label: 'Online',
    value: '18.9k',
    progress: 88,
    color: '#0f766e',
  },
]

export const ticketsData: TicketData[] = [
  {
    id: 'tkt-001',
    initials: 'AR',
    name: 'Aarav Rao',
    location: 'Bengaluru, India',
    date: 'May 18, 2026',
    time: '09:45 AM',
    project: 'CRM Dashboard Refresh',
    status: 'Open',
    avatarColor: '#2563eb',
  },
  {
    id: 'tkt-002',
    initials: 'PK',
    name: 'Priya Kapoor',
    location: 'Mumbai, India',
    date: 'May 18, 2026',
    time: '10:20 AM',
    project: 'Billing Automation',
    status: 'In Progress',
    avatarColor: '#7c3aed',
  },
  {
    id: 'tkt-003',
    initials: 'SK',
    name: 'Siddharth Khanna',
    location: 'Pune, India',
    date: 'May 17, 2026',
    time: '02:15 PM',
    project: 'Mobile App Support',
    status: 'Resolved',
    avatarColor: '#0f766e',
  },
  {
    id: 'tkt-004',
    initials: 'NS',
    name: 'Neha Sharma',
    location: 'Delhi, India',
    date: 'May 17, 2026',
    time: '04:05 PM',
    project: 'API Integration',
    status: 'Waiting',
    avatarColor: '#ea580c',
  },
  {
    id: 'tkt-005',
    initials: 'VK',
    name: 'Vikram Kulkarni',
    location: 'Hyderabad, India',
    date: 'May 16, 2026',
    time: '11:30 AM',
    project: 'Analytics Reporting',
    status: 'Open',
    avatarColor: '#14b8a6',
  },
]

export const updatesData: UpdateData[] = [
  {
    id: 'upd-001',
    title: 'Quarterly review completed',
    description: 'Leadership approved the new sales forecast and regional growth targets.',
    time: '10 minutes ago',
  },
  {
    id: 'upd-002',
    title: 'Payment gateway synced',
    description: 'Transaction logs are now aligned with invoicing and refund workflows.',
    time: '1 hour ago',
  },
  {
    id: 'upd-003',
    title: 'User onboarding campaign launched',
    description: 'The new CRM onboarding sequence is live for all enterprise accounts.',
    time: '3 hours ago',
  },
]
