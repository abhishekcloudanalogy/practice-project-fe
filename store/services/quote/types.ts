import type { ApiResponse } from '../types'

export type QuoteListItem = {
	id: string
	quoteIndex: number
	name: string
	pdfUrl: string | null
	status: string | null
	fileCount: number
	lineItemCount: number
	createdAt?: string | null
}

export type QuoteMutationQuote = {
	id: string
	userId: string
	quote_number: number
	name: string
	pdf_url: string | null
	status: string | null
	created_at?: string | null
	updated_at?: string | null
	quoteIndex: number
	pdfUrl: string | null
}

export type QuoteLineItem = {
	id: string
	lineNumber: string | null
	description: string | null
	columnName: string
	pdfTableId: string
	sourceTableTitle: string | null
	rowIndex: number | null
}

export type LineItem = {
	id: string
	lineNumber: string | null
	itemCode: string | null
	employeeId: string | null
	employeeName: string | null
	description: string | null
	department: string | null
	category: string | null
	email: string | null
	phone: string | null
	salary: string | null
	quantity: string | null
	unitPrice: string | null
	amount: string | null
	currency: string | null
	status: string | null
	referenceNo: string | null
	location: string | null
	notes: string | null
	extraFields?: Record<string, unknown> | null
	pdfTableId: string
	sourceTableTitle: string | null
	rowIndex: number | null
	createdAt: string
	updatedAt: string
}

export type UpdateLineItemPayload = {
	quoteId: string
	quoteFileId: string
	lineItemId: string
	data: Partial<Pick<LineItem,
		| 'lineNumber' | 'itemCode' | 'employeeId' | 'employeeName' | 'description'
		| 'department' | 'category' | 'email' | 'phone' | 'salary' | 'quantity'
		| 'unitPrice' | 'amount' | 'currency' | 'status' | 'referenceNo' | 'location' | 'notes'
	>> & { extraFieldKey?: string; extraFieldValue?: unknown }
}

export type CreateLineItemPayload = {
	quoteId: string
	quoteFileId: string
	data: Partial<Pick<LineItem,
		| 'lineNumber' | 'itemCode' | 'employeeId' | 'employeeName' | 'description'
		| 'department' | 'category' | 'email' | 'phone' | 'salary' | 'quantity'
		| 'unitPrice' | 'amount' | 'currency' | 'status' | 'referenceNo' | 'location' | 'notes'
	>> & { rowIndex?: number }
}

export type DeleteLineItemPayload = {
	quoteId: string
	quoteFileId: string
	lineItemId: string
}

export type GetLineItemsPayload = {
	quoteId: string
	quoteFileId: string
}

export type QuoteExtractedTableRow = {
	id: string
	rowIndex: number | null
	rowData: Record<string, unknown>
}

export type QuoteExtractedTable = {
	id: string
	title: string | null
	columns: unknown[]
	rows: QuoteExtractedTableRow[]
}

export type QuoteFile = {
	id: string
	quote_id: string
	pdf_upload_id: string
	file_name: string
	is_Verifed?: boolean
	created_at: string
	updated_at: string
	lineItemCount?: number 
	tables?: QuoteExtractedTable[]
}

export type QuoteDetail = {
	quote: {
		id: string
		userId: string
		quoteIndex: number
		name: string
		pdfUrl: string | null
		status: string | null
		createdAt?: string | null
		updatedAt?: string | null
	}
	files: QuoteFile[]
	counts: {
		fileCount: number
		lineItemCount: number
		reviewLineItemCount: number
		profitabilityLineItemCount: number
	}
}

export type CreateQuotePayload = {
	name: string
	files: File[]
}

export type AddQuoteFilesPayload = {
	quoteId: string
	files: File[]
}

export type VerifyQuoteFilePayload = {
	quoteId: string
	quoteFileId: string
}

export type BulkDeleteLineItemsPayload = {
	quoteId: string
	quoteFileId: string
	lineItemIds: string[]
}

export type BulkUpdateLineItemsPayload = {
	quoteId: string
	quoteFileId: string
	lineItemIds: string[]
	data: Partial<Pick<LineItem,
		| 'lineNumber' | 'itemCode' | 'employeeId' | 'employeeName' | 'description'
		| 'department' | 'category' | 'email' | 'phone' | 'salary' | 'quantity'
		| 'unitPrice' | 'amount' | 'currency' | 'status' | 'referenceNo' | 'location' | 'notes'
	>>
}

export type BulkDeleteLineItemsResponse = {
	success: boolean
	data: { count: number; ids: string[] }
}

export type BulkUpdateLineItemsResponse = {
	success: boolean
	data: { count: number; lineItems: LineItem[] }
}

// ── Profitability line items ─────────────────────────────────────────────────

export type ProfitabilityLineItem = LineItem

export type GetProfitabilityLineItemsPayload = {
	quoteId: string
	quoteFileId: string
}

export type ProfitabilityLineItemsResponse = {
	success: boolean
	data: { lineItems: ProfitabilityLineItem[] }
}

export type BulkUpdateProfitabilityPayload = {
	quoteId: string
	quoteFileId: string
	lineItemIds: string[]
	data: Partial<Pick<LineItem,
		| 'lineNumber' | 'itemCode' | 'employeeId' | 'employeeName' | 'description'
		| 'department' | 'category' | 'email' | 'phone' | 'salary' | 'quantity'
		| 'unitPrice' | 'amount' | 'currency' | 'status' | 'referenceNo' | 'location' | 'notes'
	>>
}

export type BulkDeleteProfitabilityPayload = {
	quoteId: string
	quoteFileId: string
	lineItemIds: string[]
}

export type DeleteProfitabilityLineItemPayload = {
	quoteId: string
	quoteFileId: string
	itemId: string
}

export type BulkProfitabilityUpdateResponse = {
	success: boolean
	data: { count: number; lineItems: ProfitabilityLineItem[] }
}

export type BulkProfitabilityDeleteResponse = {
	success: boolean
	data: { count: number; ids: string[] }
}

export type DeleteProfitabilityLineItemResponse = {
	success: boolean
	data: { id: string }
}

export type QuoteMutationData = {
	quote: QuoteMutationQuote
	files: QuoteFile[]
	lineItemCount: number
	extractedRowCount?: number
}

export type QuoteListResponse = ApiResponse<{ quotes: QuoteListItem[] }>
export type QuoteDetailResponse = ApiResponse<QuoteDetail>
export type QuoteMutationResponse = ApiResponse<QuoteMutationData>
export type VerifyQuoteFileResponse = ApiResponse<{ file: QuoteFile }>
export type LineItemsResponse = ApiResponse<{ lineItems: LineItem[] }>
export type CreateLineItemResponse = ApiResponse<{ lineItem: LineItem }>
export type UpdateLineItemResponse = ApiResponse<{ lineItem: LineItem }>
export type DeleteLineItemResponse = ApiResponse<{ id: string }>
