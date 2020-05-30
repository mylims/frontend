import React from "react";
import { Form, Input, Select } from "antd";
import { Store } from "antd/lib/form/interface";

import ModalForm from "../../components/ModalForm";

const { Item } = Form;
const { Option } = Select;

interface Props {
  visible: boolean;
  closeModal: () => void;
}

interface ExperimentInput {
  owners: string[];
  tags: string[];
  title: string;
  description?: string;
  status: Array<{ kind: string; date: string }>;
}

const ExperimentForm = ({ visible, closeModal }: Props) => {
  const onCreate = (value: Store) => {
    console.log(value);
    closeModal();
  };

  const required = (title: string) => [
    { required: true, message: `Please input the ${title}` },
  ];

  return (
    <ModalForm
      name="experiment"
      visible={visible}
      onCreate={onCreate}
      onCancel={closeModal}
    >
      <Item name="title" label="Title" rules={required("title")}>
        <Input />
      </Item>
      <Item name="description" label="Description">
        <Input type="textarea" />
      </Item>
      <Item name="tags" label="Tags">
        <Select placeholder="Add a tag" mode="tags" defaultValue={[]} />
      </Item>
      <Item name="status" label="Status" rules={required("status")}>
        <Select placeholder="Select a status" allowClear>
          <Option value="active">active</Option>
          <Option value="inactive">inactive</Option>
        </Select>
      </Item>
    </ModalForm>
  );
};

export default ExperimentForm;
