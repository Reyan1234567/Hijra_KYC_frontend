import { Divider, Flex, Input, Image } from "antd";
import { allTableDataType } from "./MakeFormTable";
import MakeInfo from "./MakeInfo";

const DisplayInfo = (modal: allTableDataType) => (
  <Flex vertical gap={"middle"}>
    <MakeInfo {...modal}/>
    <Divider />
    <Flex vertical align="center" gap={"middle"}>
      <p>
        <strong>Images</strong>
      </p>
      <Flex gap={"large"} wrap justify="center" align="center">
        {modal.images ? (
          modal.images.map((image) => {
            return (
              <Flex
                style={{
                  border: "1px solid #d9d9d9",
                  borderRadius: "5px",
                }}
              >
                <Flex
                  vertical
                  gap={"middle"}
                  align="center"
                  style={{ position: "relative" }}
                >
                  <Image width={200} src={image.name} />
                  <Input value={image.description} />
                </Flex>
              </Flex>
            );
          })
        ) : (
          <p>No images are found</p>
        )}
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
      </Flex>
    </Flex>
  </Flex>
);

export default DisplayInfo;
