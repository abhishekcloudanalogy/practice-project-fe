import Form from "@/components/common/Form";
import Input from "@/components/common/Input";

export default function PartnerFormFields() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Form.Item label="External ID" name="External id">
        <Input placeholder="Enter external id" />
      </Form.Item>
      <Form.Item
        label="Partner Name"
        name="partner Name"
        rules={[{ required: true, message: "Partner name is required" }]}
      >
        <Input placeholder="Enter partner name" />
      </Form.Item>
      <Form.Item label="Parent Partner" name="parent Partner">
        <Input placeholder="Enter parent partner" />
      </Form.Item>
      <Form.Item label="PM ID" name="PM Id">
        <Input placeholder="Enter PM ID" />
      </Form.Item>
      <Form.Item label="URL" name="URL">
        <Input placeholder="https://example.com" />
      </Form.Item>
      <Form.Item label="Email" name="Email">
        <Input placeholder="partner@example.com" />
      </Form.Item>
    </div>
  );
}
