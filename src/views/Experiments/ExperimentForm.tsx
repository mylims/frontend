import React from "react";
import { Form, Input, Radio } from "antd";
import { Store } from "antd/lib/form/interface";

import ModalForm from "../../components/ModalForm";

const { Item } = Form;

interface Props {
  visible: boolean;
  closeModal: () => void;
}

const ExperimentForm = ({ visible, closeModal }: Props) => {
  const onCreate = (value: Store) => {
    console.log(value);
    closeModal();
  };
  return (
    <ModalForm
      name="experiment"
      visible={visible}
      onCreate={onCreate}
      onCancel={closeModal}
    >
      <Item
        name="title"
        label="Title"
        rules={[
          {
            required: true,
            message: "Please input the title of collection!",
          },
        ]}
      >
        <Input />
      </Item>
      <Item name="description" label="Description">
        <Input type="textarea" />
      </Item>
      <Item name="modifier" className="collection-create-form_last-form-item">
        <Radio.Group>
          <Radio value="public">Public</Radio>
          <Radio value="private">Private</Radio>
        </Radio.Group>
      </Item>
    </ModalForm>
  );
};

export default ExperimentForm;
