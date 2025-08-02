import { Divider, Flex, Input, Image } from "antd";
import { allTableDataType } from "../../MakeForm/MakeFormTable";
import MakeInfo from "./MakeInfo";
import BackReason from "./BackReason";

const DisplayInfo = (modal: allTableDataType) => (
  <Flex vertical gap={"middle"}>
    <MakeInfo {...modal} />
    <Divider />
    <Flex vertical align="center" gap={"middle"}>
      <p>
        <strong>Images</strong>
      </p>
      <Flex gap={"large"} wrap justify="center" align="center">
        {modal.images.length !== 0 ? (
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
                  <Image width={200} src={image.url} />
                  <Input disabled value={image.description} />
                </Flex>
              </Flex>
            );
          })
        ) : (
          <p>No images are found</p>
        )}
        <BackReason {...modal} />
      </Flex>
    </Flex>
  </Flex>
);

export default DisplayInfo;
