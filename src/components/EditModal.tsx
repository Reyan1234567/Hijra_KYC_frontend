import { DeleteOutlined, QuestionCircleOutlined, SaveOutlined } from "@ant-design/icons";
import {
  Button,
  Divider,
  Flex,
  Form,
  Input,
  Modal,
  Popconfirm,
  Image,
  Card,
} from "antd";
import DisplayInfo from "./DisplayInfo";
import { Plus } from "lucide-react";
import { api } from "../services/axios";
import { toBase64 } from "../services/DisplayFunctions";

const EditModal = (handleCancel, editModal, modal, images, setModal, messageApi, onFinishEdit, setFile, setDescription, addImage) => {
  return (
    <>
      <Modal
        title="Edit Request"
        onCancel={handleCancel}
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
        closable={{ "aria-label": "Custom Close Button" }}
        open={editModal}
        width={1000}
      >
        {modal === undefined ? (
          <>Nothing to display</>
        ) : (
          <>
            <DisplayInfo {...modal} />
            <Flex vertical align="center" gap={"middle"} wrap>
              <p>
                <strong>Images</strong>
              </p>
              <Flex gap={"large"}>
                {modal.images ? (
                  modal.images.map((image) => {
                    return (
                      <Flex
                        vertical
                        gap={"middle"}
                        align="center"
                        style={{ position: "relative" }}
                        wrap
                      >
                        <Image width={260} src={image.name} />
                        <Input
                          value={image.description}
                          onChange={(e) => {
                            setModal({
                              ...modal,
                              images: [
                                ...modal.images.filter(
                                  (img) => img.id !== image.id
                                ),
                                { ...image, description: e.target.value },
                              ],
                            });
                          }}
                          addonAfter={
                            <Popconfirm
                              title={
                                "Are you sure, you want to edit the description"
                              }
                              onConfirm={async () => {
                                try {
                                  await api.patch(
                                    "/image/description",
                                    { description: image.description },
                                    { params: { id: image.id } }
                                  );
                                  messageApi.open({
                                    type: "success",
                                    content: "Description edited successfully",
                                  });
                                  setModal({
                                    ...modal,
                                    images: [
                                      ...modal.images.filter(
                                        (img) => img.id !== image.id
                                      ),
                                      {
                                        ...image,
                                        descriptionCopy: image.description,
                                      },
                                    ],
                                  });
                                } catch (e: any) {
                                  //   console.log("Error on edit" + e);
                                  messageApi.open({
                                    type: "error",
                                    content: e.toString(),
                                  });
                                }
                              }}
                              okText="Yes"
                              cancelText="No"
                              icon={
                                <QuestionCircleOutlined
                                  style={{ color: "red" }}
                                />
                              }
                            >
                              <Button
                                disabled={
                                  image.descriptionCopy === image.description ||
                                  image.description == ""
                                }
                              >
                                <SaveOutlined />
                              </Button>
                            </Popconfirm>
                          }
                        ></Input>
                        <Popconfirm
                          title={"Are you sure, you want to delete this image?"}
                          onConfirm={async () => {
                            try {
                              await api.patch(
                                `/image/disassociate/${image.id}`
                              );
                              setModal({
                                ...modal,
                                images: modal.images.filter(
                                  (img) => img.id == image.id
                                ),
                              });
                            } catch (e: any) {
                              messageApi.open({
                                type: "success",
                                content: e.toString(),
                              });
                            }
                          }}
                          okText="Yes"
                          cancelText="No"
                          icon={
                            <QuestionCircleOutlined style={{ color: "red" }} />
                          }
                        >
                          <Button
                            style={{
                              position: "absolute",
                              right: "0",
                              top: "0",
                            }}
                          >
                            <DeleteOutlined />
                          </Button>
                        </Popconfirm>
                      </Flex>
                    );
                  })
                ) : (
                  <p>No images are found</p>
                )}
              </Flex>
              <Divider />
            </Flex>

            <Form
              form={form}
              onFinish={() => {
                // setDescription(value);
                onFinishEdit(modal.makeId);
                form.resetFields();
              }}
            >
              <Form.List name="images">
                {(fields, { add, remove }) => (
                  <Flex vertical gap={"middle"}>
                    {fields.map((field, index) => (
                      <Card
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                        }}
                      >
                        <Flex
                          justify="space-between"
                          align="center"
                          gap={"large"}
                          style={{ width: "100%" }}
                        >
                          <Flex vertical>
                            <Form.Item
                              name={[field.name, "file"]}
                              label="Image"
                              rules={[
                                {
                                  required: true,
                                  message: "This field in required!",
                                },
                              ]}
                            >
                              <Input
                                type="file"
                                accept="image/*"
                                onChange={async (e) => {
                                  if (e.target.files?.[0] !== null) {
                                    const encoded = await toBase64(
                                      e.target.files?.[0]
                                    );
                                    const url = URL.createObjectURL(
                                      e.target?.files[0]
                                    );
                                    setFile(index, encoded, url);
                                  }
                                  //   form.setFieldValue(["images", index, "file"], encodedFile);
                                }}
                              />
                            </Form.Item>
                            <Form.Item
                              name={[field.name, "description"]}
                              label="Description"
                              rules={[
                                {
                                  required: true,
                                  message: "This field in required!",
                                },
                              ]}
                            >
                              <Input
                                onChange={(e) => {
                                  setDescription(index, e.target.value);
                                }}
                              />
                            </Form.Item>
                          </Flex>
                          {images[index].url !== "" && (
                            <Image
                              src={images[index].url}
                              width={260}
                              style={{ width: "260px" }}
                            />
                          )}
                        </Flex>
                        <Button
                          onClick={() => {
                            remove(index);
                            removeImage(index);
                          }}
                        >
                          <DeleteOutlined /> Remove
                        </Button>
                      </Card>
                    ))}
                    <Button
                      onClick={() => {
                        addImage();
                        add();
                      }}
                    >
                      <Plus /> Add Image
                    </Button>
                    <Button disabled={fields.length === 0} htmlType="submit">
                      Save
                    </Button>
                  </Flex>
                )}
              </Form.List>
            </Form>
          </>
        )}
      </Modal>
    </>
  );
};

export default EditModal;
