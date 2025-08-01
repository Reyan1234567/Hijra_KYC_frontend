import { Divider, Flex } from "antd";
import { allTableDataType } from "../../MakeForm/MakeFormTable";

const BackReason = (modal: allTableDataType) => {
  return (
    <>
      {modal.backReason && (
        <>
          <Divider />
          <Flex vertical justify="center" align="center">
            <p>
              <strong>Rejection Reason</strong>
            </p>
            <p>{modal.backReason}</p>
          </Flex>
        </>
      )}
    </>
  );
};

export default BackReason;
