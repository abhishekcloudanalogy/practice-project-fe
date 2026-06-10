import { LuPencil, LuTrash2 } from "react-icons/lu";

import Button from "@/components/common/Button";
import Table from "@/components/common/Table";
import { PartnerRow } from "@/lib/api/auth.api";

import { expandedDataSource } from "./data";
import { partnerProgramColumns } from "./partnerProgramColumns";
import type { PartnerProgramRow } from "./types";

type PartnerTableProps = {
  dataSource: PartnerRow[];
  onEdit: (record: PartnerRow) => void;
  onDelete: (record: PartnerRow) => void;
  onAddPartner: () => void;
  onAddProgram: () => void;
};

export default function PartnerTable({
  dataSource,
  onEdit,
  onDelete,
  onAddPartner,
  onAddProgram,
}: PartnerTableProps) {
  const partnerColumns = [
    { title: "ID", dataIndex: "Id", key: "Id", width: 90 },
    {
      title: "External ID",
      dataIndex: "External id",
      key: "External id",
      width: 150,
      render: (value: number | null) => value ?? "-",
    },
    {
      title: "Partner Name",
      dataIndex: "partner Name",
      key: "partner Name",
      width: 170,
      render: (value: string | null) => value ?? "-",
    },
    {
      title: "Parent Partner",
      dataIndex: "parent Partner",
      key: "parent Partner",
      width: 180,
      render: (value: string | null) => value ?? "-",
    },
    {
      title: "PM ID",
      dataIndex: "PM Id",
      key: "PM Id",
      width: 150,
      render: (value: string | null) => value ?? "-",
    },
    {
      title: "URL",
      dataIndex: "URL",
      key: "URL",
      width: 170,
      render: (value: string | null) =>
        value ? (
          <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            Open
          </a>
        ) : (
          "-"
        ),
    },
    {
      title: "Email",
      dataIndex: "Email",
      key: "Email",
      width: 210,
      render: (value: string | null) => value ?? "-",
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_: unknown, record: PartnerRow) => (
        <div className="flex items-center gap-2">
          <Button variant="soft" aria-label="Edit partner" onClick={() => onEdit(record)}>
            <LuPencil size={16} />
          </Button>
          <Button variant="soft" aria-label="Delete partner" onClick={() => onDelete(record)}>
            <LuTrash2 size={16} className="text-red-600" />
          </Button>
        </div>
      ),
    },
  ];

  const columns = [Table.EXPAND_COLUMN, ...partnerColumns];

  return (
    <section className="mt-6">
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-semibold text-slate-900">All Partners</h2>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={onAddPartner}>
            Add Partner
          </Button>
          <Button variant="secondary" onClick={onAddProgram}>
            Add Partner Program
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="w-full overflow-x-auto">
          <Table<PartnerRow>
            columns={columns}
            dataSource={dataSource}
            rowKey="Id"
            loading={false}
            pagination={{ pageSize: 5, showSizeChanger: true, size: "small" }}
            scroll={{ x: 1200 }}
            size="small"
            expandable={{
              expandIcon: ({ expanded, onExpand, record }) => (
                <Button
                  variant="soft"
                  shape="circle"
                  htmlType="button"
                  onClick={(event) => onExpand(record, event)}
                  aria-label={expanded ? "Collapse row" : "Expand row"}
                >
                  {expanded ? "−" : "+"}
                </Button>
              ),
              expandedRowRender: (record) => (
                <div className="bg-[#f8fbff] px-4 py-4 sm:px-5">
                  <Table<PartnerProgramRow>
                    variant="compact"
                    columns={partnerProgramColumns}
                    dataSource={expandedDataSource[record.Id] ?? []}
                    rowKey="Id"
                    loading={false}
                    pagination={false}
                    size="small"
                    scroll={{ x: 1100 }}
                  />
                </div>
              ),
            }}
          />
        </div>
      </div>
    </section>
  );
}
