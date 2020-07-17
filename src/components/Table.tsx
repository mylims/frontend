import React from 'react';
import Paginator from './Paginator';

export interface TableColumn<T> {
  key: keyof T;
  title: string;
  render?: (value: any) => React.ReactNode;
  sorter?: any;
}

export interface TableProps<T> {
  data: Partial<T>[];
  columns: TableColumn<T>[];
}

export default function Table<T>({ data, columns }: TableProps<T>) {
  const content = data.map((value, index) => (
    <tr key={`row_${index}`}>
      {columns.map(({ key, render }) => (
        <td
          key={key as string}
          className="px-6 py-4 whitespace-no-wrap border-b border-gray-200"
        >
          {render ? render(value[key]) : value[key]}
        </td>
      ))}
    </tr>
  ));
  return (
    <div className="flex flex-col">
      <div className="py-2 -my-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="inline-block min-w-full overflow-hidden align-middle border-b border-gray-200 shadow sm:rounded-lg">
          <table className="min-w-full">
            <thead>
              <tr>
                {columns.map(({ title }) => (
                  <th
                    className="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-800 uppercase border-b border-gray-200 bg-gray-50"
                    key={title}
                  >
                    {title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white">{content}</tbody>
          </table>
          {data.length > 0 ? (
            <Paginator page={0} step={10} total={20} />
          ) : (
            <div className="flex justify-center">
              <span className="p-6 text-gray-600">Empty table</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
