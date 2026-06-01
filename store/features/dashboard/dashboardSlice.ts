import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import {
	downloadsData,
	projectsChartData,
	projectsData,
	salesChartData,
	salesStats,
	summaryCards,
	ticketsData,
	updatesData,
	usersChartData,
	usersData,
} from '@/constants/dashboard'
import type {
	DashboardSummaryCard,
	DownloadData,
	ProjectsData,
	SalesChartDatum,
	SalesStat,
	SmallChartDatum,
	TicketData,
	UpdateData,
	UsersData,
} from '@/constants/dashboard'

export type DashboardState = {
	summaryCards: DashboardSummaryCard[]
	salesStats: SalesStat[]
	salesChartData: SalesChartDatum[]
	usersData: UsersData
	usersChartData: SmallChartDatum[]
	projectsData: ProjectsData
	projectsChartData: SmallChartDatum[]
	downloadsData: DownloadData[]
	ticketsData: TicketData[]
	updatesData: UpdateData[]
}

const createInitialDashboardState = (): DashboardState => ({
	summaryCards,
	salesStats,
	salesChartData,
	usersData,
	usersChartData,
	projectsData,
	projectsChartData,
	downloadsData,
	ticketsData,
	updatesData,
})

const initialState = createInitialDashboardState()

const dashboardSlice = createSlice({
	name: 'dashboard',
	initialState,
	reducers: {
		setDashboardData: (_state, action: PayloadAction<DashboardState>) => {
			return action.payload
		},
		resetDashboardData: () => {
			return createInitialDashboardState()
		},
	},
})

export const { setDashboardData, resetDashboardData } = dashboardSlice.actions
export default dashboardSlice.reducer