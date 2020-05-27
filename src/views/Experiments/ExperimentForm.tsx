import React, { useReducer, useState } from "react";
import { Modal, Input } from "antd";

interface ExperimentInput {
  owners?: string[];
  tags?: string[];
  title: string;
  description?: string;
  status?: string;
}

interface Field {
  title: string;
  required: boolean;
  key: keyof ExperimentInput;
}

interface Props {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

const ExperimentForm = ({ visible, setVisible }: Props) => {
  const initialState: ExperimentInput = {
    owners: [],
    tags: [],
    title: "",
    description: undefined,
    status: undefined,
  };
  const [state, setState] = useState(initialState);

  const handleOk = () => setVisible(false);
  const handleCancel = () => setVisible(false);
  const onChange = (key: keyof ExperimentInput, value: string) => {
    setState((previous) => ({ ...previous, [key]: value }));
  };

  const fields: Field[] = [
    { title: "Title", required: true, key: "title" },
    { title: "Description", required: true, key: "description" },
    { title: "Status", required: false, key: "status" },
  ];

  return (
    <Modal
      title="Basic Modal"
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      {fields.map(({ title, key }) => (
        <Input
          key={key}
          placeholder={title}
          value={state[key]}
          onChange={(e) => onChange(key, e.currentTarget.value)}
        />
      ))}
    </Modal>
  );
};

export default ExperimentForm;
