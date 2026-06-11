import { useEffect } from "react";

import Button from "@/components/common/Button";
import Drawer from "@/components/common/Drawer";
import Form from "@/components/common/Form";
import { addPartnerSchema } from "@/lib/validations/partner.schema";
import type { PartnerRow } from "./PartnerTable";

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
      externalId: partner.externalId,
      partnerName: partner.partnerName ?? "",
      parentPartner: partner.parentPartner ?? "",
      pmId: partner.pmId ?? "",
      url: partner.url ?? "",
      email: partner.email ?? "",
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
      <Form<PartnerFormValues>
      form={form}
      layout="vertical"
      onFinish={(values) => {
        const result = addPartnerSchema.safeParse(values);
        if (!result.success) {
          form.setFields(
            result.error.issues.map((issue) => ({
              name: issue.path[0] as keyof PartnerFormValues,
              errors: [issue.message],
            }))
          );
          return;
        }
        onSubmit(result.data);
      }}
      className="mt-4"
    >
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
