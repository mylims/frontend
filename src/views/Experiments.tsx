import React, { useState } from "react";
import { Table, Button, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { ColumnProps } from "antd/es/table";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

import { TableSearch, filterIcon, onFilter } from "../components/TableSearch";
import Tag from "../components/Tag";
import Error from "../components/Error";

import { hashColor } from "../utils";

export const EXPERIMENTS = gql`
  {
    experimentByOwner(owner: "me") {
      codeId
      owners
      tags
      title
      description
      creationDate
      lastModificationDate
      status {
        kind
      }
    }
  }
`;

interface Experiment {
  codeId: string;
  owners: string[];
  tags: string[];
  title: string;
  description?: string;
  creationDate: string;
  lastModificationDate?: string;
  status?: { kind: string };
}

interface ExperimentsData {
  experimentByOwner: Experiment[];
}

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
    ? `${date.getDate()}/${1 + date.getMonth()}/${date.getFullYear()}`
    : "";
}

function stringSorter(key: "codeId" | "title") {
  return (a: Experiment, b: Experiment) => a[key].localeCompare(b[key]);
}

const columns: ColumnProps<Experiment>[] = [
  {
    key: "codeId",
    title: "Identifier",
    dataIndex: "codeId",
    sorter: stringSorter("codeId"),
    sortDirections: ["descend", "ascend"],
    filterDropdown: (props) => <TableSearch {...props} dataIndex="codeId" />,
    filterIcon,
    onFilter: (value, record) => onFilter<Experiment>(value, record, "codeId"),
  },
  {
    key: "owners",
    title: "Owners",
    dataIndex: "owners",
    render: renderTags,
  },
  {
    key: "tags",
    title: "Tags",
    dataIndex: "tags",
    render: renderTags,
  },
  {
    key: "title",
    title: "Title",
    dataIndex: "title",
    sorter: stringSorter("title"),
    sortDirections: ["descend", "ascend"],
    filterDropdown: (props) => <TableSearch {...props} dataIndex="title" />,
    filterIcon,
    onFilter: (value, record) => onFilter<Experiment>(value, record, "title"),
  },
  {
    key: "description",
    title: "Description",
    dataIndex: "description",
    filterDropdown: (props) => (
      <TableSearch {...props} dataIndex="description" />
    ),
    filterIcon,
    onFilter: (value, record) =>
      onFilter<Experiment>(value, record, "description"),
  },
  {
    key: "creationDate",
    title: "Creation date",
    dataIndex: "creationDate",
    render: renderDate,
  },
  {
    key: "lastModificationDate",
    title: "Last modification date",
    dataIndex: "lastModificationDate",
    render: renderDate,
  },
  {
    key: "status",
    title: "Status",
    dataIndex: "status",
    render: (value) => (value ? value[0].kind : null),
  },
];

const Experiments = (props: any) => {
  const { loading, error, data } = useQuery<ExperimentsData>(EXPERIMENTS);
  const [modal, setModal] = useState(false);

  if (error) return <Error message={error.message} />;
  const dataSource = data ? data.experimentByOwner : [];

  return (
    <div className="experiments">
      <Modal
        title="Basic Modal"
        visible={modal}
        onOk={() => setModal(false)}
        onCancel={() => setModal(false)}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
      <div className="experiments__header">
        <h2>Experiments</h2>
        <Button onClick={() => setModal(true)}>
          <PlusOutlined />
          Add new experiment
        </Button>
      </div>
      <Table<Experiment>
        columns={columns}
        dataSource={dataSource}
        loading={loading}
      />
    </div>
  );
};
export default Experiments;
