"use client";

import { useState } from "react";
import { message } from "antd";
import { isAxiosError } from "axios";

import Button from "@/components/common/Button";
import Form from "@/components/common/Form";
import { addPartnerSchema } from "@/lib/validations/partner.schema";
import { addpartner } from "@/lib/api/partner.api";

import PartnerFormFields from "./PartnerFormFields";
import type { PartnerFormValues } from "./types";
import type { PartnerRow } from "./PartnerTable";

type AddPartnerFormProps = {
  onSubmit: (newPartner: PartnerRow) => void;
  onCancel: () => void;
};

export default function AddPartnerForm({ onSubmit, onCancel }: AddPartnerFormProps) {
  const [form] = Form.useForm<PartnerFormValues>();
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (values: PartnerFormValues) => {
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

    try {
      setLoading(true);
      const response = await addpartner(result.data);
      message.success("Partner created successfully");
      form.resetFields();
      onSubmit(response.data);
    } catch (error) {
      if (isAxiosError(error)) {
        message.error(error.response?.data?.message || "Request failed");
      } else {
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form<PartnerFormValues>
      form={form}
      layout="vertical"
      onFinish={onSubmitHandler}
      initialValues={{
        externalId: null,
        partnerName: "",
        parentPartner: null,
        pmId: null,
        url: null,
        email: null,
      }}
      className="mt-4"
    >
      <PartnerFormFields />

      <div className="mt-6 flex justify-end gap-3">
        <Button variant="secondary" htmlType="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" loading={loading} htmlType="submit">
          Save Partner
        </Button>
      </div>
    </Form>
  );
}
