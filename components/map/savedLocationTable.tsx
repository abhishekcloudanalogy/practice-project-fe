'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Modal, Select, message } from 'antd';
import Table from '@/components/common/Table';
import Button from "@/components/common/Button";
import {
  useGetSavedLocationsQuery,
  useShareLocationMutation,
  useGetUsersForSharingQuery,
  type SavedLocation,
} from '@/store/services/map/apiSlice';
import type { ColumnsType } from 'antd/es/table';
import { EyeOutlined } from '../common/antd/icons';

export default function SavedLocationTable() {
  const router = useRouter();
  const { data: locations = [], isLoading } = useGetSavedLocationsQuery();
  const { data: users = [] } = useGetUsersForSharingQuery();
  const [shareLocation] = useShareLocationMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>(undefined);
  const [sharing, setSharing] = useState(false);

  const openShareModal = (locationId: string) => {
    setSelectedLocationId(locationId);
    setSelectedUserId(undefined);
    setModalOpen(true);
  };

  const handleShare = async () => {
    if (!selectedLocationId || !selectedUserId) return;
    setSharing(true);
    try {
      await shareLocation({ locationId: selectedLocationId, sharedToId: selectedUserId }).unwrap();
      message.success('Location shared successfully!');
      setModalOpen(false);
    } catch {
      message.error('Failed to share location');
    } finally {
      setSharing(false);
    }
  };

  const myColumns: ColumnsType<SavedLocation> = [
    { title: '#', key: 'index', width: 50, render: (_: unknown, __: SavedLocation, i: number) => i + 1 },
    { title: 'Label', dataIndex: 'label', key: 'label', ellipsis: true, render: (v: string) => v || '—' },
    { title: 'Latitude', dataIndex: 'latitude', key: 'latitude', width: 110, render: (v: number) => v.toFixed(5) },
    { title: 'Longitude', dataIndex: 'longitude', key: 'longitude', width: 110, render: (v: number) => v.toFixed(5) },
    { title: 'Saved At', dataIndex: 'createdAt', key: 'createdAt', width: 160, render: (v: string) => new Date(v).toLocaleString() },
    {
      title: 'Options',
      key: 'options',
      width: 110,
      render: (_: unknown, record: SavedLocation) => (
        <div className="flex gap-2">
          <Button
            onClick={() => router.push(`/map?lat=${record.latitude}&lng=${record.longitude}&zoom=13`)}
            variant="eye-button"
            icon={<EyeOutlined />}
            aria-label="View on map"
          />
          <button
            onClick={() => openShareModal(record.id)}
            className="px-1py-1 text-sm cursor-pointer text-white border-none transition-colors"
          >
            🔗 Share
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="px-4 sm:px-6 pt-0 pb-6 space-y-3 m-5 ">
      <div className="flex justify-end">
        <Button
          variant="primary"
          onClick={() => router.push('/map/shared-with-me')}
        >
           Shared With Me
        </Button>
      </div>
      <div>
        <h2 className="text-lg sm:text-xl font-semibold mb-4">📍 Saved Locations</h2>
        <Table<SavedLocation>
          columns={myColumns}
          dataSource={locations}
          rowKey="id"
          loading={isLoading}
          pagination={{ pageSize: 10, size: 'small' }}
          scroll={{ x: 'max-content' }}
        />
      </div>

      <Modal
        title="Share Location"
        open={modalOpen}
        onOk={handleShare}
        onCancel={() => setModalOpen(false)}
        okText="Share"
        confirmLoading={sharing}
        okButtonProps={{ disabled: !selectedUserId }}
      >
        <p className="mb-3 text-sm text-gray-500">Select a user to share this location with:</p>
        <Select
          style={{ width: '100%' }}
          placeholder="Select user"
          value={selectedUserId}
          onChange={setSelectedUserId}
          showSearch
          optionFilterProp="label"
          options={users.map((u) => ({ value: u.id, label: `${u.name || ''} (${u.email})` }))}
        />
      </Modal>
    </div>
  );
}
