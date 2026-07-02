"use client";

import React, { useMemo } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import Button from '@/components/common/Button'
import Message from '@/components/common/Message'
import Modal from '@/components/common/Modal'
import Collapse from '@/components/common/Collapse'
import Tabs from '@/components/common/Tabs'
import { QuoteFilesCollapseGlobalStyle } from '@/components/quote/QuoteDetails.styles'
import { useGetQuoteDetailQuery, useVerifyQuoteFileMutation } from '@/store/services/quote/apiSlice'
import type { QuoteFile } from '@/store/services/quote/types'
import { ArrowLeftOutlined, CheckOutlined, CloseOutlined } from '@/components/common/antd/icons'
import { formatQuoteNumber } from '@/utils/formatters'
import QuoteFileLineItemsTable from '@/components/quote/QuoteFileLineItemsTable'


const getDisplayFileName = (name: string | null | undefined): string =>
    (name ?? '').trim().replace(/\.pdf$/i, '')



const QuoteDetailsPage = () => {
    const router = useRouter()
    const params = useParams<{ id: string }>()
    const searchParams = useSearchParams()
    const quoteId = params?.id
    const [activeTab, setActiveTab] = React.useState<'review' | 'profitability'>(
        searchParams.get('tab') === 'profitability' ? 'profitability' : 'review'
    )
    const [pendingVerification, setPendingVerification] = React.useState<Pick<QuoteFile, 'id' | 'file_name'> | null>(null)
    const [tableActionFile, setTableActionFile] = React.useState<QuoteFile | null>(null)
    const [messageApi, contextHolder] = Message.useMessage()

    const { data, isLoading, isFetching, error } = useGetQuoteDetailQuery(
        quoteId ?? '',
        { skip: !quoteId },
    )
    const [verifyQuoteFile, { isLoading: isVerifying }] = useVerifyQuoteFileMutation()

    React.useEffect(() => {
        if (error) messageApi.error('Failed to load quote details')
    }, [error, messageApi])

    const closeVerificationModal = () => {
        if (isVerifying) {
            return
        }

        setPendingVerification(null)
    }

    const closeTableActionModal = () => {
        setTableActionFile(null)
    }

    const handleOpenHotTablesForFile = (file: Pick<QuoteFile, 'id' | 'pdf_upload_id'>) => {
        const uploadId = file.pdf_upload_id?.trim()

        if (!uploadId) {
            messageApi.error('Missing upload id for this file')
            return
        }

        const nextPath = quoteId
            ? `/hottables/tables/${uploadId}?from=quote&quoteId=${encodeURIComponent(quoteId)}&quoteFileId=${encodeURIComponent(file.id)}`
            : `/hottables/tables/${uploadId}`

        router.push(nextPath)
    }

    const handleOpenLineItemsEditorForFile = (file: Pick<QuoteFile, 'id' | 'pdf_upload_id'>) => {
        const uploadId = file.pdf_upload_id?.trim()

        if (!uploadId) {
            messageApi.error('Missing upload id for this file')
            return
        }

        const nextPath = quoteId
            ? `/hottables/tables/${uploadId}?mode=line-items&from=quote&quoteId=${encodeURIComponent(quoteId)}&quoteFileId=${encodeURIComponent(file.id)}`
            : `/hottables/tables/${uploadId}?mode=line-items&quoteFileId=${encodeURIComponent(file.id)}`

        router.push(nextPath)
    }

    const handleConfirmVerification = async () => {
        if (!quoteId || !pendingVerification) {
            return
        }

        try {
            await verifyQuoteFile({ quoteId, quoteFileId: pendingVerification.id }).unwrap()
            messageApi.success('Quote file verified successfully')
            setPendingVerification(null)
        } catch {
            messageApi.error('Failed to verify quote file')
        }
    }

    const files = useMemo(() => data?.files ?? [], [data?.files])
    const filesWithRenderableTables = useMemo(
        () => files.filter((file) => (file.tables ?? []).length > 0),
        [files],
    )
    const loading = isLoading || isFetching
    const reviewFiles = useMemo(
        () => filesWithRenderableTables.filter((file) => !Boolean(file.is_Verifed)),
        [filesWithRenderableTables],
    )
    const profitabilityFiles = useMemo(
        () => filesWithRenderableTables.filter((file) => Boolean(file.is_Verifed)),
        [filesWithRenderableTables],
    )
    const visibleFiles = activeTab === 'review' ? reviewFiles : profitabilityFiles

    const lineItemCount = data?.counts?.lineItemCount ?? 0

    const collapseItems = useMemo(() => visibleFiles.map((file: QuoteFile) => {
        const fileLineItemCount = file.lineItemCount ?? 0
        const fileTotalRows = (file.tables ?? []).reduce(
            (count, table) => count + (Array.isArray(table.rows) ? table.rows.length : 0),
            0,
        )
        return {
            key: file.id,
            label: (
                <div className="quote-file-header grid w-full grid-cols-1 items-start gap-1.5 px-3 py-3 text-white sm:grid-cols-[minmax(0,1fr)_minmax(170px,1fr)_170px_120px] sm:items-center sm:gap-3 sm:px-4 lg:grid-cols-[minmax(0,1fr)_220px_190px_130px]">
                    <span className="truncate text-sm font-semibold sm:text-[1.02rem]">
                        {getDisplayFileName(file.file_name) || file.file_name}
                    </span>
                    <span className="text-sm font-medium sm:justify-self-center sm:text-center">
                        Line Items: {fileLineItemCount}
                    </span>
                    <span className="text-sm font-semibold sm:justify-self-start">
                        Created At: {new Date(file.created_at).toLocaleDateString()}
                    </span>
                    <span className="inline-flex h-8 items-center gap-2 sm:justify-self-end">
                        <Button
                            htmlType="button"
                            aria-label="Approve quote file"
                            disabled={activeTab !== 'review' || Boolean(file.is_Verifed) || isVerifying}
                            variant="icon-button-1"
                            className={`inline-flex h-8 w-8 items-center justify-center rounded-full border border-green-300 bg-green-50 text-green-700 transition-colors hover:bg-green-100 disabled:cursor-not-allowed disabled:opacity-50 ${activeTab !== 'review' ? 'invisible pointer-events-none' : ''}`}
                            onClick={(e) => {
                                e.stopPropagation()

                                if (activeTab !== 'review') return
                                if (!quoteId || Boolean(file.is_Verifed)) return

                                setPendingVerification({ id: file.id, file_name: file.file_name })
                            }}
                        >
                            <CheckOutlined />
                        </Button>
                        <Button
                            htmlType="button"
                            aria-label="Open table editor"
                            disabled={activeTab !== 'review'}
                            variant="icon-button-2"
                            className={`inline-flex h-8 w-8 items-center justify-center rounded-full border border-red-300 bg-red-50 text-red-700 transition-colors hover:bg-red-100 ${activeTab !== 'review' ? 'invisible pointer-events-none' : ''}`}
                            onClick={(e) => {
                                e.stopPropagation()
                                if (activeTab !== 'review') return
                                setTableActionFile(file)
                            }}
                        >
                            <CloseOutlined />
                        </Button>
                    </span>
                </div>
            ),
            children: (
                <div className="space-y-5">
                    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3">
                            <span className="text-xs font-medium text-slate-500">
                                Line Items
                            </span>
                            <span className="text-xs text-slate-500">
                                {fileTotalRows} rows
                            </span>
                        </div>
                        <div className="p-3 sm:p-4">
                            <QuoteFileLineItemsTable quoteId={quoteId!} quoteFileId={file.id} useHotTable={false} />
                        </div>
                    </section>
                </div>
            ),
        }
    }), [activeTab, visibleFiles, isVerifying, quoteId])

    const collapseKey = `${activeTab}-${visibleFiles[0]?.id ?? 'empty'}`
    const handleBackToQuotes = () => {
        router.push('/quote')
    }

    return (

        <div className="px-2 pb-3 pt-3 sm:px-4 sm:pb-6 sm:pt-4 lg:px-6 lg:pb-8 lg:pt-5">
            {contextHolder}
            <QuoteFilesCollapseGlobalStyle />
            <Modal
                open={Boolean(pendingVerification)}
                title="Verify Quote File"
                onCancel={closeVerificationModal}
                destroyOnHidden
                footer={(
                    <div className="flex justify-end gap-3">
                        <Button
                            htmlType="button"
                            variant="secondary"
                            onClick={closeVerificationModal}
                            disabled={isVerifying}
                        >
                            Cancel
                        </Button>
                        <Button
                            htmlType="button"
                            variant="primary"
                            onClick={handleConfirmVerification}
                            disabled={isVerifying}
                        >
                            {isVerifying ? 'Verifying...' : 'Confirm'}
                        </Button>
                    </div>
                )}
            >
                <p className="text-sm leading-6 text-slate-600">
                    Are you sure you want to verify this quote file
                    {' '}
                    <span className="font-semibold text-slate-900">{getDisplayFileName(pendingVerification?.file_name) || 'this quote file'}</span>
                    ?
                </p>
            </Modal>

            <Modal
                open={Boolean(tableActionFile)}
                title="Table Actions"
                onCancel={closeTableActionModal}
                destroyOnHidden
                footer={(
                    <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                       
                        <Button
                            htmlType="button"
                            variant="dashed"
                            onClick={() => {
                                if (!tableActionFile) return
                                handleOpenLineItemsEditorForFile(tableActionFile)
                                closeTableActionModal()
                            }}
                        >
                            Edit Existing Data
                        </Button>
                         <Button
                            htmlType="button"
                            variant="dashed"
                            onClick={() => {
                                if (!tableActionFile) return
                                handleOpenHotTablesForFile(tableActionFile)
                                closeTableActionModal()
                            }}
                        >
                            Read Tables
                        </Button>
                        <Button
                            htmlType="button"
                            variant="dashed"
                            onClick={() => {
                                if (!tableActionFile) return

                                const uploadId = tableActionFile.pdf_upload_id?.trim()
                                if (!uploadId) {
                                    messageApi.error('Missing upload id for this file')
                                    return
                                }

                                const nextPath = quoteId
                                    ? `/hottables/tables/${uploadId}?mode=manual&from=quote&quoteId=${encodeURIComponent(quoteId)}&quoteFileId=${encodeURIComponent(tableActionFile.id)}`
                                    : `/hottables/tables/${uploadId}?mode=manual`

                                router.push(nextPath)
                                closeTableActionModal()
                            }}
                        >
                            Manual Update
                        </Button>
                    </div>
                )}
            >
                <p className="text-sm leading-6 text-slate-600">
                    Choose how you want to continue for
                    {' '}
                    <span className="font-semibold text-slate-900">{getDisplayFileName(tableActionFile?.file_name) || 'this file'}</span>
                    .
                </p>
            </Modal>

            <div className="mb-3 flex items-center">
                <Button
                    variant="secondary"
                    onClick={handleBackToQuotes}
                    style={{ height: 40, padding: '0 14px', borderRadius: 10, fontSize: 14, fontWeight: 600 }}
                >
                    <span className="inline-flex items-center gap-2">
                        <ArrowLeftOutlined />
                        Back to Quotes
                    </span>
                </Button>
            </div>

            <div className="mb-6 rounded-3xl border border-slate-200 bg-[linear-gradient(130deg,#ffffff_0%,#f0fdfa_100%)] p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-600">Quote Files</p>
                        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
                            {typeof data?.quote?.quoteIndex === 'number' ? formatQuoteNumber(data.quote.quoteIndex) : 'Quote'}
                        </h1>
                        <p className="mt-2 text-sm text-slate-600">
                            {data?.quote?.name || 'Quote detail view'}
                        </p>
                    </div>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Files</p>
                        <p className="mt-2 text-2xl font-semibold text-slate-900">{filesWithRenderableTables.length}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Line Items</p>
                        <p className="mt-2 text-2xl font-semibold text-slate-900">{lineItemCount}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Status</p>
                        <p className="mt-2 text-sm font-semibold text-slate-900">{data?.quote?.status ?? 'N/A'}</p>
                    </div>
                </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                <div className="mb-4 flex items-center justify-between gap-3">
                    <h2 className="text-lg font-semibold text-slate-900">Quote Files</h2>
                    <span className="text-sm text-slate-500">{filesWithRenderableTables.length} total</span>
                </div>

                <Tabs
                    activeKey={activeTab}
                    onChange={(key) => setActiveTab(key as 'review' | 'profitability')}
                    items={[
                        {
                            key: 'review',
                            label: (
                                <span className="flex items-center gap-1.5">
                                    Review Quotes
                                    {reviewFiles.length > 0 && (
                                        <span className="inline-flex min-w-4 items-center justify-center rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white">
                                            {reviewFiles.length}
                                        </span>
                                    )}
                                </span>
                            ),
                        },
                        {
                            key: 'profitability',
                            label: (
                                <span className="flex items-center gap-1.5">
                                    Profitability
                                    {profitabilityFiles.length > 0 && (
                                        <span className="inline-flex min-w-4 items-center justify-center rounded-full bg-emerald-600 px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white">
                                            {profitabilityFiles.length}
                                        </span>
                                    )}
                                </span>
                            ),
                        },
                    ]}
                />

                {loading && <p className="mt-3 text-sm text-slate-500">Loading files...</p>}

                {!loading && !visibleFiles.length && (
                    <p className="mt-3 text-sm text-slate-500">No files found for this quote.</p>
                )}

                {!loading && visibleFiles.length > 0 && (
                    <Collapse
                        key={collapseKey}
                        className="quote-files-collapse"
                        variant="panel"
                        items={collapseItems}
                        accordion
                        ghost
                    />
                )}
            </div>


        </div>
    )
}

export default QuoteDetailsPage
