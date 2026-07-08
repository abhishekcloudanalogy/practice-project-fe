'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import Table from '@/components/common/Table';
import Button from "@/components/common/Button";
import { useGetSavedLocationsQuery, type SavedLocation } from '@/store/services/map/apiSlice';
import type { ColumnsType } from 'antd/es/table';
import { EyeOutlined } from '../common/antd/icons';

export default function SavedLocationTable() {
  const router = useRouter();
  const { data: locations = [], isLoading } = useGetSavedLocationsQuery();

  const copyShareLink = (token: string) => {
    const url = `${window.location.origin}/map/share/${token}`;
    navigator.clipboard.writeText(url).then(() => alert('🔗 Share link copied!'));
  };

  const columns: ColumnsType<SavedLocation> = [
    {
      title: '#',
      key: 'index',
      width: 50,
      render: (_: unknown, __: SavedLocation, i: number) => i + 1,
    },
    {
      title: 'Label',
      dataIndex: 'label',
      key: 'label',
      render: (label: string) => label || '—',
    },
    {
      title: 'Latitude',
      dataIndex: 'latitude',
      key: 'latitude',
      render: (v: number) => v.toFixed(5),
    },
    {
      title: 'Longitude',
      dataIndex: 'longitude',
      key: 'longitude',
      render: (v: number) => v.toFixed(5),
    },
    {
      title: 'Saved At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (v: string) => new Date(v).toLocaleString(),
    },
    {
      title: 'Options',
      key: 'options',
      render: (_: unknown, record: SavedLocation) => (
        <div className="flex gap-2">
           <Button
             onClick={() => router.push(`/map?lat=${record.latitude}&lng=${record.longitude}&zoom=13`)}
                          variant="eye-button"
                          icon={<EyeOutlined />}
                          aria-label="View contact information"
                         
                        />
          <button
            onClick={() => copyShareLink(record.shareToken)}
            className="px-3 py-1 text-xs cursor-pointer bg-green-500 hover:bg-green-600 text-white border-none rounded transition-colors"
          >
            🔗 Share
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">📍 Saved Locations</h2>
      <Table<SavedLocation>
        columns={columns}
        dataSource={locations}
        rowKey="id"
        loading={isLoading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
}
