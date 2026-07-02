import { baseApi } from '../baseApi'
import type {
	AddQuoteFilesPayload,
	CreateLineItemPayload,
	CreateLineItemResponse,
	CreateQuotePayload,
	DeleteLineItemPayload,
	DeleteLineItemResponse,
	GetLineItemsPayload,
	LineItem,
	LineItemsResponse,
	QuoteDetail,
	QuoteDetailResponse,
	QuoteListItem,
	QuoteListResponse,
	QuoteMutationData,
	QuoteMutationResponse,
	UpdateLineItemPayload,
	UpdateLineItemResponse,
	VerifyQuoteFilePayload,
	VerifyQuoteFileResponse,
} from './types'

const buildQuoteFormData = (files: File[], name?: string) => {
	const formData = new FormData()

	if (typeof name === 'string') {
		formData.append('name', name)
	}

	files.forEach((file) => {
		formData.append('pdfs', file)
	})

	return formData
}

const quoteListTags = (result: QuoteListItem[] | undefined) =>
	result
		? [
			{ type: 'Quote' as const, id: 'LIST' },
			...result.map((quote) => ({ type: 'Quote' as const, id: quote.id })),
		]
		: [{ type: 'Quote' as const, id: 'LIST' }]

const quoteDetailTags = (quoteId: string, result?: QuoteDetail | null) => [
	{ type: 'Quote' as const, id: 'LIST' },
	{ type: 'Quote' as const, id: quoteId },
	...(result?.quote?.id ? [{ type: 'Quote' as const, id: result.quote.id }] : []),
]

const quoteMutationTags = (quoteId?: string, result?: QuoteMutationData | null) => [
	{ type: 'Quote' as const, id: 'LIST' },
	...(quoteId ? [{ type: 'Quote' as const, id: quoteId }] : []),
	...(result?.quote?.id ? [{ type: 'Quote' as const, id: result.quote.id }] : []),
]

export const quoteApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		getQuotes: builder.query<QuoteListItem[], void>({
			query: () => 'api/quotes',
			keepUnusedDataFor: 300,
			transformResponse: (response: QuoteListResponse) => response.data.quotes,
			providesTags: (result) => quoteListTags(result),
		}),
		getQuoteDetail: builder.query<QuoteDetail, string>({
			query: (quoteId) => `api/quotes/${quoteId}`,
			transformResponse: (response: QuoteDetailResponse) => response.data,
			providesTags: (_result, _error, quoteId) => [
				...quoteDetailTags(quoteId, _result),
				{ type: 'QuoteDetail' as const, id: quoteId },
			],
		}),
		createQuote: builder.mutation<QuoteMutationData, CreateQuotePayload>({
			query: ({ name, files }) => ({
				url: 'api/quotes',
				method: 'POST',
				body: buildQuoteFormData(files, name),
			}),
			transformResponse: (response: QuoteMutationResponse) => response.data,
			invalidatesTags: (result) => quoteMutationTags(result?.quote?.id, result),
		}),
		addQuoteFiles: builder.mutation<QuoteMutationData, AddQuoteFilesPayload>({
			query: ({ quoteId, files }) => ({
				url: `api/quotes/${quoteId}/files`,
				method: 'POST',
				body: buildQuoteFormData(files),
			}),
			transformResponse: (response: QuoteMutationResponse) => response.data,
			invalidatesTags: (result, _error, arg) => quoteMutationTags(arg.quoteId, result),
		}),
		verifyQuoteFile: builder.mutation<{ file: import('./types').QuoteFile }, VerifyQuoteFilePayload>({
			query: ({ quoteId, quoteFileId }) => ({
				url: `api/quotes/${quoteId}/files/${quoteFileId}/verify`,
				method: 'PATCH',
			}),
			transformResponse: (response: VerifyQuoteFileResponse) => response.data,
			invalidatesTags: (_result, _error, arg) => [
				{ type: 'Quote' as const, id: arg.quoteId },
				{ type: 'Quote' as const, id: 'LIST' },
			],
		}),
		getQuoteFileLineItems: builder.query<LineItem[], GetLineItemsPayload>({
			query: ({ quoteId, quoteFileId }) => `api/quotes/${quoteId}/files/${quoteFileId}/line-items`,
			transformResponse: (response: LineItemsResponse) => response.data.lineItems,
			providesTags: (_result, _error, arg) => [
				{ type: 'LineItem' as const, id: `${arg.quoteId}-${arg.quoteFileId}` },
				{ type: 'LineItem' as const, id: arg.quoteFileId },
				{ type: 'QuoteFileLineItems' as const, id: arg.quoteFileId },
			],
		}),
		createLineItem: builder.mutation<{ lineItem: LineItem }, CreateLineItemPayload>({
			query: ({ quoteId, quoteFileId, data }) => ({
				url: `api/quotes/${quoteId}/files/${quoteFileId}/line-items`,
				method: 'POST',
				body: data,
			}),
			transformResponse: (response: CreateLineItemResponse) => response.data,
			invalidatesTags: (_result, _error, arg) => [
				{ type: 'QuoteFileLineItems' as const, id: arg.quoteFileId },
				{ type: 'QuoteDetail' as const, id: arg.quoteId },
				{ type: 'LineItem' as const, id: `${arg.quoteId}-${arg.quoteFileId}` },
				{ type: 'LineItem' as const, id: arg.quoteFileId },
			],
		}),
		updateLineItem: builder.mutation<{ lineItem: LineItem }, UpdateLineItemPayload>({
			query: ({ quoteId, quoteFileId, lineItemId, data }) => ({
				url: `api/quotes/${quoteId}/files/${quoteFileId}/line-items/${lineItemId}`,
				method: 'PATCH',
				body: data,
			}),
			transformResponse: (response: UpdateLineItemResponse) => response.data,
			invalidatesTags: (_result, _error, arg) => [
				{ type: 'QuoteFileLineItems' as const, id: arg.quoteFileId },
				{ type: 'QuoteDetail' as const, id: arg.quoteId },
				{ type: 'LineItem' as const, id: `${arg.quoteId}-${arg.quoteFileId}` },
				{ type: 'LineItem' as const, id: arg.quoteFileId },
			],
		}),
		deleteLineItem: builder.mutation<{ id: string }, DeleteLineItemPayload>({
			query: ({ quoteId, quoteFileId, lineItemId }) => ({
				url: `api/quotes/${quoteId}/files/${quoteFileId}/line-items/${lineItemId}`,
				method: 'DELETE',
			}),
			transformResponse: (response: DeleteLineItemResponse) => response.data,
			invalidatesTags: (_result, _error, arg) => [
				{ type: 'QuoteFileLineItems' as const, id: arg.quoteFileId },
				{ type: 'QuoteDetail' as const, id: arg.quoteId },
				{ type: 'LineItem' as const, id: `${arg.quoteId}-${arg.quoteFileId}` },
				{ type: 'LineItem' as const, id: arg.quoteFileId },
			],
		}),
	}),
	overrideExisting: false,
})

export const {
	useGetQuotesQuery,
	useGetQuoteDetailQuery,
	useLazyGetQuoteDetailQuery,
	useCreateQuoteMutation,
	useAddQuoteFilesMutation,
	useVerifyQuoteFileMutation,
	useGetQuoteFileLineItemsQuery,
	useCreateLineItemMutation,
	useUpdateLineItemMutation,
	useDeleteLineItemMutation,
} = quoteApi
