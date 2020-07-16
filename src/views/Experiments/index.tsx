import React, { useState } from 'react';

import ExperimentForm from './ExperimentForm';

import Tag from '../../components/Tag';
import Error from '../../components/Error';

import { hashColor } from '../../utils/color';
import { Experiment, useExperimentsQuery } from '../../utils/generated';
import Table, { TableColumn } from '../../components/Table';

function renderTags(tags: string[]) {
  if (!tags) return null;
  return tags.map((tag) => (
    <Tag color={hashColor(tag)} key={tag}>
      {tag.toUpperCase()}
    </Tag>
  ));
}

function renderDate(initialDate: string) {
  const date = new Date(initialDate);
  return initialDate
    ? `${date.getDate()} / ${1 + date.getMonth()} / ${date.getFullYear()}`
    : '';
}

function stringSorter(key: 'codeId' | 'title') {
  return (a: Experiment, b: Experiment) => a[key].localeCompare(b[key]);
}

const columns: TableColumn<Experiment>[] = [
  {
    key: 'title',
    title: 'Title',
    sorter: stringSorter('title'),
  },
  {
    key: 'description',
    title: 'Description',
  },
  {
    key: 'owners',
    title: 'Owners',
    render: renderTags,
  },
  {
    key: 'tags',
    title: 'Tags',
    render: renderTags,
  },
  {
    key: 'creationDate',
    title: 'Creation date',
    render: renderDate,
  },
  {
    key: 'lastModificationDate',
    title: 'Last modification date',
    render: renderDate,
  },
  {
    key: 'status',
    title: 'Status',
    render: (value: Experiment['status']) => (value ? value[0].kind : null),
  },
];

const Experiments = (_: any) => {
  const { loading, error, data, refetch } = useExperimentsQuery({
    variables: { page: 0, filters: {} },
  });
  const [visible, setVisible] = useState(false);

  if (error) return <Error message={error.message} />;
  if (loading) return <span>Loading</span>;

  const closeModal = (reload: boolean) => {
    if (reload) refetch();
    setVisible(false);
  };
  return (
    <div>
      {visible ? <ExperimentForm closeModal={closeModal} /> : null}
      <header className="bg-white shadow">
        <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight text-gray-900">
            Experiments
          </h1>
          <button
            onClick={() => setVisible(true)}
            className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
          >
            Add new experiment
          </button>
        </div>
      </header>
      <main>
        <div className="py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <Table<Experiment> columns={columns} data={data?.experiments || []} />
        </div>
      </main>
    </div>
  );
};
export default Experiments;
