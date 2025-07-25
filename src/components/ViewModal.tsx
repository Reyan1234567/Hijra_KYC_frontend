import { Flex, Input, Modal, Image } from 'antd';
import DisplayInfo from './DisplayInfo';
import { allTableDataType } from './MakeFormTable';

interface viewModalInterface{
    handleCancel:()=>void;
    isModalOpen:boolean;
    modal:allTableDataType;
}
const ViewModal = (viewModal:viewModalInterface) => {
  return (
    <Modal
            title="View Request"
            okButtonProps={{ style: { display: "none" } }}
            onCancel={viewModal.handleCancel}
            cancelButtonProps={{ style: { display: "none" } }}
            closable={{ "aria-label": "Custom Close Button" }}
            open={viewModal.isModalOpen}
            width={1000}
          >
            {viewModal.modal === undefined ? (
              <>Nothing to display</>
            ) : (
              <Flex vertical>
                <DisplayInfo {...viewModal.modal} />
                <Flex vertical align="center" gap={"middle"}>
                  <p>
                    <strong>Images</strong>
                  </p>
                  <Flex gap={"large"} wrap>
                    {viewModal.modal.images ? (
                      viewModal.modal.images.map((image) => {
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
                  </Flex>
                </Flex>
              </Flex>
            )}
          </Modal>
  )
}

export default ViewModal
