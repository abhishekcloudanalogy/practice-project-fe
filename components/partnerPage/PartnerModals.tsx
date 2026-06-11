import Modal from "@/components/common/Modal";

import AddPartnerForm from "./AddPartnerForm";
import AddProgramForm from "./AddProgramForm";
import type { ModalType, ProgramFormValues } from "./types";
import type { PartnerRow } from "./PartnerTable";

type PartnerNameOption = {
  label: string;
  value: string;
};

type PartnerModalsProps = {
  modalType: ModalType;
  partnerNameOptions: PartnerNameOption[];
  onClose: () => void;
  onPartnerSubmit: (newPartner: PartnerRow) => void;
  onProgramSubmit: (values: ProgramFormValues) => void;
};

export default function PartnerModals({
  modalType,
  partnerNameOptions,
  onClose,
  onPartnerSubmit,
  onProgramSubmit,
}: PartnerModalsProps) {
  const isPartnerModalOpen = modalType === "partner";
  const isProgramModalOpen = modalType === "program";

  return (
    <Modal
      open={isPartnerModalOpen || isProgramModalOpen}
      onCancel={onClose}
      title={
        <span className="text-base font-semibold text-slate-900">
          {isPartnerModalOpen ? "Add Partner" : "Add Partner Program"}
        </span>
      }
      variant="compact"
      width={isProgramModalOpen ? "min(920px, 96vw)" : "min(760px, 96vw)"}
      destroyOnHidden
      footer={null}
    >
      {isPartnerModalOpen && <AddPartnerForm onSubmit={onPartnerSubmit} onCancel={onClose} />}
      {isProgramModalOpen && (
        <AddProgramForm
          partnerNameOptions={partnerNameOptions}
          onSubmit={onProgramSubmit}
          onCancel={onClose}
        />
      )}
    </Modal>
  );
}
