import React from 'react';
import * as Yup from 'yup';

import ModalForm from '../../components/ModalForm';
import { FormInput } from '../../components/FormInput';
import { useCreateExperimentMutation } from '../../utils/generated';

interface Props {
  closeModal: (reload: boolean) => void;
}

interface ExperimentInput {
  owners: string[];
  tags: string[];
  title: string;
  description?: string;
  status: string;
}

const ExperimentForm = ({ closeModal }: Props) => {
  const [createExperiment] = useCreateExperimentMutation();

  const onCreate = (data: ExperimentInput) => {
    const experiment = {
      ...data,
      owners: ['me'],
      status: { kind: data.status, date: new Date().toString() },
    };
    createExperiment({ variables: { experiment } });
    closeModal(true);
  };

  return (
    <ModalForm
      initialValues={{ firstName: '', lastName: '', email: '' }}
      validationSchema={Yup.object({
        firstName: Yup.string()
          .max(15, 'Must be 15 characters or less')
          .required('Required'),
        lastName: Yup.string()
          .max(20, 'Must be 20 characters or less')
          .required('Required'),
        email: Yup.string().email('Invalid email address').required('Required'),
      })}
      onSubmit={onCreate}
      onCancel={() => closeModal(false)}
      title="Create experiment"
    >
      <FormInput label="First name" name="firstName" />
      <FormInput label="Last name" name="lastName" />
      <FormInput label="Email Address" name="email" type="email" />
    </ModalForm>
  );
};

export default ExperimentForm;
