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
	customerName?: string | null
	opportunityTitle?: string | null
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
	customerId?: string
	opportunityId?: string
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

export type ProfitabilityLineItem = LineItem & {
	rowSourceId: string | null
	is_Verifed: boolean
	customer_id: string | null
	organization: string | null
	product_id: number | null
	bundle_id: number | null
	adjusted_quantity: string | null
	availability: string | null
	line_amount: string | null
	list_price: string | null
	adjusted_price: string | null
	serial_: string | null
	pdf_url: string | null
	eventId: number | null
	quote_config_id: number | null
	subscriptionId: number | null
	portalId: number | null
	occurredAt: number | null
	subscriptionType: string | null
	attemptNumber: number | null
	objectId: number | null
	changeSource: string | null
	changeFlag: string | null
	appId: number | null
	bundle_cost: string | null
	bundle_ext_price: string | null
	bundle_gp: string | null
	bundle_gp_percentage: string | null
	bundle_msrp: string | null
	bundle_name: string | null
	bundle_rebate: string | null
	bundle_rebate_amount: string | null
	bundle_unit_price: string | null
	clin: string | null
	contract_fee_percentage: string | null
	contract_fee_amount: string | null
	country_of_origin: string | null
	display_mpn: string | null
	end_date: string | null
	energy_star_flag: string | null
	eol_date: string | null
	epeat_flag: string | null
	equivalent_clin: string | null
	excel_bundle_name: string | null
	file_name: string | null
	gsa_price: string | null
	model_id: string | null
	mpn: string | null
	ndr_cost: string | null
	unit_price: string | null
	oem: string | null
	oem_name: string | null
	partner_fee_percentage: string | null
	partner_fee_amount: string | null
	serial_number: string | null
	service_duration: string | null
	ss_part: string | null
	start_date: string | null
	subscription_term: string | null
	taa_flag: string | null
	td_number: string | null
	unspsc: string | null
	vendor_line_number: string | null
	vendor_quote_line_item: string | null
	vendor_disti: string | null
	vendor_disti_name: string | null
	months: string | null
	sub_total: string | null
	total_cost: string | null
	product_name: string | null
	use_line_amount: boolean
	term_months: string | null
	term_years: string | null
	term_unit_calc: string | null
	total_cost_to_use: string | null
	lead_time: string | null
	Discount_Class__c: string | null
	Discount_Subclass__c: string | null
	vendor_quote_number: string | null
	manufacturer_product_code: string | null
	vendor_product_code: string | null
	sku: string | null
	distributor_product_code: string | null
	discount_percentage: string | null
	extended_list: string | null
	esi_price: string | null
	pricing_method: string | null
	item_category_code: string | null
	ma_flag: string | null
	gross_profit_percentage: number | null
	gross_profit: number | null
	msrp: string | null
	optional: boolean
}

export type ProfitabilityEditableValue = string | number | boolean | Record<string, unknown> | null

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
	data: Partial<Record<keyof ProfitabilityLineItem, ProfitabilityEditableValue>>
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
