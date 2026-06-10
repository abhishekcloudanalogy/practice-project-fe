import { useEffect } from "react";

import Button from "@/components/common/Button";
import Drawer from "@/components/common/Drawer";
import Form from "@/components/common/Form";
import { PartnerRow } from "@/lib/api/auth.api";

import PartnerFormFields from "./PartnerFormFields";
import type { PartnerFormValues } from "./types";

type EditPartnerDrawerProps = {
  open: boolean;
  partner: PartnerRow | null;
  onClose: () => void;
  onSubmit: (values: PartnerFormValues) => void;
};

export default function EditPartnerDrawer({
  open,
  partner,
  onClose,
  onSubmit,
}: EditPartnerDrawerProps) {
  const [form] = Form.useForm<PartnerFormValues>();

  useEffect(() => {
    if (!open || !partner) return;

    form.setFieldsValue({
      "External id": partner["External id"],
      "partner Name": partner["partner Name"] ?? "",
      "parent Partner": partner["parent Partner"] ?? "",
      "PM Id": partner["PM Id"] ?? "",
      URL: partner.URL ?? "",
      Email: partner.Email ?? "",
    });
  }, [open, partner, form]);

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Drawer
      variant="sidebar"
      title={<span className="text-base font-semibold text-slate-900">Edit Partner</span>}
      placement="right"
      size={500}
      open={open}
      onClose={handleClose}
    >
      <Form<PartnerFormValues> form={form} layout="vertical" onFinish={onSubmit} className="mt-4">
        <PartnerFormFields />
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" htmlType="button" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" htmlType="submit">
            Update Partner
          </Button>
        </div>
      </Form>
    </Drawer>
  );
}
