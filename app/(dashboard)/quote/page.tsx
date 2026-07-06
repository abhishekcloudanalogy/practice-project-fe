"use client";

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Message from '@/components/common/Message'
import Modal from '@/components/common/Modal'
import Table from '@/components/common/Table'
import type { ColumnsType } from '@/components/common/Table/types'
import Button from '@/components/common/Button'
import Select from '@/components/common/Select'
import AntUpload from '@/components/common/antd/Upload'
import { DeleteOutlined, InboxOutlined, PlusOutlined, SettingOutlined } from '@/components/common/antd/icons'
import {
    useCreateQuoteMutation,
    useGetQuotesQuery,
} from '@/store/services/quote/apiSlice'
import type { QuoteListItem } from '@/store/services/quote/types'
import { formatQuoteNumber } from '@/utils/formatters'
import { useGetCustomersQuery } from '@/store/services/customer/apiSlice'
import { useGetOpportunitiesQuery } from '@/store/services/opportunity/apiSlice'
import type { Customer, Opportunity } from '@/store/services/types'

const { Dragger } = AntUpload

const getNestedMessage = (value: unknown): string | null => {
    if (!value || typeof value !== 'object') {
        return null
    }

    const source = value as {
        message?: unknown
        error?: unknown
    }

    if (typeof source.message === 'string' && source.message.trim().length > 0) {
        return source.message
    }

    if (typeof source.error === 'string' && source.error.trim().length > 0) {
        return source.error
    }

    if (source.error && typeof source.error === 'object') {
        const nested = source.error as { message?: unknown }
        if (typeof nested.message === 'string' && nested.message.trim().length > 0) {
            return nested.message
        }
    }

    return null
}

const getShortRateLimitMessage = (rawMessage: string): string => {
    void rawMessage
    return 'Rate limit reached. Please wait a moment and try again.'
}

const isRateLimitError = (error: {
    status?: unknown
    originalStatus?: unknown
    error?: unknown
    message?: unknown
    data?: unknown
}) => {
    if (error.status === 429 || error.originalStatus === 429) {
        return true
    }

    const payloadMessage = getNestedMessage(error.data)
    const topLevelMessage = typeof error.message === 'string' ? error.message : ''
    const errorText = typeof error.error === 'string' ? error.error : ''
    const combined = `${payloadMessage ?? ''} ${topLevelMessage} ${errorText}`.toLowerCase()

    return combined.includes('rate limit') || combined.includes('tpm') || combined.includes('429')
}

const getErrorMessage = (error: unknown, fallback: string) => {
    if (typeof error === 'string') {
        return error
    }

    if (error && typeof error === 'object') {
        const maybeError = error as {
            status?: unknown
            originalStatus?: unknown
            error?: unknown
            message?: unknown
            data?: unknown
        }

        const payloadMessage = getNestedMessage(maybeError.data)

        if (isRateLimitError(maybeError)) {
            if (payloadMessage) {
                return getShortRateLimitMessage(payloadMessage)
            }

            if (typeof maybeError.message === 'string' && maybeError.message.trim().length > 0) {
                return getShortRateLimitMessage(maybeError.message)
            }

            return 'Groq API rate limit exceeded. Please wait a moment and try again.'
        }

        if (payloadMessage) {
            return payloadMessage
        }

        if (typeof maybeError.error === 'string') {
            return maybeError.error
        }

        if (typeof maybeError.message === 'string') {
            return maybeError.message
        }
    }

    return fallback
}

const QuotePage = () => {
    const router = useRouter()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedFiles, setSelectedFiles] = useState<File[]>([])
    const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null)
    const [selectedOpportunityId, setSelectedOpportunityId] = useState<string | null>(null)
    const [messageApi, contextHolder] = Message.useMessage()

    const {
        data: quotes = [],
        isLoading,
        isFetching,
    } = useGetQuotesQuery(undefined, {
        refetchOnMountOrArgChange: false,
        refetchOnFocus: true,
        refetchOnReconnect: true,
    })

    const { data: customers = [], isLoading: loadingCustomers } = useGetCustomersQuery(undefined, {
        skip: !isModalOpen,
    })

    const { data: opportunities = [], isLoading: loadingOpportunities } = useGetOpportunitiesQuery(
        selectedCustomerId ?? undefined,
        { skip: !selectedCustomerId || !isModalOpen },
    )

    const [createQuote, { isLoading: creatingQuote, error: createQuoteError, reset: resetCreateQuoteState }] = useCreateQuoteMutation()

    const loading = isLoading || isFetching
    const uploadErrorMessage = createQuoteError
        ? getErrorMessage(createQuoteError, 'Failed to create quote')
        : null

    const openModal = () => {
        resetCreateQuoteState()
        setSelectedFiles([])
        setSelectedCustomerId(null)
        setSelectedOpportunityId(null)
        setIsModalOpen(true)
    }

    const closeModal = () => {
        if (creatingQuote) return
        resetCreateQuoteState()
        setIsModalOpen(false)
        setSelectedFiles([])
        setSelectedCustomerId(null)
        setSelectedOpportunityId(null)
    }

    const addFiles = (incomingFiles: File[]) => {
        const nonPdfFile = incomingFiles.find((file) => file.type !== 'application/pdf')
        if (nonPdfFile) {
            messageApi.error('Only PDF files are allowed')
            return
        }

        setSelectedFiles((previous) => {
            const mergedFiles = [...previous]
            incomingFiles.forEach((incomingFile) => {
                const duplicate = mergedFiles.some(
                    (file) =>
                        file.name === incomingFile.name &&
                        file.size === incomingFile.size &&
                        file.lastModified === incomingFile.lastModified,
                )
                if (!duplicate) {
                    mergedFiles.push(incomingFile)
                }
            })
            return mergedFiles
        })
    }

    const removeSelectedFile = (indexToRemove: number) => {
        setSelectedFiles((previous) => previous.filter((_, index) => index !== indexToRemove))
    }

    const handleGenerateQuote = async () => {
        if (selectedFiles.length === 0) return
        resetCreateQuoteState()
        const baseName = selectedFiles[0].name.replace(/\.[^/.]+$/, '') || 'Quote'
        try {
            await createQuote({
                name: baseName,
                files: selectedFiles,
                customerId: selectedCustomerId ?? undefined,
                opportunityId: selectedOpportunityId ?? undefined,
            }).unwrap()
            messageApi.success('Quote created successfully')
            closeModal()
        } catch (error: unknown) {
            messageApi.error(getErrorMessage(error, 'Failed to create quote'))
        }
    }

    const customerOptions = [
        {
            label: (
                <span className="flex items-center gap-1.5 text-cyan-600 font-medium">
                    <PlusOutlined />
                    Add Customer Account
                </span>
            ),
            value: '__add_customer__',
        },
        ...customers.map((c: Customer) => ({
            label: c.name || 'Unnamed Customer',
            value: c.id,
        })),
    ]

    const handleCustomerChange = (value: string) => {
        if (value === '__add_customer__') {
            router.push('/customer')
            return
        }
        setSelectedCustomerId(value)
        setSelectedOpportunityId(null)
    }

    // ── Modal content ────────────────────────────────────────────────────────

    const modalContent = (
        <>
            <Dragger
                accept=".pdf"
                multiple
                showUploadList={false}
                beforeUpload={(file) => {
                    addFiles([file])
                    return false
                }}
                onDrop={(event) => {
                    const droppedFiles = Array.from(event.dataTransfer.files ?? [])
                    addFiles(droppedFiles)
                }}
                className="[&_.ant-upload-drag]:rounded-[10px]! [&_.ant-upload-drag]:border! [&_.ant-upload-drag]:border-slate-300! [&_.ant-upload-drag]:bg-slate-50! [&_.ant-upload-drag]:px-5! [&_.ant-upload-drag]:py-6! [&_.ant-upload-drag:hover]:border-cyan-600! [&_.ant-upload-drag:hover]:bg-cyan-50!"
            >
                <p className="ant-upload-drag-icon mb-2 text-slate-400">
                    <InboxOutlined className="text-[28px]" />
                </p>
                <p className="ant-upload-text text-[15px] font-medium text-slate-700">
                    Click to Upload or Drag and Drop
                </p>
                <p className="ant-upload-hint text-xs text-slate-500">PDF only</p>
            </Dragger>

            {selectedFiles.length > 0 && (
                <div className="mt-3 space-y-2">
                    {selectedFiles.map((file, index) => (
                        <div
                            key={`${file.name}-${file.size}-${file.lastModified}`}
                            className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2"
                        >
                            <span className="truncate pr-3 text-sm text-slate-700">{file.name}</span>
                            <Button
                                variant="bgclear"
                                htmlType="button"
                                onClick={() => removeSelectedFile(index)}
                                className="inline-flex h-7 w-7 items-center justify-center rounded px-0 text-rose-500 transition-colors hover:bg-rose-50! hover:text-rose-600!"
                                style={{ height: 28, width: 28 }}
                                aria-label={`Remove ${file.name}`}
                            >
                                <DeleteOutlined />
                            </Button>
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-4">
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Customer</label>
                <Select
                    placeholder="Select Customer"
                    loading={loadingCustomers}
                    value={selectedCustomerId ?? undefined}
                    onChange={(value) => handleCustomerChange(value as string)}
                    style={{ width: '100%' }}
                    options={customerOptions}
                    showSearch
                    filterOption={(input, option) => {
                        if (option?.value === '__add_customer__') return true
                        return String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }}
                />
            </div>

            {selectedCustomerId && (
                <div className="mt-4">
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Opportunity</label>
                    <Select
                        placeholder="Select Opportunity"
                        loading={loadingOpportunities}
                        value={selectedOpportunityId ?? undefined}
                        onChange={(value) => {
                            if (value === '__add_opportunity__') {
                                router.push(`/opportunity?customerId=${selectedCustomerId}`)
                                return
                            }
                            setSelectedOpportunityId(value as string)
                        }}
                        style={{ width: '100%' }}
                        options={[
                            {
                                label: (
                                    <span className="flex items-center gap-1.5 text-cyan-600 font-medium">
                                        <PlusOutlined />
                                        Create Opportunity
                                    </span>
                                ),
                                value: '__add_opportunity__',
                            },
                            ...opportunities.map((opp: Opportunity) => ({
                                label: opp.title || 'Untitled Opportunity',
                                value: opp.id,
                            })),
                        ]}
                        showSearch
                        filterOption={(input, option) => {
                            if (option?.value === '__add_opportunity__') return true
                            return String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }}
                        notFoundContent={loadingOpportunities ? 'Loading…' : 'No opportunities found'}
                    />
                    {!loadingOpportunities && opportunities.length === 0 && (
                        <p className="mt-1.5 text-xs text-slate-500">
                            No opportunities for this customer.{' '}
                            <button
                                type="button"
                                className="text-cyan-600 underline hover:text-cyan-800 bg-transparent border-0 cursor-pointer p-0"
                                onClick={() => router.push(`/opportunity?customerId=${selectedCustomerId}`)}
                            >
                                Create one
                            </button>
                        </p>
                    )}
                </div>
            )}

            {uploadErrorMessage && (
                <div className="mt-4 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                    {uploadErrorMessage}
                </div>
            )}

            <div className="mt-5 flex items-center justify-between gap-2">
                <Button
                    variant="bgclear"
                    htmlType="button"
                    className="inline-flex h-8 w-8 items-center justify-center rounded px-0 text-slate-500 hover:text-slate-700!"
                    style={{ height: 32, width: 32 }}
                    aria-label="Settings"
                >
                  
                </Button>
                <Button
                    variant="primary"
                    loading={creatingQuote}
                    disabled={selectedFiles.length === 0 || creatingQuote}
                    onClick={handleGenerateQuote}
                >
                    Process Quote
                </Button>
            </div>
        </>
    )

    // ── Table columns ───────────────────────────────────────────────────────

    const columns: ColumnsType<QuoteListItem> = useMemo(() => [
        {
            title: 'Quote No',
            dataIndex: 'quoteIndex',
            key: 'quoteIndex',
            width: 180,
            render: (_: number, record: QuoteListItem) => (
                <Button
                    variant="bgclear"
                    htmlType="button"
                    onClick={(event) => {
                        event.stopPropagation()
                        router.push(`/quote/${record.id}`)
                    }}
                    className="px-0 text-left font-semibold text-cyan-700 hover:text-cyan-900!"
                    style={{ height: 'auto' }}
                >
                    {formatQuoteNumber(record.quoteIndex)}
                </Button>
            ),
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (value: string) => <span className="text-slate-700">{value || '-'}</span>,
        },
        {
            title: 'Customer',
            dataIndex: 'customerName',
            key: 'customerName',
            render: (value: string | null) => <span className="text-slate-700">{value || '-'}</span>,
        },
        {
            title: 'Opportunity',
            dataIndex: 'opportunityTitle',
            key: 'opportunityTitle',
            render: (value: string | null) => <span className="text-slate-700">{value || '-'}</span>,
        },
        {
            title: 'Files',
            dataIndex: 'fileCount',
            key: 'fileCount',
            width: 120,
            render: (count: number) => <span className="font-semibold text-slate-900">{count}</span>,
        },
        {
            title: 'Line Items',
            dataIndex: 'lineItemCount',
            key: 'lineItemCount',
            width: 140,
            render: (count: number) => <span className="font-semibold text-slate-900">{count ?? 0}</span>,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 140,
            render: (status: string | null) => (
                <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-medium text-slate-600">
                    {status || 'N/A'}
                </span>
            ),
        },
        {
            title: 'Created',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 180,
            render: (date?: string | null) => (
                <span className="text-slate-500">
                    {date ? new Date(date).toLocaleDateString() : '-'}
                </span>
            ),
        },
    ], [router])

    return (
        <div className="px-2 m-7 pb-3 pt-0 sm:px-4 sm:pb-6">
            {contextHolder}

            <Modal
                open={isModalOpen}
                title="Upload Quotes"
                onCancel={closeModal}
                footer={null}
                width={560}
                destroyOnHidden
            >
                {modalContent}
            </Modal>

            <div className="mb-6 overflow-hidden rounded-3xl border border-slate-200 bg-[linear-gradient(140deg,#f8fafc_0%,#ecfeff_100%)] p-6 shadow-[0_20px_60px_rgba(14,116,144,0.08)]">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-600">Quote Workspace</p>
                        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Manage quotes and uploaded files</h1>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                            Upload one or more PDF files to create a new quote. The list below always shows the latest quotes saved in the database.
                        </p>
                    </div>

                    <div className="w-full max-w-sm rounded-2xl border border-cyan-100 bg-white p-4 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Create Quote</p>
                        <p className="mt-2 text-sm text-slate-600">Upload files, select a customer and opportunity to create your quote.</p>
                        <Button
                            variant="primary"
                            onClick={openModal}
                            className="mt-4 w-full"
                        >
                            Add Quote
                        </Button>
                    </div>
                </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                <div className="mb-4 flex items-center justify-between gap-3">
                    <h2 className="text-lg font-semibold text-slate-900">Quotes</h2>
                    <span className="text-sm text-slate-500">{quotes.length} total</span>
                </div>

                <div className="overflow-x-auto">
                    <Table
                        columns={columns}
                        dataSource={quotes}
                        rowKey="id"
                        loading={loading}
                        scroll={{ x: 1200 }}
                        onRow={(record) => ({
                            onClick: () => router.push(`/quote/${record.id}`),
                            className: 'cursor-pointer',
                        })}
                        pagination={{ pageSize: 10, showSizeChanger: false }}
                        locale={{ emptyText: 'No quotes found. Create your first quote using Add Quote.' }}
                    />
                </div>
            </div>
        </div>
    )
}

export default QuotePage
