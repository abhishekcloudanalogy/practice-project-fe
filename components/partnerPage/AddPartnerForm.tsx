import Button from "@/components/common/Button";
import Form from "@/components/common/Form";

import type { PartnerFormValues } from "./types";
import PartnerFormFields from "./PartnerFormFields";

type AddPartnerFormProps = {
  onSubmit: (values: PartnerFormValues) => void;
  onCancel: () => void;
};

export default function AddPartnerForm({ onSubmit, onCancel }: AddPartnerFormProps) {
  return (
    <Form<PartnerFormValues>
      layout="vertical"
      onFinish={onSubmit}
      initialValues={{
        "External id": null,
        "partner Name": "",
        "parent Partner": "",
        "PM Id": "",
        URL: "",
        Email: "",
      }}
      className="mt-4"
    >
      <PartnerFormFields />
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="secondary" htmlType="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" htmlType="submit">
          Save Partner
        </Button>
      </div>
    </Form>
  );
}
