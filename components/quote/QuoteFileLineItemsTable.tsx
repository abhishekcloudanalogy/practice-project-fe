"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { HotTable } from '@handsontable/react'
import type { HotTableClass } from '@handsontable/react'
import type { CellChange, ChangeSource } from 'handsontable/common'
import { registerAllModules } from 'handsontable/registry'
import 'handsontable/styles/handsontable.css'
import 'handsontable/styles/ht-theme-main.css'
import Message from '@/components/common/Message'
import Spin from '@/components/common/Spin'
import Empty from '@/components/common/Empty'
import Typography from '@/components/common/Typography'
import Button from '@/components/common/Button'
import Table from '@/components/common/Table'
import type { ColumnsType } from '@/components/common/Table/types'
import {
    useGetQuoteFileLineItemsQuery,
    useCreateLineItemMutation,
    useUpdateLineItemMutation,
    useDeleteLineItemMutation,
    useVerifyQuoteFileMutation,
} from '@/store/services/quote/apiSlice'
import type { LineItem } from '@/store/services/quote/types'

registerAllModules()
const { Text } = Typography
const VISIBLE_LINE_ITEMS_COUNT = 5
const EMPTY_LINE_ITEMS: LineItem[] = []

type Props = {
    quoteId: string
    quoteFileId: string
    showSaveButton?: boolean
    useHotTable?: boolean
    onSaveComplete?: () => void
}

type DraftLineItem = Partial<LineItem> & {
    __id?: string
    extraFields: Record<string, unknown>
}


const EDITABLE_FIELD_DEFINITIONS: Array<{ key: keyof LineItem; title: string; width?: number }> = [
    { key: 'lineNumber', title: 'Line No', width: 110 },
    { key: 'itemCode', title: 'Item Code' },
    { key: 'employeeId', title: 'Employee ID', width: 130 },
    { key: 'employeeName', title: 'Employee Name' },
    { key: 'description', title: 'Description' },
    { key: 'department', title: 'Department' },
    { key: 'category', title: 'Category' },
    { key: 'email', title: 'Email' },
    { key: 'phone', title: 'Phone', width: 130 },
    { key: 'salary', title: 'Salary', width: 110 },
    { key: 'quantity', title: 'Quantity', width: 100 },
    { key: 'unitPrice', title: 'Unit Price', width: 110 },
    { key: 'amount', title: 'Amount', width: 110 },
    { key: 'currency', title: 'Currency', width: 90 },
    { key: 'status', title: 'Status', width: 100 },
    { key: 'referenceNo', title: 'Reference No', width: 130 },
    { key: 'location', title: 'Location' },
    { key: 'notes', title: 'Notes (raw)' },
]

const READONLY_FIELD_DEFINITIONS: Array<{ key: keyof LineItem; title: string; width?: number }> = [
    { key: 'lineNumber', title: 'Line No', width: 110 },
    { key: 'itemCode', title: 'Item Code' },
    { key: 'employeeId', title: 'Employee ID', width: 130 },
    { key: 'employeeName', title: 'Employee Name' },
    { key: 'description', title: 'Description' },
    { key: 'department', title: 'Department' },
    { key: 'category', title: 'Category' },
    { key: 'email', title: 'Email' },
    { key: 'phone', title: 'Phone', width: 130 },
    { key: 'salary', title: 'Salary', width: 110 },
    { key: 'quantity', title: 'Quantity', width: 100 },
    { key: 'unitPrice', title: 'Unit Price', width: 110 },
    { key: 'amount', title: 'Amount', width: 110 },
    { key: 'currency', title: 'Currency', width: 90 },
    { key: 'status', title: 'Status', width: 100 },
    { key: 'referenceNo', title: 'Reference No', width: 130 },
    { key: 'location', title: 'Location' },
    { key: 'notes', title: 'Notes' },
]

const EDITABLE_FIELD_KEYS = new Set<string>(EDITABLE_FIELD_DEFINITIONS.map((field) => String(field.key)))


const isPresent = (value: unknown) => value !== null && value !== undefined && String(value).trim() !== ''

const getErrorMessage = (error: unknown, fallback: string): string => {
    const err = error as { data?: { message?: string }; message?: string }
    return err?.data?.message || err?.message || fallback
}

const normalizeNullableValue = (value: unknown): unknown => {
    if (value === null || value === undefined) return null
    if (typeof value === 'string' && value.trim() === '') return null
    return value
}

const normalizeExtraFieldsForDraft = (value: unknown): Record<string, unknown> => {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
        return { ...(value as Record<string, unknown>) }
    }
    return {}
}

const shouldHideExtraFieldInUi = (key: string): boolean => {
    const normalized = key.trim().toLowerCase().replace(/[\s_-]+/g, '')
    return normalized === 'row' || normalized === 'rowindex'
}

const shouldHidePrimaryFieldInUi = (key: keyof LineItem): boolean => key === 'lineNumber'

const createDraftRowFromItem = (item: LineItem): DraftLineItem => ({
    ...item,
    __id: item.id,
    extraFields: normalizeExtraFieldsForDraft(item.extraFields),
})

const createBlankDraftRow = (rowIndex: number): DraftLineItem => {
    const row: DraftLineItem = {
        __id: '',
        rowIndex,
        extraFields: {},
    }

    EDITABLE_FIELD_DEFINITIONS.forEach((field) => {
        ;(row as any)[field.key] = null
    })

    return row
}

const formatCellValue = (value: unknown): string => {
    if (value === null || value === undefined || value === '') return '-'
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        return String(value)
    }
    return JSON.stringify(value)
}

const getExtraFields = (item: LineItem): Record<string, string> => {
    if (item.extraFields && typeof item.extraFields === 'object' && !Array.isArray(item.extraFields)) {
        const result: Record<string, string> = {}
        Object.entries(item.extraFields).forEach(([key, value]) => {
            if (isPresent(value)) result[key] = String(value)
        })
        return result
    }

    return {}
}

const parseSortableLineNumber = (value: unknown): number | null => {
    if (!isPresent(value)) return null

    const parsed = Number(String(value).trim())
    return Number.isFinite(parsed) ? parsed : null
}

const buildDynamicColumns = (lineItems: LineItem[]): ColumnsType<LineItem> => {
    const extrasByItemId = new Map<string, Record<string, string>>(
        lineItems.map((item) => [item.id, getExtraFields(item)])
    )

    const knownFieldColumns = READONLY_FIELD_DEFINITIONS
        .filter((field) => !shouldHidePrimaryFieldInUi(field.key))
        .filter((field) => lineItems.some((item) => isPresent(item[field.key])))
        .map((field) => ({
            title: field.title,
            dataIndex: field.key,
            key: field.key,
            ...(field.width ? { width: field.width } : {}),
            render: (value: unknown) => <span className="text-slate-700">{formatCellValue(value)}</span>,
        }))

    const extraKeyOrder: string[] = []
    const extraKeysSeen = new Set<string>()
    extrasByItemId.forEach((extras) => {
        Object.keys(extras).forEach((key) => {
            if (shouldHideExtraFieldInUi(key)) return
            if (!extraKeysSeen.has(key)) {
                extraKeysSeen.add(key)
                extraKeyOrder.push(key)
            }
        })
    })

    const extraColumns = extraKeyOrder.map((extraKey) => ({
        title: extraKey,
        key: `extra:${extraKey}`,
        render: (_: unknown, record: LineItem) => {
            const value = extrasByItemId.get(record.id)?.[extraKey]
            return <span className="text-slate-700">{formatCellValue(value)}</span>
        },
    }))

    return [     
        ...knownFieldColumns,
        ...extraColumns,
    ]
}

const QuoteFileLineItemsEditableTable: React.FC<Props> = ({
    quoteId,
    quoteFileId,
    showSaveButton = false,
    useHotTable = true,
    onSaveComplete,
}) => {
    const hotRef = useRef<HotTableClass>(null)
    const lastAppliedServerSnapshotKeyRef = useRef('')
    const [draftRows, setDraftRows] = useState<DraftLineItem[]>([])
    const [isDirty, setIsDirty] = useState(false)
    const [isSavingItems, setIsSavingItems] = useState(false)

    const { data: lineItemsData, isLoading, isFetching, error, refetch } = useGetQuoteFileLineItemsQuery(
        { quoteId, quoteFileId },
        { skip: !quoteId || !quoteFileId },
    )
    const lineItems = lineItemsData ?? EMPTY_LINE_ITEMS
    const [createLineItem] = useCreateLineItemMutation()
    const [updateLineItem] = useUpdateLineItemMutation()
    const [deleteLineItem] = useDeleteLineItemMutation()
    const [verifyQuoteFile, { isLoading: isVerifying }] = useVerifyQuoteFileMutation()

    const serverSnapshotKey = useMemo(
        () => lineItems.map((item) => `${item.id}:${item.updatedAt}:${item.rowIndex ?? ''}`).join('|'),
        [lineItems],
    )

    const loading = isLoading || isFetching
    const sortedReadonlyLineItems = useMemo(() => {
        return lineItems
            .map((item, index) => ({ item, index }))
            .sort((a, b) => {
                const aNum = parseSortableLineNumber(a.item.lineNumber)
                const bNum = parseSortableLineNumber(b.item.lineNumber)

                if (aNum !== null && bNum !== null && aNum !== bNum) return aNum - bNum
                if (aNum !== null && bNum === null) return -1
                if (aNum === null && bNum !== null) return 1

                const aText = String(a.item.lineNumber ?? '').trim()
                const bText = String(b.item.lineNumber ?? '').trim()
                const textCompare = aText.localeCompare(bText, undefined, { numeric: true, sensitivity: 'base' })
                if (textCompare !== 0) return textCompare

                return a.index - b.index
            })
            .map(({ item }) => item)
    }, [lineItems])
    const visibleReadonlyLineItems = useMemo(
        () => sortedReadonlyLineItems,
        [sortedReadonlyLineItems],
    )
    const readonlyColumns = useMemo(() => buildDynamicColumns(sortedReadonlyLineItems), [sortedReadonlyLineItems])

    useEffect(() => {
        if (isDirty) return
        if (lastAppliedServerSnapshotKeyRef.current === serverSnapshotKey) return

        lastAppliedServerSnapshotKeyRef.current = serverSnapshotKey
        setDraftRows(lineItems.map(createDraftRowFromItem))
    }, [lineItems, isDirty, serverSnapshotKey])

    const handleSaveItems = async () => {
        if (!isDirty) {
            Message.info('No changes to save')
            return
        }

        setIsSavingItems(true)

        try {
            const originalById = new Map(lineItems.map((item) => [item.id, item]))
            const draftRowsWithId = draftRows.filter((row) => typeof row.__id === 'string' && row.__id.trim().length > 0)
            const draftIds = new Set(draftRowsWithId.map((row) => row.__id as string))

            const rowsToDelete = lineItems.filter((item) => !draftIds.has(item.id))
            for (const row of rowsToDelete) {
                await deleteLineItem({ quoteId, quoteFileId, lineItemId: row.id }).unwrap()
            }

            for (let rowIndex = 0; rowIndex < draftRows.length; rowIndex += 1) {
                const draftRow = draftRows[rowIndex]
                const draftId = typeof draftRow.__id === 'string' && draftRow.__id.trim().length > 0
                    ? draftRow.__id.trim()
                    : ''

                if (!draftId) {
                    const createPayload: Record<string, unknown> = { rowIndex }

                    EDITABLE_FIELD_DEFINITIONS.forEach((field) => {
                        createPayload[field.key] = normalizeNullableValue(draftRow[field.key])
                    })

                    const created = await createLineItem({
                        quoteId,
                        quoteFileId,
                        data: createPayload,
                    }).unwrap()

                    const extraFields = normalizeExtraFieldsForDraft(draftRow.extraFields)
                    for (const [extraKey, extraValue] of Object.entries(extraFields)) {
                        await updateLineItem({
                            quoteId,
                            quoteFileId,
                            lineItemId: created.lineItem.id,
                            data: {
                                extraFieldKey: extraKey,
                                extraFieldValue: normalizeNullableValue(extraValue),
                            },
                        }).unwrap()
                    }

                    continue
                }

                const original = originalById.get(draftId)
                if (!original) continue

                const updatePayload: Record<string, unknown> = {}
                EDITABLE_FIELD_DEFINITIONS.forEach((field) => {
                    const previousValue = normalizeNullableValue(original[field.key])
                    const currentValue = normalizeNullableValue(draftRow[field.key])

                    if (previousValue !== currentValue) {
                        updatePayload[field.key] = currentValue
                    }
                })

                if (Object.keys(updatePayload).length > 0) {
                    await updateLineItem({
                        quoteId,
                        quoteFileId,
                        lineItemId: draftId,
                        data: updatePayload,
                    }).unwrap()
                }

                const originalExtra = normalizeExtraFieldsForDraft(original.extraFields)
                const draftExtra = normalizeExtraFieldsForDraft(draftRow.extraFields)
                const extraKeys = new Set([...Object.keys(originalExtra), ...Object.keys(draftExtra)])

                for (const extraKey of extraKeys) {
                    const previousValue = normalizeNullableValue(originalExtra[extraKey])
                    const currentValue = normalizeNullableValue(draftExtra[extraKey])

                    if (previousValue === currentValue) continue

                    await updateLineItem({
                        quoteId,
                        quoteFileId,
                        lineItemId: draftId,
                        data: {
                            extraFieldKey: extraKey,
                            extraFieldValue: currentValue,
                        },
                    }).unwrap()
                }
            }

            await refetch()
            setIsDirty(false)

            if (showSaveButton) {
                await verifyQuoteFile({ quoteId, quoteFileId }).unwrap()
                Message.success('Items saved and verified successfully')
                onSaveComplete?.()
                return
            }

            Message.success('Items saved successfully')
        } catch (error) {
            Message.error(getErrorMessage(error, 'Failed to save items'))
        } finally {
            setIsSavingItems(false)
        }
    }

    const activeFields = useMemo(
        () => EDITABLE_FIELD_DEFINITIONS
            .filter((field) => !shouldHidePrimaryFieldInUi(field.key))
            .filter((field) => draftRows.some((item) => isPresent(item[field.key]))),
        [draftRows],
    )

    // Fall back to a minimal starter set if the file has no line items yet,
    // so the grid isn't empty when adding the very first row manually.
    const fieldsToRender = activeFields.length > 0
        ? activeFields
        : EDITABLE_FIELD_DEFINITIONS.filter((field) => !shouldHidePrimaryFieldInUi(field.key)).slice(0, 6)

    const extraFieldKeys = useMemo(() => {
        const seen = new Set<string>()
        const order: string[] = []

        draftRows.forEach((item) => {
            Object.keys(normalizeExtraFieldsForDraft(item.extraFields)).forEach((key) => {
                if (shouldHideExtraFieldInUi(key)) return
                if (!seen.has(key)) {
                    seen.add(key)
                    order.push(key)
                }
            })
        })

        return order
    }, [draftRows])

    const colHeaders = useMemo(
        () => [...fieldsToRender.map((f) => f.title), ...extraFieldKeys],
        [fieldsToRender, extraFieldKeys],
    )
    const columns = useMemo(
        () => [
            ...fieldsToRender.map((f) => ({ data: String(f.key) })),
            ...extraFieldKeys.map((key) => ({ data: `extraFields.${key}` })),
        ],
        [fieldsToRender, extraFieldKeys],
    )
    const colWidths = useMemo(
        () => [...fieldsToRender.map((f) => f.width ?? 160), ...extraFieldKeys.map(() => 160)],
        [fieldsToRender, extraFieldKeys],
    )

    const data = useMemo(
        () => draftRows.map((item) => ({ ...item, __id: item.__id || '', extraFields: item.extraFields || {} })),
        [draftRows],
    )

    const handleAfterChange = (changes: CellChange[] | null, source: ChangeSource) => {
        if (!changes || source === 'loadData' || source === 'updateData') return

        setDraftRows((prev) => {
            const next = [...prev]

            changes.forEach(([rowIndex, prop, oldValue, newValue]) => {
                if (oldValue === newValue) return
                if (typeof prop !== 'string') return

                const currentRow = next[rowIndex] ? { ...next[rowIndex] } : createBlankDraftRow(rowIndex)

                if (prop.startsWith('extraFields.')) {
                    const extraKey = prop.slice('extraFields.'.length)
                    const currentExtra = normalizeExtraFieldsForDraft(currentRow.extraFields)
                    currentExtra[extraKey] = newValue
                    currentRow.extraFields = currentExtra
                    next[rowIndex] = currentRow
                    return
                }

                if (!EDITABLE_FIELD_KEYS.has(prop)) return

                ;(currentRow as any)[prop] = newValue
                next[rowIndex] = currentRow
            })

            return next
        })

        setIsDirty(true)
    }

    const handleAfterCreateRow = (index: number, amount: number = 1) => {
        setDraftRows((prev) => {
            const next = [...prev]
            const rowsToInsert = Array.from({ length: amount }, (_, offset) => createBlankDraftRow(index + offset))
            next.splice(index, 0, ...rowsToInsert)
            return next.map((row, rowIndex) => ({ ...row, rowIndex }))
        })

        setIsDirty(true)
    }

    const handleAfterRemoveRow = (_index: number, _amount: number, physicalRows: number[] = []) => {
        const removed = new Set(physicalRows)

        setDraftRows((prev) => {
            const next = prev.filter((_row, rowIndex) => !removed.has(rowIndex))
            return next.map((row, rowIndex) => ({ ...row, rowIndex }))
        })

        setIsDirty(true)
    }

    const saveButton = showSaveButton ? (
        <div className="mt-3 flex justify-end gap-2">
            <Button
                type="primary"
                onClick={handleSaveItems}
                loading={isSavingItems || isVerifying}
                disabled={loading || isSavingItems || isVerifying || !isDirty}
            >
                Save Items
            </Button>
        </div>
    ) : null

    if (loading) {
        return (
            <div className="flex min-h-40 items-center justify-center">
                <Spin size="large" />
            </div>
        )
    }

    if (error) {
        return <p className="text-sm text-red-500">Failed to load line items.</p>
    }

    if (!useHotTable) {
        if (!visibleReadonlyLineItems.length) {
            return (
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={<Text className="text-slate-400">No line items found for this file.</Text>}
                />
            )
        }

        return (
            <Table
                columns={readonlyColumns}
                dataSource={visibleReadonlyLineItems}
                rowKey={(record) => record.id}
                scroll={{ x: 980 }}
                pagination={false}
            />
        )
    }

    if (!draftRows.length) {
        return (
            <div className="space-y-3">
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={<Text className="text-slate-400">No line items yet — right-click below to add a row</Text>}
                />
                <HotTable
                    ref={hotRef}
                    data={[{}]}
                    colHeaders={colHeaders}
                    columns={columns}
                    colWidths={colWidths}
                    rowHeaders
                    width="100%"
                    height="auto"
                    stretchH="all"
                    manualColumnResize
                    licenseKey="non-commercial-and-evaluation"
                    contextMenu={{ items: { row_above: {}, row_below: {}, remove_row: {}, undo: {}, redo: {} } }}
                    afterChange={handleAfterChange}
                    afterCreateRow={handleAfterCreateRow}
                    afterRemoveRow={handleAfterRemoveRow}
                />
                {saveButton}
            </div>
        )
    }

    return (
        <div>
            <div className="relative z-0 w-full max-w-full overflow-x-auto overscroll-x-contain [&_.handsontable]:relative [&_.handsontable]:z-0 [&_.handsontable]:text-[13px] [&_.handsontable_th]:bg-slate-50 [&_.handsontable_th]:text-[12px] [&_.handsontable_th]:font-semibold">
                <HotTable
                    ref={hotRef}
                    data={data}
                    colHeaders={colHeaders}
                    columns={columns}
                    colWidths={colWidths}
                    rowHeaders
                    width="100%"
                    height="auto"
                    autoRowSize
                    stretchH="all"
                    manualColumnResize
                    manualRowResize
                    filters
                    columnSorting
                    licenseKey="non-commercial-and-evaluation"
                    enterBeginsEditing
                    contextMenu={{ items: { row_above: {}, row_below: {}, remove_row: {}, undo: {}, redo: {}, copy: {}, cut: {} } }}
                    afterChange={handleAfterChange}
                    afterCreateRow={handleAfterCreateRow}
                    afterRemoveRow={handleAfterRemoveRow}
                />
            </div>
            {saveButton}
        </div>
    )
}

export default QuoteFileLineItemsEditableTable