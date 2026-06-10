import Switch from "@/components/common/Switch";

export const partnerProgramColumns = [
  { title: "ID", dataIndex: "Id", key: "Id", width: 90 },
  { title: "Partner Program Name", dataIndex: "Partner Program Name", key: "Partner Program Name", width: 220 },
  { title: "Description", dataIndex: "Description", key: "Description", width: 260 },
  {
    title: "Verification Step",
    dataIndex: "Verification Step",
    key: "Verification Step",
    width: 170,
    render: (value: boolean) => <Switch variant="compact" defaultChecked={value} />,
  },
  { title: "Template", dataIndex: "Template", key: "Template", width: 130 },
  { title: "Login Template", dataIndex: "Login Template", key: "Login Template", width: 190 },
  { title: "Login Script", dataIndex: "Login Script", key: "Login Script", width: 170 },
];
