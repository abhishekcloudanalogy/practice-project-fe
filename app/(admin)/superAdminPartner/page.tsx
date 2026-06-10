"use client";

import { useMemo, useState } from "react";

import {
  EditPartnerDrawer,
  PartnerModals,
  PartnerStats,
  PartnerTable,
  initialData,
} from "@/components/partnerPage";
import type { ModalType, PartnerFormValues, ProgramFormValues } from "@/components/partnerPage";
import { PartnerRow } from "@/lib/api/auth.api";

export default function SuperAdminPartner() {
  const [dataSource, setDataSource] = useState<PartnerRow[]>(initialData);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [programVerification, setProgramVerification] = useState(true);
  const [editingPartner, setEditingPartner] = useState<PartnerRow | null>(null);

  const isEditDrawerOpen = modalType === "edit-partner";

  const partnerNameOptions = useMemo(
    () =>
      dataSource.map((partner) => ({
        label: partner["partner Name"] ?? "Unknown partner",
        value: partner["partner Name"] ?? "",
      })),
    [dataSource],
  );

  const closeModal = () => {
    setModalType(null);
    setEditingPartner(null);
    setProgramVerification(true);
  };

  const handleEditClick = (record: PartnerRow) => {
    setEditingPartner(record);
    setModalType("edit-partner");
  };

  const handleDeleteClick = (record: PartnerRow) => {
    setDataSource((prev) => prev.filter((p) => p.Id !== record.Id));
  };

  const handlePartnerSubmit = (values: PartnerFormValues) => {
    console.log("Partner form submit", values);
    closeModal();
  };

  const handleEditPartnerSubmit = (values: PartnerFormValues) => {
    if (!editingPartner) return;
    setDataSource((prev) =>
      prev.map((p) => (p.Id === editingPartner.Id ? { ...p, ...values } : p)),
    );
    closeModal();
  };

  const handleProgramSubmit = (values: ProgramFormValues) => {
    console.log("Program form submit", { ...values, "Verification Step": programVerification });
    closeModal();
  };

  const openAddPartnerModal = () => setModalType("partner");

  const openAddProgramModal = () => {
    setProgramVerification(true);
    setModalType("program");
  };

  return (
    <div className="w-full space-y-6 px-2 sm:px-4 lg:px-6">
      <PartnerStats />

      <PartnerTable
        dataSource={dataSource}
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
