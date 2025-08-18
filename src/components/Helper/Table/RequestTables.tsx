import { Flex, Table, TableColumnsType, Tag } from "antd";
import { allTableDataType } from "../../MakeForm/AllMakeFormTable";
import { ExtractDate } from "../../../services/DisplayFunctions";

interface dataSource {
  data: allTableDataType[];
  colums?: TableColumnsType<allTableDataType>;
  pageSize: number;
  pageNumber: number;
  total: number;
  onChange: (pageNo: number, pageSi: number) => void;
  // onSizeChange: (current:number, size:number)=>void;
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
      columns={
        dataSource.colums ? [...columns, ...dataSource.colums] : [...columns]
      }
      dataSource={dataSource.data}
      pagination={{
        showSizeChanger: true,
        current: dataSource.pageNumber,
        pageSize: dataSource.pageSize,
        total: dataSource.total,
        onChange: (page: number, pageSize: number) => {
          dataSource.onChange(page, pageSize);
        },
        // onShowSizeChange:(current:number, size:number)=>{
        //   dataSource.onSizeChange(size, current)
        // }
      }}
    />
  );
};

export default RequestTables;
