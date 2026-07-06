"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DeleteOutlined, MoreOutlined, PlusOutlined, SearchOutlined } from '@/components/common/antd/icons';
import Button from '@/components/common/Button';
import Dropdown from '@/components/common/Dropdown';
import Input from '@/components/common/Input';
import Modal from '@/components/common/Modal';
import Select from '@/components/common/Select';
import Table from '@/components/common/Table';
import Message from '@/components/common/Message';
import type { ColumnsType } from '@/components/common/Table/types';
import {
    useGetProfitabilityLineItemsQuery,
    useBulkUpdateProfitabilityLineItemsMutation,
    useBulkDeleteProfitabilityLineItemsMutation,
    useDeleteProfitabilityLineItemMutation,
} from '@/store/services/quote/apiSlice';
import type { ProfitabilityLineItem as ApiProfItem, QuoteFile } from '@/store/services/quote/types';
import type { MenuProps } from 'antd';

type GroupingKey = 'file_name' | 'itemCode';

type RichProfItem = ApiProfItem & {
    __fileId: string;
    __fileName: string;
};

type BulkEditFieldDraft = {
    id: string;
    fieldKey: keyof ApiProfItem | null;
    value: string;
};

type FileData = {
    fileId: string;
    items: ApiProfItem[];
};

type DeleteTarget =
    | { kind: 'single'; item: RichProfItem }
    | { kind: 'bulk'; fileId: string; rowIds: string[] };

type Props = {
    quoteId: string;
    profitabilityFiles: QuoteFile[];
};

type FieldDef = { key: keyof ApiProfItem; title: string };
type ColDef = { key: keyof ApiProfItem; title: string; width?: number; align?: 'left' | 'right' | 'center' };

const GROUPING_OPTIONS: { label: string; value: GroupingKey }[] = [
    { label: 'File Name', value: 'file_name' },
    { label: 'Product Code', value: 'itemCode' },
];

const EMPTY_KEYS: string[] = [];
const EMPTY_ITEMS: ApiProfItem[] = [];

const ALL_KNOWN_COLUMNS: ColDef[] = [
    { key: 'lineNumber',   title: 'Line No',      width: 110, align: 'center' },
    { key: 'itemCode',     title: 'Product Code', width: 140 },
    { key: 'employeeId',   title: 'Employee ID',  width: 130 },
    { key: 'employeeName', title: 'Employee Name' },
    { key: 'description',  title: 'Description' },
    { key: 'department',   title: 'Department' },
    { key: 'category',     title: 'Category' },
    { key: 'email',        title: 'Email' },
    { key: 'phone',        title: 'Phone',        width: 130 },
    { key: 'salary',       title: 'Salary',       width: 120, align: 'right' },
    { key: 'quantity',     title: 'Qty',          width: 90,  align: 'right' },
    { key: 'unitPrice',    title: 'Unit Price',   width: 120, align: 'right' },
    { key: 'amount',       title: 'Amount',       width: 120, align: 'right' },
    { key: 'currency',     title: 'Currency',     width: 90 },
    { key: 'status',       title: 'Status',       width: 110 },
    { key: 'referenceNo',  title: 'Reference No', width: 130 },
    { key: 'location',     title: 'Location' },
    { key: 'notes',        title: 'Notes' },
];

const PROFITABILITY_FIELD_DEFS: FieldDef[] = [
    ...ALL_KNOWN_COLUMNS.map((col) => ({ key: col.key, title: col.title })),
    { key: 'sourceTableTitle', title: 'Source Table Title' },
    { key: 'rowSourceId', title: 'Row Source ID' },
    { key: 'rowIndex', title: 'Row Index' },
    { key: 'extraFields', title: 'Extra Fields' },
    { key: 'is_Verifed', title: 'Is Verified' },
    { key: 'customer_id', title: 'Customer ID' },
    { key: 'organization', title: 'Organization' },
    { key: 'product_id', title: 'Product ID' },
    { key: 'bundle_id', title: 'Bundle ID' },
    { key: 'adjusted_quantity', title: 'Adjusted Quantity' },
    { key: 'availability', title: 'Availability' },
    { key: 'line_amount', title: 'Line Amount' },
    { key: 'list_price', title: 'List Price' },
    { key: 'adjusted_price', title: 'Adjusted Price' },
    { key: 'serial_', title: 'Serial' },
    { key: 'eventId', title: 'Event ID' },
    { key: 'quote_config_id', title: 'Quote Config ID' },
    { key: 'subscriptionId', title: 'Subscription ID' },
    { key: 'portalId', title: 'Portal ID' },
    { key: 'occurredAt', title: 'Occurred At' },
    { key: 'subscriptionType', title: 'Subscription Type' },
    { key: 'attemptNumber', title: 'Attempt Number' },
    { key: 'objectId', title: 'Object ID' },
    { key: 'changeSource', title: 'Change Source' },
    { key: 'changeFlag', title: 'Change Flag' },
    { key: 'appId', title: 'App ID' },
    { key: 'bundle_cost', title: 'Bundle Cost' },
    { key: 'bundle_ext_price', title: 'Bundle Ext Price' },
    { key: 'bundle_gp', title: 'Bundle GP' },
    { key: 'bundle_gp_percentage', title: 'Bundle GP Percentage' },
    { key: 'bundle_msrp', title: 'Bundle MSRP' },
    { key: 'bundle_name', title: 'Bundle Name' },
    { key: 'bundle_rebate', title: 'Bundle Rebate' },
    { key: 'bundle_rebate_amount', title: 'Bundle Rebate Amount' },
    { key: 'bundle_unit_price', title: 'Bundle Unit Price' },
    { key: 'clin', title: 'CLIN' },
    { key: 'contract_fee_percentage', title: 'Contract Fee Percentage' },
    { key: 'contract_fee_amount', title: 'Contract Fee Amount' },
    { key: 'country_of_origin', title: 'Country Of Origin' },
    { key: 'display_mpn', title: 'Display MPN' },
    { key: 'end_date', title: 'End Date' },
    { key: 'energy_star_flag', title: 'Energy Star Flag' },
    { key: 'eol_date', title: 'EOL Date' },
    { key: 'epeat_flag', title: 'EPEAT Flag' },
    { key: 'equivalent_clin', title: 'Equivalent CLIN' },
    { key: 'excel_bundle_name', title: 'Excel Bundle Name' },
    { key: 'file_name', title: 'File Name' },
    { key: 'gsa_price', title: 'GSA Price' },
    { key: 'model_id', title: 'Model ID' },
    { key: 'mpn', title: 'MPN' },
    { key: 'ndr_cost', title: 'NDR Cost' },
    { key: 'unit_price', title: 'Unit Price Extended' },
    { key: 'oem', title: 'OEM' },
    { key: 'oem_name', title: 'OEM Name' },
    { key: 'partner_fee_percentage', title: 'Partner Fee Percentage' },
    { key: 'partner_fee_amount', title: 'Partner Fee Amount' },
    { key: 'serial_number', title: 'Serial Number' },
    { key: 'service_duration', title: 'Service Duration' },
    { key: 'ss_part', title: 'SS Part' },
    { key: 'start_date', title: 'Start Date' },
    { key: 'subscription_term', title: 'Subscription Term' },
    { key: 'taa_flag', title: 'TAA Flag' },
    { key: 'td_number', title: 'TD Number' },
    { key: 'unspsc', title: 'UNSPSC' },
    { key: 'vendor_line_number', title: 'Vendor Line Number' },
    { key: 'vendor_quote_line_item', title: 'Vendor Quote Line Item' },
    { key: 'vendor_disti', title: 'Vendor Disti' },
    { key: 'vendor_disti_name', title: 'Vendor Disti Name' },
    { key: 'months', title: 'Months' },
    { key: 'sub_total', title: 'Sub Total' },
    { key: 'total_cost', title: 'Total Cost' },
    { key: 'product_name', title: 'Product Name' },
    { key: 'use_line_amount', title: 'Use Line Amount' },
    { key: 'term_months', title: 'Term Months' },
    { key: 'term_years', title: 'Term Years' },
    { key: 'term_unit_calc', title: 'Term Unit Calc' },
    { key: 'total_cost_to_use', title: 'Total Cost To Use' },
    { key: 'lead_time', title: 'Lead Time' },
    { key: 'Discount_Class__c', title: 'Discount Class' },
    { key: 'Discount_Subclass__c', title: 'Discount Subclass' },
    { key: 'vendor_quote_number', title: 'Vendor Quote Number' },
    { key: 'manufacturer_product_code', title: 'Manufacturer Product Code' },
    { key: 'vendor_product_code', title: 'Vendor Product Code' },
    { key: 'sku', title: 'SKU' },
    { key: 'distributor_product_code', title: 'Distributor Product Code' },
    { key: 'discount_percentage', title: 'Discount Percentage' },
    { key: 'extended_list', title: 'Extended List' },
    { key: 'esi_price', title: 'ESI Price' },
    { key: 'pricing_method', title: 'Pricing Method' },
    { key: 'item_category_code', title: 'Item Category Code' },
    { key: 'ma_flag', title: 'MA Flag' },
    { key: 'gross_profit_percentage', title: 'Gross Profit Percentage' },
    { key: 'gross_profit', title: 'Gross Profit' },
    { key: 'msrp', title: 'MSRP' },
];

const HIDDEN_BULK_EDIT_FIELD_KEYS = new Set<keyof ApiProfItem>([
    'sourceTableTitle',
    'rowSourceId',
    'rowIndex',
    'extraFields',
    'is_Verifed',
    'customer_id',
    'product_id',
    'bundle_id',
    'eventId',
    'quote_config_id',
    'subscriptionId',
    'portalId',
    'occurredAt',
    'subscriptionType',
    'attemptNumber',
    'objectId',
    'changeSource',
    'changeFlag',
    'appId',
    'file_name',
    'use_line_amount',
]);

const PROFITABILITY_BULK_EDIT_FIELDS: FieldDef[] = PROFITABILITY_FIELD_DEFS.filter(
    (field) => !HIDDEN_BULK_EDIT_FIELD_KEYS.has(field.key),
);

const PROFITABILITY_TABLE_COLUMNS: ColDef[] = PROFITABILITY_FIELD_DEFS.map((field) => {
    const knownColumn = ALL_KNOWN_COLUMNS.find((col) => col.key === field.key);
    return knownColumn ?? { key: field.key, title: field.title };
});

// Hidden in the rendered table only; fields can still be edited and returned by the API.
const HIDDEN_COLUMN_KEYS = new Set<keyof ApiProfItem>([
    'lineNumber',
    'sourceTableTitle',
    'rowSourceId',
    'rowIndex',
    'is_Verifed',
    'use_line_amount',
    'optional',
]);

const parseLineNumber = (value: unknown): number => {
    if (value === null || value === undefined) return Infinity;
    const digits = String(value).replace(/\D/g, '');
    const num = parseInt(digits, 10);
    return Number.isFinite(num) ? num : Infinity;
};

const isPresent = (v: unknown) => v !== null && v !== undefined && String(v).trim() !== '';

const getErrorMessage = (error: unknown, fallback: string): string => {
    const err = error as { data?: { message?: string }; message?: string };
    return err?.data?.message ?? err?.message ?? fallback;
};

const createBulkEditField = (): BulkEditFieldDraft => ({
    id: `bef-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    fieldKey: null,
    value: '',
});

const matchesFilter = (item: RichProfItem, needle: string): boolean => {
    const hay = [
        ...PROFITABILITY_TABLE_COLUMNS.map((col) => String(item[col.key] ?? '')),
        item.__fileName,
    ].join(' ').toLowerCase();
    return hay.includes(needle);
};

const buildDynamicColumns = (
    items: RichProfItem[],
): ColumnsType<RichProfItem> => {
    const knownCols = PROFITABILITY_TABLE_COLUMNS
        .filter((col) => !HIDDEN_COLUMN_KEYS.has(col.key) && items.some((item) => isPresent(item[col.key])))
        .map((col) => ({
            title: col.title,
            dataIndex: col.key as string,
            key: col.key as string,
            ...(col.width ? { width: col.width } : {}),
            ...(col.align ? { align: col.align } : {}),
            onHeaderCell: () => ({ className: 'whitespace-nowrap bg-[#1a2e45] text-white text-xs' }),
            render: (value: unknown) => {
                if (!isPresent(value)) return <span className="text-slate-400">-</span>;
                if (col.align === 'right') {
                    const num = parseFloat(String(value));
                    return <span className="font-medium text-slate-800">{Number.isFinite(num) ? num.toFixed(2) : String(value)}</span>;
                }
                return <span className="text-slate-700">{String(value)}</span>;
            },
        }));

    const extraKeyOrder: string[] = [];
    const extraKeysSeen = new Set<string>();
    items.forEach((item) => {
        const extra = item.extraFields;
        if (extra && typeof extra === 'object' && !Array.isArray(extra)) {
            Object.keys(extra).forEach((k) => {
                if (!extraKeysSeen.has(k)) { extraKeysSeen.add(k); extraKeyOrder.push(k); }
            });
        }
    });

    const extraCols = extraKeyOrder
        .filter((k) => items.some((item) => {
            const e = item.extraFields;
            return e && typeof e === 'object' && !Array.isArray(e) && isPresent((e as Record<string, unknown>)[k]);
        }))
        .map((k) => ({
            title: k,
            key: `extra:${k}`,
            onHeaderCell: () => ({ className: 'whitespace-nowrap bg-[#1a2e45] text-white text-xs' }),
            render: (_: unknown, record: RichProfItem) => {
                const e = record.extraFields;
                const val = (e && typeof e === 'object' && !Array.isArray(e)) ? (e as Record<string, unknown>)[k] : undefined;
                return isPresent(val) ? <span className="text-slate-700">{String(val)}</span> : <span className="text-slate-400">-</span>;
            },
        }));

    /* Single-row delete column — uncomment when needed
    const actionsCol: ColumnsType<RichProfItem>[number] = {
        title: '',
        key: '__actions',
        width: 52,
        fixed: 'right' as const,
        onHeaderCell: () => ({ className: 'bg-[#1a2e45]' }),
        render: (_: unknown, record: RichProfItem) => (
            <Button
                variant="icon-button-2"
                size="small"
                icon={<DeleteOutlined />}
                onClick={() => onDeleteRow(record)}
                style={{ padding: 0, width: 30, height: 30 }}
            />
        ),
    };
    */

    return [...knownCols, ...extraCols];
};

// ── ProfitabilityItemLoader ───────────────────────────────────────────────────

const ProfitabilityItemLoader: React.FC<{
    quoteId: string;
    fileId: string;
    onLoad: (data: FileData) => void;
}> = ({ quoteId, fileId, onLoad }) => {
    const { data: items = EMPTY_ITEMS } = useGetProfitabilityLineItemsQuery(
        { quoteId, quoteFileId: fileId },
        { skip: !quoteId || !fileId },
    );

    const onLoadRef = useRef(onLoad);
    useEffect(() => {
        onLoadRef.current = onLoad;
    });

    useEffect(() => {
        onLoadRef.current({ fileId, items });
    }, [fileId, items]);

    return null;
};

// ── ProfitabilityGroupSection ─────────────────────────────────────────────────

const ProfitabilityGroupSection = React.memo<{
    label: string;
    items: RichProfItem[];

    groupFileId: string | null;
    selectedRowKeys: string[];
    onSelectionChange: (fileId: string, keys: React.Key[]) => void;
    onDeleteRow: (item: RichProfItem) => void;
}>(({ label, items, groupFileId, selectedRowKeys, onSelectionChange }) => {
    const columns = useMemo(
        () => buildDynamicColumns(items),
        [items],
    );

    const rowSelection = useMemo(
        () =>
            groupFileId
                ? {
                    columnWidth: 48,
                    selectedRowKeys,
                    onChange: (keys: React.Key[]) => onSelectionChange(groupFileId, keys),
                }
                : undefined,
        [groupFileId, selectedRowKeys, onSelectionChange],
    );

    return (
        <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
            <div className="flex flex-wrap items-center gap-4 bg-[#1a2e45] px-5 py-3 text-white">
                <span className="min-w-0 flex-1 truncate text-sm font-semibold">{label}</span>
                <span className="shrink-0 text-xs text-slate-300">{items.length} item{items.length !== 1 ? 's' : ''}</span>
                {selectedRowKeys.length > 0 && (
                    <span className="shrink-0 inline-flex items-center rounded-full bg-blue-500 px-2.5 py-0.5 text-xs font-semibold text-white">
                        {selectedRowKeys.length} selected
                    </span>
                )}
            </div>
            <div className="overflow-x-auto bg-white [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
                <Table<RichProfItem>
                    columns={columns}
                    dataSource={items}
                    rowKey={(row) => row.id}
                    pagination={false}
                    size="small"
                    scroll={{ x: 'max-content' }}
                    rowSelection={rowSelection}
                    locale={{ emptyText: 'No profitability line items.' }}
                    className="profitability-table"
                />
            </div>
        </div>
    );
});
ProfitabilityGroupSection.displayName = 'ProfitabilityGroupSection';

// ── ProfitabilityTab ──────────────────────────────────────────────────────────

const ProfitabilityTab: React.FC<Props> = ({ quoteId, profitabilityFiles }) => {
    const [messageApi, contextHolder] = Message.useMessage();

    const [groupingKey, setGroupingKey] = useState<GroupingKey>('file_name');
    const [filterText, setFilterText] = useState('');

    const [fileDataMap, setFileDataMap] = useState<Map<string, ApiProfItem[]>>(new Map());

    const handleFileLoad = useCallback((data: FileData) => {
        setFileDataMap((prev) => {
            const next = new Map(prev);
            next.set(data.fileId, data.items);
            return next;
        });
    }, []);

    const allItems = useMemo<RichProfItem[]>(() => {
        const out: RichProfItem[] = [];
        profitabilityFiles.forEach((file) => {
            (fileDataMap.get(file.id) ?? []).forEach((item) => {
                out.push({ ...item, __fileId: file.id, __fileName: file.file_name ?? '' });
            });
        });
        // Always sort ascending by line number
        out.sort((a, b) => parseLineNumber(a.lineNumber) - parseLineNumber(b.lineNumber));
        return out;
    }, [fileDataMap, profitabilityFiles]);

    const filteredItems = useMemo(() => {
        const needle = filterText.trim().toLowerCase();
        return needle ? allItems.filter((item) => matchesFilter(item, needle)) : allItems;
    }, [allItems, filterText]);

    const groups = useMemo(() => {
        const map = new Map<string, RichProfItem[]>();

        if (groupingKey === 'file_name') {
            profitabilityFiles.forEach((file) => {
                const label = (file.file_name ?? '').replace(/\.pdf$/i, '').trim() || file.id;
                map.set(label, filteredItems.filter((item) => item.__fileId === file.id));
            });
        } else {
            filteredItems.forEach((item) => {
                const raw = item[groupingKey as keyof ApiProfItem];
                // Skip items that have no value for the chosen grouping field
                if (!raw || typeof raw !== 'string' || !raw.trim()) return;
                const groupVal = raw.trim();
                if (!map.has(groupVal)) map.set(groupVal, []);
                map.get(groupVal)!.push(item);
            });
        }

        return Array.from(map.entries())
            .filter(([, items]) => items.length > 0)
            .map(([label, items]) => ({ label, items }));
    }, [filteredItems, groupingKey, profitabilityFiles]);

    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
    const [activeFileId, setActiveFileId] = useState<string | null>(null);

    const handleSelectionChange = useCallback((fileId: string, keys: React.Key[]) => {
        const next = keys.map((k) => String(k));
        setSelectedRowKeys(next);
        setActiveFileId(next.length > 0 ? fileId : null);
    }, []);

    const clearSelection = useCallback(() => {
        setSelectedRowKeys([]);
        setActiveFileId(null);
    }, []);

    const hasSelection = selectedRowKeys.length > 0 && activeFileId !== null;

    const activeBulkEditFieldDefs = useMemo<FieldDef[]>(
        () => PROFITABILITY_BULK_EDIT_FIELDS,
        [],
    );

    const [bulkUpdateProfItems, { isLoading: isBulkUpdating }] = useBulkUpdateProfitabilityLineItemsMutation();
    const [bulkDeleteProfItems, { isLoading: isBulkDeleting }] = useBulkDeleteProfitabilityLineItemsMutation();
    const [deleteProfItem, { isLoading: isSingleDeleting }] = useDeleteProfitabilityLineItemMutation();

    const [bulkEditOpen, setBulkEditOpen] = useState(false);
    const [bulkEditFields, setBulkEditFields] = useState<BulkEditFieldDraft[]>([]);

    const selectedColumnKeys = useMemo(
        () => new Set(bulkEditFields.map((f) => f.fieldKey).filter(Boolean)),
        [bulkEditFields],
    );

    const handleOpenBulkEdit = () => { setBulkEditFields([createBulkEditField()]); setBulkEditOpen(true); };
    const handleCloseBulkEdit = () => { setBulkEditOpen(false); setBulkEditFields([]); };

    const handleAddBulkEditField = () => {
        if (bulkEditFields.length >= activeBulkEditFieldDefs.length) return;
        setBulkEditFields((prev) => [...prev, createBulkEditField()]);
    };

    const handleUpdateBulkEditField = (id: string, changes: Partial<BulkEditFieldDraft>) =>
        setBulkEditFields((prev) => prev.map((f) => (f.id === id ? { ...f, ...changes } : f)));

    const handleRemoveBulkEditField = (id: string) =>
        setBulkEditFields((prev) => {
            const next = prev.filter((f) => f.id !== id);
            return next.length > 0 ? next : [createBulkEditField()];
        });

    const handleSubmitBulkEdit = async () => {
        if (!activeFileId || !selectedRowKeys.length) return;
        const data: Record<string, unknown> = {};
        for (const field of bulkEditFields) {
            if (!field.fieldKey || !field.value.trim()) continue;
            data[field.fieldKey] = field.value.trim();
        }
        if (!Object.keys(data).length) { messageApi.error('Enter at least one value before saving.'); return; }
        try {
            await bulkUpdateProfItems({ quoteId, quoteFileId: activeFileId, lineItemIds: selectedRowKeys, data: data as BulkUpdateProfPayload['data'] }).unwrap();
            messageApi.success('Line items updated successfully');
            handleCloseBulkEdit();
            clearSelection();
        } catch (err) {
            messageApi.error(getErrorMessage(err, 'Failed to update line items'));
        }
    };

    const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);

    const handleDeleteRow = useCallback((item: RichProfItem) => {
        setDeleteTarget({ kind: 'single', item });
    }, []);

    const handleOpenBulkDelete = () => {
        if (!hasSelection || !activeFileId) return;
        setDeleteTarget({ kind: 'bulk', fileId: activeFileId, rowIds: selectedRowKeys });
    };

    const handleConfirmDelete = async () => {
        if (!deleteTarget) return;
        try {
            if (deleteTarget.kind === 'single') {
                await deleteProfItem({ quoteId, quoteFileId: deleteTarget.item.__fileId, itemId: deleteTarget.item.id }).unwrap();
                messageApi.success('Line item deleted');
            } else {
                await bulkDeleteProfItems({ quoteId, quoteFileId: deleteTarget.fileId, lineItemIds: deleteTarget.rowIds }).unwrap();
                messageApi.success(`${deleteTarget.rowIds.length} item${deleteTarget.rowIds.length === 1 ? '' : 's'} deleted`);
                clearSelection();
            }
            setDeleteTarget(null);
        } catch (err) {
            messageApi.error(getErrorMessage(err, 'Failed to delete'));
        }
    };

    const isDeleting = isBulkDeleting || isSingleDeleting;

    const menuItems: MenuProps['items'] = [
        { key: 'edit-selected', label: 'Edit Selected', disabled: !hasSelection, onClick: () => { if (hasSelection) handleOpenBulkEdit(); } },
        { key: 'delete-selected', label: 'Delete Selected', danger: true, disabled: !hasSelection, onClick: () => { if (hasSelection) handleOpenBulkDelete(); } },
    ];

    const deleteModalTitle = deleteTarget
        ? deleteTarget.kind === 'single'
            ? 'Delete Line Item'
            : `Delete ${deleteTarget.rowIds.length} Line Item${deleteTarget.rowIds.length === 1 ? '' : 's'}`
        : '';

    return (
        <div className="profitability-tab-root space-y-4">
            {contextHolder}

            {profitabilityFiles.map((file) => (
                <ProfitabilityItemLoader key={file.id} quoteId={quoteId} fileId={file.id} onLoad={handleFileLoad} />
            ))}

            <div className="flex flex-wrap items-center justify-between gap-3">
                <Input
                    prefix={<SearchOutlined className="text-slate-400" />}
                    placeholder="Search line items..."
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                    allowClear
                    style={{ maxWidth: 320 }}
                />
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-600">Select Grouping</span>
                    <Select
                        size="large"
                        value={groupingKey}
                        options={GROUPING_OPTIONS}
                        style={{ minWidth: 180 }}
                        onChange={(val) => { setGroupingKey(val as GroupingKey); clearSelection(); }}
                    />
                    <Dropdown menuItems={menuItems} trigger={['click']} placement="bottomRight">
                        <Button
                            variant="primary"
                            style={{ width: 40, padding: 0, flexShrink: 0, visibility: hasSelection ? 'visible' : 'hidden' }}
                            icon={<MoreOutlined />}
                            aria-label="Table actions"
                        />
                    </Dropdown>
                </div>
            </div>

            {groups.length === 0 ? (
                <p className="py-8 text-center text-sm text-slate-500">
                    {filterText.trim() ? 'No line items match your filter.' : 'No profitability line items found.'}
                </p>
            ) : (
                <div className="space-y-4">
                    {groups.map(({ label, items }) => {
                        const groupFileId =
                            groupingKey === 'file_name'
                                ? (profitabilityFiles.find((f) => ((f.file_name ?? '').replace(/\.pdf$/i, '').trim() || f.id) === label)?.id ?? null)
                                : (items[0]?.__fileId ?? null);

                        const isActive = activeFileId !== null && groupFileId === activeFileId;
                        const groupSelectedKeys = isActive ? selectedRowKeys : EMPTY_KEYS;

                        return (
                            <ProfitabilityGroupSection
                                key={label}
                                label={label}
                                items={items}
                                groupFileId={groupFileId}
                                selectedRowKeys={groupSelectedKeys}
                                onSelectionChange={handleSelectionChange}
                                onDeleteRow={handleDeleteRow}
                            />
                        );
                    })}
                </div>
            )}

            <Modal
                open={bulkEditOpen}
                title={`Bulk Edit ${selectedRowKeys.length} row${selectedRowKeys.length === 1 ? '' : 's'}`}
                okText="Apply changes"
                cancelText="Cancel"
                confirmLoading={isBulkUpdating}
                onOk={() => void handleSubmitBulkEdit()}
                onCancel={handleCloseBulkEdit}
                width={560}
                destroyOnHidden
            >
                <div className="py-3 space-y-4">
                    <p className="text-sm text-slate-600">Pick columns, enter a shared value, and apply it to all selected rows.</p>
                    <Button
                        variant="secondary"
                        icon={<PlusOutlined />}
                        onClick={handleAddBulkEditField}
                        disabled={bulkEditFields.length >= activeBulkEditFieldDefs.length}
                        style={{ borderRadius: '50%', width: 32, height: 32, padding: 0, minWidth: 32 }}
                    />
                    {bulkEditFields.length > 0 && (
                        <div className="grid gap-3" style={{ gridTemplateColumns: '1fr 1fr auto' }}>
                            <span className="text-sm font-medium text-slate-700">Field</span>
                            <span className="text-sm font-medium text-slate-700">Value</span>
                            <span />
                        </div>
                    )}
                    <div className="space-y-3">
                        {bulkEditFields.map((field) => {
                            const available = activeBulkEditFieldDefs.filter((def) => def.key === field.fieldKey || !selectedColumnKeys.has(def.key));
                            return (
                                <div key={field.id} className="grid items-center gap-3" style={{ gridTemplateColumns: '1fr 1fr auto' }}>
                                    <Select
                                        size="large"
                                        value={field.fieldKey ?? undefined}
                                        placeholder="Select field"
                                        showSearch
                                        filterOption={(input, option) =>
                                            String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                        }
                                        listHeight={400}
                                        options={available.map((def) => ({ label: def.title, value: def.key }))}
                                        style={{ width: '100%' }}
                                        onChange={(val) => handleUpdateBulkEditField(field.id, { fieldKey: val as keyof ApiProfItem, value: '' })}
                                    />
                                    <Input
                                        size="large"
                                        value={field.value}
                                        disabled={!field.fieldKey}
                                        placeholder={field.fieldKey ? 'Enter value' : 'Select a field first'}
                                        onChange={(e) => handleUpdateBulkEditField(field.id, { value: e.target.value })}
                                    />
                                    <Button variant="icon-button-2" icon={<DeleteOutlined />} onClick={() => handleRemoveBulkEditField(field.id)} style={{ flexShrink: 0 }} />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </Modal>

            <Modal open={Boolean(deleteTarget)} title={null} footer={null} onCancel={() => { if (!isDeleting) setDeleteTarget(null); }} width={480} destroyOnHidden>
                <div className="flex flex-col items-center gap-4 py-4 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                        <DeleteOutlined className="text-xl text-red-500" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900">{deleteModalTitle}</h3>
                        <p className="mt-1 text-sm text-slate-600">Are you sure? This action cannot be undone.</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="secondary" onClick={() => setDeleteTarget(null)} disabled={isDeleting}>Don&apos;t Delete</Button>
                        <Button variant="primary" loading={isDeleting} onClick={() => void handleConfirmDelete()}>Yes, Delete</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

type BulkUpdateProfPayload = import('@/store/services/quote/types').BulkUpdateProfitabilityPayload;

export default ProfitabilityTab;
