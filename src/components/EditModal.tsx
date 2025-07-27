import {
  DeleteOutlined,
  QuestionCircleOutlined,
  SaveOutlined,
} from "@ant-design/icons";
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
  message,
} from "antd";
import { Plus } from "lucide-react";
import { api } from "../services/axios";
import { allTableDataType } from "./MakeFormTable";
import { useForm } from "antd/es/form/Form";
import { useState } from "react";
import { toBase64 } from "../services/DisplayFunctions";
import MakeInfo from "./MakeInfo";

interface editModalParam {
  handleCancel: () => void;
  editModal: boolean;
  modal: allTableDataType;
  setModal: React.Dispatch<React.SetStateAction<allTableDataType>>;
  editModalOff: () => void;
  triggerRender: () => void;
}

interface egami {
  description: string;
  file: string;
  url: string;
}

const EditModal = (editModalParam: editModalParam) => {
  const [images, setImage] = useState<egami[]>([]);
  const addImage = () => {
    setImage([...images, { file: "", description: "", url: "" }]);
  };
  const removeImage = (index: number) => {
    if (images) {
      setImage(images.filter((img) => images[index] !== img));
    }
  };

  const setDescription = (index: number, description: string) => {
    setImage(
      images.map((img, i) => (i === index ? { ...img, description } : img))
    );
  };

  const setFile = (index: number, file: string, url: string) => {
    setImage(
      images.map((img, i) => (i === index ? { ...img, file, url } : img))
    );
  };

  const clearImage = () => {
    setImage([]);
  };
  const [form] = useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinishEdit = async (makeId: number) => {
    console.log(images[0]);
    try {
      //   console.log(image);
      await api.post(
        `/image/create-Images/${makeId}`,
        images.map((image) => ({
          file: image.file,
          description: image.description,
        }))
      );

      editModalParam.triggerRender();
      editModalParam.editModalOff();
      clearImage();
      messageApi.open({
        type: "success",
        content: "Images created Successfully",
      });
    } catch (e: unknown) {
      //   console.log("Error on edit" + e);
      clearImage();
      messageApi.open({
        type: "error",
        content: e instanceof Error ? e.message : String(e),
      });
    }
  };

  return (
    <>
      {contextHolder}
      <Modal
        title="Edit Request"
        onCancel={editModalParam.handleCancel}
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
        closable={{ "aria-label": "Custom Close Button" }}
        open={editModalParam.editModal}
        width={1000}
      >
        {editModalParam.modal === undefined ? (
          <>Nothing to display</>
        ) : (
          <>
            <MakeInfo {...editModalParam.modal} />
            <Flex vertical align="center" gap={"middle"} wrap>
              <p>
                <strong>Images</strong>
              </p>
              <Flex gap={"large"} wrap justify="center" align="center">
                {editModalParam.modal.images ? (
                  editModalParam.modal.images.map((image) => {
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
                            editModalParam.setModal({
                              ...editModalParam.modal,
                              images: [
                                ...editModalParam.modal.images.map((img) =>
                                  img.id === image.id
                                    ? { ...image, description: e.target.value }
                                    : img
                                ),
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
                                  editModalParam.setModal({
                                    ...editModalParam.modal,
                                    images: [
                                      ...editModalParam.modal.images.filter(
                                        (img) => img.id !== image.id
                                      ),
                                      {
                                        ...image,
                                        descriptionCopy: image.description,
                                      },
                                    ],
                                  });
                                  editModalParam.triggerRender();
                                } catch (e: unknown) {
                                  //   console.log("Error on edit" + e);
                                  messageApi.open({
                                    type: "error",
                                    content:
                                      e instanceof Error
                                        ? e.message
                                        : String(e),
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
                              messageApi.open({
                                type: "success",
                                content: "Image deleted successfully",
                              });
                              editModalParam.setModal({
                                ...editModalParam.modal,
                                images: editModalParam.modal.images.filter(
                                  (img) => img.id !== image.id
                                ),
                              });
                              editModalParam.triggerRender();
                            } catch (e: unknown) {
                              messageApi.open({
                                type: "error",
                                content:
                                  e instanceof Error ? e.message : String(e),
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
                onFinishEdit(editModalParam.modal.makeId);
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
