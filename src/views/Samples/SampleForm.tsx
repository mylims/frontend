import React from "react";
import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { Form, Input, Select } from "antd";
import { Store } from "antd/lib/form/interface";

import ModalForm from "../../components/ModalForm";

const { Item } = Form;
const { Option } = Select;

interface Props {
  visible: boolean;
  closeModal: (reload: boolean) => void;
}

interface SampleInput {
  owners: string[];
  tags: string[];
  title: string;
  description?: string;
  status: Array<{ kind: string; date: string }>;
}

const CREATE_SAMPLE = gql`
  mutation createSample($sample: SampleInput!) {
    createSample(sample: $sample) {
      _id
      title
    }
  }
`;

const SampleForm = ({ visible, closeModal }: Props) => {
  const [createSample, { loading, error }] = useMutation<SampleInput>(
    CREATE_SAMPLE
  );

  const onCreate = (data: Store) => {
    const sample = {
      ...data,
      owners: ["me"],
      status: [{ kind: data.status, date: new Date().toString() }],
    };
    createSample({ variables: { sample } });
    closeModal(true);
  };

  const required = (title: string) => [
    { required: true, message: `Please input the ${title}` },
  ];

  return (
    <ModalForm
      name="sample"
      visible={visible}
      onCreate={onCreate}
      onCancel={() => closeModal(false)}
      loading={loading}
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
      {error && (
        <div style={{ color: "#c51244" }}>
          An error has ocurred, please try again
        </div>
      )}
    </ModalForm>
  );
};

export default SampleForm;
