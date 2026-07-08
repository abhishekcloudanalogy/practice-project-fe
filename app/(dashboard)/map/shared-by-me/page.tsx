'use client';
import { useRouter } from 'next/navigation';
import Table from '@/components/common/Table';
import Button from '@/components/common/Button';
import { useGetSharedByMeQuery, type SharedByMeItem } from '@/store/services/map/apiSlice';
import type { ColumnsType } from 'antd/es/table';
import { EyeOutlined } from '@/components/common/antd/icons';

export default function SharedByMePage() {
  const router = useRouter();
  const { data: sharedByMe = [], isLoading } = useGetSharedByMeQuery();

  const columns: ColumnsType<SharedByMeItem> = [
    { title: '#', key: 'index', width: 50, render: (_: unknown, __: SharedByMeItem, i: number) => i + 1 },
    { title: 'Label', key: 'label', ellipsis: true, render: (_: unknown, r: SharedByMeItem) => r.location.label || '—' },
    { title: 'Latitude', key: 'latitude', width: 110, render: (_: unknown, r: SharedByMeItem) => r.location.latitude.toFixed(5) },
    { title: 'Longitude', key: 'longitude', width: 110, render: (_: unknown, r: SharedByMeItem) => r.location.longitude.toFixed(5) },
    { title: 'Shared To', key: 'sharedTo', width: 140, ellipsis: true, render: (_: unknown, r: SharedByMeItem) => r.sharedTo.name || r.sharedTo.email },
    { title: 'Shared At', dataIndex: 'createdAt', key: 'createdAt', width: 160, render: (v: string) => new Date(v).toLocaleString() },
    {
      title: 'Options',
      key: 'options',
      width: 80,
      render: (_: unknown, r: SharedByMeItem) => (
        <Button
          onClick={() => router.push(`/map?lat=${r.location.latitude}&lng=${r.location.longitude}&zoom=13`)}
          variant="eye-button"
          icon={<EyeOutlined />}
          aria-label="View on map"
        />
      ),
    },
  ];

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-xl font-semibold">📤 Shared By Me</h2>
        <button
          onClick={() => router.back()}
          className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded cursor-pointer border border-gray-300"
        >
          ← Back
        </button>
      </div>
      <Table<SharedByMeItem>
        columns={columns}
        dataSource={sharedByMe}
        rowKey="id"
        loading={isLoading}
        pagination={{ pageSize: 10, size: 'small' }}
        scroll={{ x: 'max-content' }}
      />
    </div>
  );
}
