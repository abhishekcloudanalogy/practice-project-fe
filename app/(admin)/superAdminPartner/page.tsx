"use client";

import { useEffect, useState } from "react";

import {
  EditPartnerDrawer,
  PartnerModals,
  PartnerStats,
  PartnerTable,
} from "@/components/partnerPage";
import type { ModalType, PartnerFormValues, ProgramFormValues } from "@/components/partnerPage";
import type { PartnerRow } from "@/components/partnerPage/PartnerTable";
import { getPartners } from "@/lib/api/partner.api";

export default function SuperAdminPartner() {
  const [partners, setPartners] = useState<PartnerRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [editingPartner, setEditingPartner] = useState<PartnerRow | null>(null);

  const isEditDrawerOpen = modalType === "edit-partner";

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        setLoading(true);
        const response = await getPartners();
        if (response?.success) {
          setPartners(response.data ?? []);
        }
      } catch (error) {
        console.error("Error fetching partners:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPartners();
  }, []);

  const partnerNameOptions = partners.map((partner) => ({
    label: partner.partnerName ?? "Unknown partner",
    value: partner.partnerName ?? "",
  }));

  const closeModal = () => {
    setModalType(null);
    setEditingPartner(null);
  };

  const handleEditClick = (record: PartnerRow) => {
    setEditingPartner(record);
    setModalType("edit-partner");
  };

  const handleDeleteClick = (record: PartnerRow) => {
    setPartners((prev) => prev.filter((p) => p.id !== record.id));
  };

  const handlePartnerSubmit = (newPartner: PartnerRow) => {
    setPartners((prev) => [newPartner, ...prev]);
    closeModal();
  };

  const handleEditPartnerSubmit = (values: PartnerFormValues) => {
    if (!editingPartner) return;
    setPartners((prev) =>
      prev.map((p) =>
        p.id === editingPartner.id
          ? { ...p, ...Object.fromEntries(Object.entries(values).filter(([, v]) => v !== undefined)) }
          : p
      ),
    );
    closeModal();
  };

  const handleProgramSubmit = (_values: ProgramFormValues) => {
    closeModal();
  };

  const openAddPartnerModal = () => setModalType("partner");

  const openAddProgramModal = () => setModalType("program");

  return (
    <div className="w-full space-y-6 px-2 sm:px-4 lg:px-6">
      <PartnerStats />

      <PartnerTable
      loading={loading}
        dataSource={partners}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        onAddPartner={openAddPartnerModal}
        onAddProgram={openAddProgramModal}
      />

      <PartnerModals
        modalType={modalType}
        partnerNameOptions={partnerNameOptions}
        onClose={closeModal}
        onPartnerSubmit={handlePartnerSubmit}
        onProgramSubmit={handleProgramSubmit}
      />

      <EditPartnerDrawer
        open={isEditDrawerOpen}
        partner={editingPartner}
        onClose={closeModal}
        onSubmit={handleEditPartnerSubmit}
      />
    </div>
  );
}
