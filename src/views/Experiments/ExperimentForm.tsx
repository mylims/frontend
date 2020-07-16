import React from 'react';
import { useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

import ModalForm from '../../components/ModalForm';

interface Props {
  closeModal: (reload: boolean) => void;
}

interface ExperimentInput {
  owners: string[];
  tags: string[];
  title: string;
  description?: string;
  status: Array<{ kind: string; date: string }>;
}

const CREATE_EXPERIMENT = gql`
  mutation createExperiment($experiment: ExperimentInput!) {
    createExperiment(experiment: $experiment) {
      _id
      title
    }
  }
`;

const ExperimentForm = ({ closeModal }: Props) => {
  const [createExperiment, { loading, error }] = useMutation<ExperimentInput>(
    CREATE_EXPERIMENT,
  );

  const onCreate = (data: Record<string, any>) => {
    const experiment = {
      ...data,
      owners: ['me'],
      status: [{ kind: data.status, date: new Date().toString() }],
    };
    createExperiment({ variables: { experiment } });
    closeModal(true);
  };

  const required = (title: string) => [
    { required: true, message: `Please input the ${title}` },
  ];

  return (
    <ModalForm
      onSubmit={onCreate}
      onCancel={() => closeModal(false)}
      title="Experiment"
    >
      <p>test</p>
      {error && (
        <div style={{ color: '#c51244' }}>
          An error has ocurred, please try again
        </div>
      )}
    </ModalForm>
  );
};

export default ExperimentForm;
