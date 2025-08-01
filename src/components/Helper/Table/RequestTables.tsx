import { Flex, Table, TableColumnsType, Tag } from "antd";
import { allTableDataType } from "../../MakeForm/MakeFormTable";
import { ExtractDate } from "../../../services/DisplayFunctions";

interface dataSource {
  data: allTableDataType[];
  colums?: TableColumnsType<allTableDataType>;
}

const RequestTables = (dataSource: dataSource) => {
  const columns: TableColumnsType<allTableDataType> = [
    { title: "Cif", dataIndex: "cif" },
    { title: "Customer Account", dataIndex: "customerAccount" },
    { title: "Customer Name", dataIndex: "customerName" },
    { title: "Customer Phone", dataIndex: "customerPhone" },
    {
      title: "Made At",
      dataIndex: "madeAt",
      render: (madeAt) => <Flex justify="center">{ExtractDate(madeAt)}</Flex>,
    },
    {
      title: "Checked At",
      dataIndex: "checkedAt",
      render: (checkedAt) => (
        <Flex justify="center">{ExtractDate(checkedAt)}</Flex>
      ),
    },
    {
      title: "Checker Name",
      dataIndex: "hoName",
      render: (hoName) =>
        hoName === null || hoName === " " ? (
          <Flex justify="center" align="center">
            ---------
          </Flex>
        ) : (
          hoName
        ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: number) =>
        status === 0 ? (
          <Tag color="yellow">In Drafts</Tag>
        ) : status === 1 ? (
          <Tag color="blue">Pending</Tag>
        ) : status === 2 ? (
          <Tag color="green">Accepted</Tag>
        ) : (
          <Tag color="red">Rejected</Tag>
        ),
    },
  ];

  return (
    <Table<allTableDataType>
      columns={dataSource.colums?[...columns, ...dataSource.colums]:[...columns]}
      dataSource={dataSource.data}
      pagination={{
        showSizeChanger: true,
        pageSizeOptions: ["5", "10", "20", "50", "100", "200"],
      }}
    />
  );
};

export default RequestTables;
