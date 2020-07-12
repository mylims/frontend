import React, { useState } from "react";
import { Table, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { ColumnProps } from "antd/es/table";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

import SampleForm from "./SampleForm";

import {
  TableSearch,
  filterIcon,
  onFilter,
} from "../../components/TableSearch";
import Tag from "../../components/Tag";
import Error from "../../components/Error";

import { hashColor } from "../../utils";

export const SAMPLES = gql`
  {
    sampleByOwner(owner: "me") {
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

interface Sample {
  codeId: string;
  owners: string[];
  tags: string[];
  title: string;
  description?: string;
  creationDate: string;
  lastModificationDate?: string;
  status?: { kind: string };
}

interface SamplesData {
  sampleByOwner: Sample[];
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
    ? `${date.getDate()} / ${1 + date.getMonth()} / ${date.getFullYear()}`
    : "";
}

function stringSorter(key: "codeId" | "title") {
  return (a: Sample, b: Sample) => a[key].localeCompare(b[key]);
}

const columns: ColumnProps<Sample>[] = [
  {
    key: "title",
    title: "Title",
    dataIndex: "title",
    sorter: stringSorter("title"),
    sortDirections: ["descend", "ascend"],
    filterDropdown: (props) => <TableSearch {...props} dataIndex="title" />,
    filterIcon,
    onFilter: (value, record) => onFilter<Sample>(value, record, "title"),
  },
  {
    key: "description",
    title: "Description",
    dataIndex: "description",
    filterDropdown: (props) => (
      <TableSearch {...props} dataIndex="description" />
    ),
    filterIcon,
    onFilter: (value, record) => onFilter<Sample>(value, record, "description"),
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

const Samples = (props: any) => {
  const { loading, error, data, refetch } = useQuery<SamplesData>(SAMPLES);
  const [visible, setVisible] = useState(false);

  if (error) return <Error message={error.message} />;
  const dataSource = data ? data.sampleByOwner : [];

  const closeModal = (reload: boolean) => {
    if (reload) {
      refetch();
    }
    setVisible(false);
  };

  return (
    <div className="samples">
      <SampleForm visible={visible} closeModal={closeModal} />
      <div className="samples__header">
        <h2>Samples</h2>
        <Button onClick={() => setVisible(true)}>
          <PlusOutlined />
          Add new sample
        </Button>
      </div>
      <Table<Sample>
        columns={columns}
        dataSource={dataSource}
        loading={loading}
      />
    </div>
  );
};
export default Samples;
