"use client";

import  { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeftOutlined, CloseOutlined, DeleteOutlined, EditOutlined, FilePdfOutlined, SaveOutlined } from "@/components/common/antd/icons";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import Table from "@/components/common/Table";
import message from "@/components/common/Message";
import Modal from "@/components/common/Modal";
import { StyledPdfDetailsPage } from "@/components/pdf/PdfDetails.styles";
import {
	useClearPdfTableRowsMutation,
	useCreatePdfTableRowMutation,
	useDeletePdfTableMutation,
	useDeletePdfTableRowMutation,
	useDeletePdfMutation,
	useGetPdfTablesQuery,
	useGetPdfByIdQuery,
	useUpdatePdfTableRowMutation,
} from "@/store/services/pdf/apiSlice";
import type { PdfColumn, PdfTable, PdfTableRow } from "@/store/services/types";

type EditableRow = PdfTableRow & { __rowKey: string; __isNew?: boolean };

type EditableTableGroup = {
	id: string;
	key: string;
	title: string;
	columns: PdfColumn[];
	rows: EditableRow[];
	index: number;
	pdfDocumentId: string;
	schemaHash: string;
	tableHash: string;
};

const EMPTY_PDF_TABLES: PdfTable[] = [];

const inferColumnsFromRows = (rows: Record<string, any>[] = []): PdfColumn[] => {
	const keys = new Set<string>();
	const ignoredKeys = new Set(["__rowKey", "__isNew", "id", "rowIndex", "rowHash", "pdfDocumentId", "tableId"]);

	rows.forEach((row) => {
		Object.keys(row).forEach((key) => {
			if (!ignoredKeys.has(key)) {
				keys.add(key);
			}
		});
	});

	return Array.from(keys).map((key) => ({
		title: key
			.replace(/([a-z])([A-Z])/g, "$1 $2")
			.replace(/[_-]+/g, " ")
			.replace(/^./, (char) => char.toUpperCase()),
		key,
		dataType: "string",
	}));
};

const buildEditableRows = (rows: PdfTableRow[] | undefined): EditableRow[] =>
	(rows ?? []).map((row, index) => ({
		...row,
		__rowKey: String(row.id ?? index),
	}));

const stripEditableRowKey = (row: EditableRow) => {
	const { __rowKey, __isNew, id, rowIndex, rowHash, ...rest } = row;
	return rest;
};

const getTableTitle = (table: PdfTable, index: number) => {
	return table.title?.trim() || `Table ${index + 1}`;
};

const buildTableGroups = (tables: PdfTable[] | undefined): EditableTableGroup[] => {
	return (tables ?? []).map((table, tableIndex) => {
		const rows = buildEditableRows(table.rows).map((row, rowIndex) => ({
			...row,
			__rowKey: `table-${tableIndex + 1}:${row.__rowKey || rowIndex}`,
		}));

		return {
			id: table.id,
			key: table.id,
			title: getTableTitle(table as unknown as PdfTable, tableIndex),
			columns: table.columns.length > 0 ? table.columns : inferColumnsFromRows(rows),
			rows,
			index: tableIndex,
			pdfDocumentId: table.pdfDocumentId,
			schemaHash: table.schemaHash,
			tableHash: table.tableHash,
		};
	});
};

const getErrorMessage = (error: unknown, fallback: string) => {
	if (typeof error === "string") {
		return error;
	}

	if (error && typeof error === "object") {
		const maybeError = error as { message?: unknown; data?: { message?: unknown } };
		if (typeof maybeError.data?.message === "string") {
			return maybeError.data.message;
		}
		if (typeof maybeError.message === "string") {
			return maybeError.message;
		}
	}

	return fallback;
};

const renderCell = (value: unknown) => {
	if (value === null || value === undefined || value === "") {
		return <span className="text-slate-400">-</span>;
	}

	if (typeof value === "number") {
		return <span className="font-medium text-slate-900">{value.toLocaleString()}</span>;
	}

	return <span className="text-slate-700">{String(value)}</span>;
};

const isBlankRow = (row: EditableRow, columns: PdfColumn[]) => {
	return columns.every((column) => {
		const value = row[column.key];

		if (value === null || value === undefined) {
			return true;
		}

		return typeof value === "string" ? value.trim() === "" : value === "";
	});
};

const PdfDetailsPage = () => {
	const params = useParams<{ id: string }>();
	const router = useRouter();
	const searchParams = useSearchParams();
	const pdfId = params?.id as string | undefined;
	const selectedTableId = searchParams.get("tableId");

	const { data: pdf, isLoading: loading, error } = useGetPdfByIdQuery(pdfId ?? "", {
		skip: !pdfId,
	});
	const {
		data: pdfTablesData,
		isLoading: tablesLoading,
		refetch: refetchTables,
	} = useGetPdfTablesQuery(pdfId ?? "", {
		skip: !pdfId,
	});
	const pdfTables = pdfTablesData ?? EMPTY_PDF_TABLES;
	const [createPdfTableRow, { isLoading: creatingRow }] = useCreatePdfTableRowMutation();
	const [updatePdfTableRow, { isLoading: savingExtractedRow }] = useUpdatePdfTableRowMutation();
	const [deletePdfTableRow] = useDeletePdfTableRowMutation();
	const [clearPdfTableRows] = useClearPdfTableRowsMutation();
	const [deletePdfTable] = useDeletePdfTableMutation();
	const [deletePdf] = useDeletePdfMutation();
	const [messageApi, contextHolder] = message.useMessage();
	const [tableGroups, setTableGroups] = useState<EditableTableGroup[]>([]);
	const [editingRowKey, setEditingRowKey] = useState<string | null>(null);
	const [savingRowKey, setSavingRowKey] = useState<string | null>(null);
	const [deletingRowKey, setDeletingRowKey] = useState<string | null>(null);
	const [clearTableTargetId, setClearTableTargetId] = useState<string | null>(null);
	const [deleteTableTargetId, setDeleteTableTargetId] = useState<string | null>(null);
	const [deleteRowTarget, setDeleteRowTarget] = useState<{ tableId: string; rowId: string; rowKey: string } | null>(null);
	const [deletePdfOpen, setDeletePdfOpen] = useState(false);
	const isPageLoading = loading || tablesLoading;

	useEffect(() => {
		if (error) {
			messageApi.error("Failed to fetch PDF");
		}
	}, [error, messageApi]);

	const tableGroupCount = tableGroups.length;
	const canEditTable = (tableId: string) => !selectedTableId || selectedTableId === tableId;

	useEffect(() => {
		setTableGroups(buildTableGroups(pdfTables));
		setEditingRowKey(null);
		setSavingRowKey(null);
		setDeletingRowKey(null);
	}, [pdfTables]);

	const handleSaveRow = async (tableKey: string, rowKey: string) => {
		if (!pdf) return;

		const tableGroup = tableGroups.find((group) => group.key === tableKey);
		if (!tableGroup) return;
		if (!canEditTable(tableGroup.id)) return;

		const targetRow = tableGroup.rows.find((row) => row.__rowKey === rowKey);
		if (!targetRow) return;

		for (const column of tableGroup.columns) {
			if (column.dataType === "number") {
				const rawValue = targetRow[column.key];
				if (rawValue !== "" && Number.isNaN(Number(rawValue))) {
					messageApi.error(`${column.title} must be a valid number.`);
					return;
				}
			}
		}

		if (targetRow.__isNew && isBlankRow(targetRow, tableGroup.columns)) {
			messageApi.error("Enter at least one value before creating a row.");
			return;
		}

		setSavingRowKey(rowKey);
		try {
			const payload = stripEditableRowKey(targetRow);
			if (targetRow.__isNew) {
				await createPdfTableRow({ tableId: tableKey, rowData: payload }).unwrap();
				messageApi.success("Row created successfully");
			} else {
				await updatePdfTableRow({ tableId: tableKey, rowId: targetRow.id, rowData: payload }).unwrap();
				messageApi.success("Row updated successfully");
			}
			await refetchTables();
			setEditingRowKey(null);
		} catch (mutationError: any) {
			messageApi.error(getErrorMessage(mutationError, "Failed to update row"));
		} finally {
			setSavingRowKey(null);
		}
	};

	const handleCancelEdit = () => {
		setTableGroups(buildTableGroups(pdfTables));
		setEditingRowKey(null);
	};

	const handleAddRow = (tableKey: string) => {
		if (!canEditTable(tableKey)) return;

		const tempKey = `new-${Date.now()}`;

		setTableGroups((currentGroups) =>
			currentGroups.map((currentGroup) => {
				if (currentGroup.key !== tableKey) {
					return currentGroup;
				}

				const blankRow: EditableRow = {
					id: tempKey,
					__rowKey: tempKey,
					__isNew: true,
					rowIndex: 0,
				};

				currentGroup.columns.forEach((column) => {
					blankRow[column.key] = column.dataType === "number" ? "" : "";
				});

				return {
					...currentGroup,
					rows: [blankRow, ...currentGroup.rows.map((row, index) => ({ ...row, rowIndex: index + 1 }))],
				};
			}),
		);
		setEditingRowKey(tempKey);
	};

	const handleRowFieldChange = (
		tableKey: string,
		rowKey: string,
		column: PdfColumn,
		rawValue: string,
	) => {
		const nextValue =
			column.dataType === "number" ? (rawValue === "" ? "" : Number(rawValue)) : rawValue;

		setTableGroups((currentGroups) =>
			currentGroups.map((currentGroup) =>
				currentGroup.key !== tableKey
					? currentGroup
					: {
							...currentGroup,
							rows: currentGroup.rows.map((currentRow) =>
								currentRow.__rowKey === rowKey
									? { ...currentRow, [column.key]: nextValue }
									: currentRow,
							),
						},
			),
		);
	};

	const renderRowEditPanel = (group: EditableTableGroup, record: EditableRow) => (
		<div className="pdf-row-edit-panel">
			<div className="pdf-row-edit-grid">
				{group.columns.map((column, columnIndex) => (
					<div key={column.key} className="pdf-row-edit-field">
						<label htmlFor={`${record.__rowKey}-${column.key}`}>{column.title}</label>
						<Input
							id={`${record.__rowKey}-${column.key}`}
							type={column.dataType === "number" ? "number" : "text"}
							size="middle"
							value={record[column.key] ?? ""}
							autoFocus={columnIndex === 0}
							onChange={(event) =>
								handleRowFieldChange(group.key, record.__rowKey, column, event.target.value)
							}
						/>
					</div>
				))}
			</div>
			<div className="pdf-row-edit-actions">
				<Button
					variant="primary"
					icon={<SaveOutlined />}
					loading={savingRowKey === record.__rowKey || creatingRow || savingExtractedRow}
					onClick={() => void handleSaveRow(group.key, record.__rowKey)}
				>
					{record.__isNew ? 'Create row' : 'Save changes'}
				</Button>
				<Button variant="secondary" icon={<CloseOutlined />} onClick={handleCancelEdit}>
					Cancel
				</Button>
			</div>
		</div>
	);

	const handleDeleteRow = async (tableKey: string, rowKey: string) => {
		if (!pdf) return;

		const tableGroup = tableGroups.find((group) => group.key === tableKey);
		if (!tableGroup) return;
		if (!canEditTable(tableGroup.id)) return;

		const targetRow = tableGroup.rows.find((row) => row.__rowKey === rowKey);
		if (!targetRow) return;

		if (targetRow.__isNew) {
			setTableGroups((currentGroups) =>
				currentGroups.map((currentGroup) =>
					currentGroup.key !== tableKey
						? currentGroup
						: {
							...currentGroup,
							rows: currentGroup.rows.filter((row) => row.__rowKey !== rowKey),
						},
				),
			);
			setEditingRowKey(null);
			return;
		}

		setDeleteRowTarget({ tableId: tableKey, rowId: targetRow.id, rowKey });
	};

	const handleClearTable = (tableId: string) => {
		if (!canEditTable(tableId)) return;
		setClearTableTargetId(tableId);
	};

	const handleDeleteTable = (tableId: string) => {
		if (!canEditTable(tableId)) return;
		setDeleteTableTargetId(tableId);
	};

	const handleSelectTable = (tableId: string, rowKey?: string) => {
		if (!pdfId) return;

		router.push(`/pdf/${pdfId}?tableId=${tableId}`);
		setEditingRowKey(rowKey ?? null);
	};

	const handleDeletePdf = () => {
		if (!pdf) return;
		setDeletePdfOpen(true);
	};

	const hasStructuredData = tableGroups.length > 0;

	return (
		<StyledPdfDetailsPage className="mx-auto max-w-7xl px-6 py-6">
			{contextHolder}
			<div className="pdf-detail-layout">
				<div className="pdf-detail-topbar">
					<div>
						<p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">PDF Extraction</p>
						<h1 className="mt-2 text-3xl font-semibold text-slate-900">{pdf?.fileName ?? "Loading PDF..."}</h1>
					</div>
					<div className="pdf-detail-actions">
						<Button variant="secondary" icon={<ArrowLeftOutlined />} href="/pdf">
							Back to list
						</Button>
					</div>
				</div>

				<div className="pdf-detail-card">
					<div className="pdf-detail-header">
						<div className="flex items-center gap-3">
							<div className="pdf-detail-badge">
								<FilePdfOutlined className="text-xl text-rose-300" />
							</div>
							<div>
								<p className="pdf-detail-subtitle">Structured PDF data</p>
								<h2 className="pdf-detail-title">
									{tableGroupCount > 1 ? `${tableGroupCount} tables detected` : "Edit rows directly in the table"}
								</h2>
							</div>
						</div>

						<div className="pdf-detail-actions">
							<Button variant="danger" icon={<DeleteOutlined />} onClick={handleDeletePdf} disabled={!pdf}>
								Delete PDF
							</Button>
						</div>
					</div>

					<Modal
						open={Boolean(deleteRowTarget)}
						title="Delete row"
						okText="Delete"
						cancelText="Cancel"
						okButtonProps={{ danger: true, loading: deletingRowKey === deleteRowTarget?.rowKey }}
						onOk={async () => {
							if (!deleteRowTarget) return;
							setDeletingRowKey(deleteRowTarget.rowKey);
							try {
								await deletePdfTableRow({
									tableId: deleteRowTarget.tableId,
									rowId: deleteRowTarget.rowId,
								}).unwrap();
								await refetchTables();
								messageApi.success("Row deleted successfully");
								if (editingRowKey === deleteRowTarget.rowKey) {
									setEditingRowKey(null);
								}
								setDeleteRowTarget(null);
							} catch (mutationError: any) {
								messageApi.error(getErrorMessage(mutationError, "Failed to delete row"));
							} finally {
								setDeletingRowKey(null);
							}
						}}
						onCancel={() => setDeleteRowTarget(null)}
					/>

					<Modal
						open={Boolean(clearTableTargetId)}
						title="Clear extracted data"
						okText="Clear data"
						cancelText="Cancel"
						okButtonProps={{ danger: true }}
						onOk={async () => {
							if (!clearTableTargetId) return;
							try {
								await clearPdfTableRows(clearTableTargetId).unwrap();
								await refetchTables();
								messageApi.success("Table rows cleared successfully");
								setClearTableTargetId(null);
							} catch (mutationError: any) {
								messageApi.error(getErrorMessage(mutationError, "Failed to clear extracted data"));
							}
						}}
						onCancel={() => setClearTableTargetId(null)}
					/>

					<Modal
						open={Boolean(deleteTableTargetId)}
						title="Delete table"
						okText="Delete table"
						cancelText="Cancel"
						okButtonProps={{ danger: true }}
						onOk={async () => {
							if (!deleteTableTargetId) return;
							try {
								await deletePdfTable(deleteTableTargetId).unwrap();
								await refetchTables();
								messageApi.success("Table deleted successfully");
								setDeleteTableTargetId(null);
							} catch (mutationError: any) {
								messageApi.error(getErrorMessage(mutationError, "Failed to delete table"));
							}
						}}
						onCancel={() => setDeleteTableTargetId(null)}
					/>

					<Modal
						open={deletePdfOpen}
						title="Delete PDF"
						okText="Delete"
						cancelText="Cancel"
						okButtonProps={{ danger: true }}
						onOk={async () => {
							if (!pdf) return;
							try {
								const response = await deletePdf(pdf.id).unwrap();
								messageApi.success(response.message || "PDF deleted successfully");
								router.push("/pdf");
								setDeletePdfOpen(false);
							} catch (mutationError: any) {
								messageApi.error(getErrorMessage(mutationError, "Failed to delete PDF"));
							}
						}}
						onCancel={() => setDeletePdfOpen(false)}
					/>

					<div className="p-6">
						{isPageLoading ? (
							<div className="pdf-empty-state text-slate-500">
								Loading structured data...
							</div>
						) : hasStructuredData ? (
							<div className="pdf-multi-table-list">
								{tableGroups.map((group) => {
									const isSelectedTable = !selectedTableId || selectedTableId === group.id;
									const columns: any[] = group.columns.map((column) => ({
										title: column.title,
										dataIndex: column.key,
										key: column.key,
										ellipsis: true,
										align: column.dataType === "number" ? "right" : undefined,
										onHeaderCell: () => ({
											className: "whitespace-nowrap bg-slate-50 text-slate-700",
										}),
										render: (_value: unknown, record: EditableRow) => renderCell(record[column.key]),
									}));

									columns.push({
										title: "Actions",
										key: "actions",
										width: 180,
										onCell: () => ({
											className: "pdf-actions-cell",
										}),
										render: (_: unknown, record: EditableRow) => {
											const isEditing = editingRowKey === record.__rowKey;

											if (!isSelectedTable) {
												return (
													<Button
														variant="secondary"
														icon={<EditOutlined />}
														onClick={() => handleSelectTable(group.id, record.__rowKey)}
													>
														Edit
													</Button>
												);
											}

											return (
												<div className="pdf-row-actions">
													{isEditing ? (
														<span className="pdf-editing-badge">Editing</span>
													) : (
														<Button
															variant="secondary"
															icon={<EditOutlined />}
															onClick={() => setEditingRowKey(record.__rowKey)}
														>
															Edit
														</Button>
													)}

													<Button
														variant="danger"
														icon={<DeleteOutlined />}
														loading={deletingRowKey === record.__rowKey}
														onClick={() => void handleDeleteRow(group.key, record.__rowKey)}
													>
														Delete
													</Button>
												</div>
											);
										},
									});

									return (
										<section key={group.key} className="pdf-section-card pdf-table-group">
											<div className="pdf-section-header">
												<div>
													<h3 className="pdf-section-title">{group.title}</h3>
													<p className="pdf-section-copy">
														{group.rows.length} rows • {group.columns.length} columns
													</p>
												</div>
												{isSelectedTable ? (
													<div className="pdf-detail-actions">
														<Button variant="secondary" size="small" onClick={() => handleAddRow(group.key)}>
															Add row
														</Button>
														<Button variant="secondary" size="small" onClick={() => handleClearTable(group.id)}>
															Clear rows
														</Button>
														<Button variant="danger" size="small" onClick={() => handleDeleteTable(group.id)}>
															Delete table
														</Button>
													</div>
												) : (
													<Button
														variant="secondary"
														size="small"
														icon={<EditOutlined />}
														onClick={() => handleSelectTable(group.id)}
													>
														Edit table
													</Button>
												)}
											</div>
											<div className="p-6">
												<div className="pdf-table-shell">
													<Table
														columns={columns as any}
														dataSource={group.rows as any}
														rowKey="__rowKey"
														pagination={false}
														className="pdf-structured-table"
														rowClassName={(row: EditableRow) =>
															editingRowKey === row.__rowKey ? "pdf-editing-row" : ""
														}
														expandable={{
															showExpandColumn: false,
															expandedRowKeys: editingRowKey
																? group.rows.some((row) => row.__rowKey === editingRowKey)
																	? [editingRowKey]
																	: []
																: [],
															expandedRowRender: (record: EditableRow) =>
																editingRowKey === record.__rowKey
																	? renderRowEditPanel(group, record)
																	: null,
															rowExpandable: (record: EditableRow) => editingRowKey === record.__rowKey,
														}}
													/>
												</div>
											</div>
										</section>
									);
								})}
							</div>
						) : (
							<div className="pdf-empty-state">
								<div className="pdf-empty-state__icon">
									<FilePdfOutlined className="text-3xl text-slate-400" />
								</div>
								<h3 className="text-lg font-semibold text-slate-900">No structured data found</h3>
								<p className="mt-2 max-w-lg text-sm leading-6 text-slate-600">
									This PDF was extracted, but the backend did not return any structured rows or columns for display.
								</p>
							</div>
						)}
					</div>
				</div>

				<div className="pdf-section-card">
					<div className="pdf-section-header">
						<div>
							<h3 className="pdf-section-title">Raw extracted text</h3>
							<p className="pdf-section-copy">Expand to review the extracted OCR/text content in a scrollable panel.</p>
						</div>
					</div>
					<details className="pdf-text-toggle" open>
						<summary className="cursor-pointer list-none px-5 py-4 text-sm font-semibold text-slate-700">
							Show / hide extracted text
						</summary>
						<div className="pdf-text-panel">
							<pre className="pdf-text-content">{pdf?.extractedText ?? 'No raw text found'}</pre>
						</div>
					</details>
				</div>
			</div>
		</StyledPdfDetailsPage>
	);
};

export default PdfDetailsPage;
