import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Divider,
  Dropdown,
  Flex,
  Form,
  Input,
  message,
  Modal,
  Spin,
  Table,
  Tag,
  Image,
  Popconfirm,
} from "antd";
import type { MenuProps, TableColumnsType } from "antd";
import { api } from "../services/axios";
import {
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  EyeOutlined,
  QuestionCircleOutlined,
  SaveOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { Plus } from "lucide-react";
import { useForm } from "antd/es/form/Form";
import { ExtractDate } from "../services/DisplayFunctions";
import DisplayInfo from "./DisplayInfo";

interface imageReturn {
  id: number;
  name: string;
  description: string;
  descriptionCopy: string;
  make_id: string;
}

export interface allTableDataType {
  id: number;
  makerId: number;
  makeId: number;
  makerName: string;
  madeAt: Date;
  checkedAt: Date;
  assignedAt: Date;
  hoId: number;
  hoName: string;
  cif: string;
  customerAccount: string;
  customerName: string;
  customerPhone: string;
  images: imageReturn[];
  status: number;
}
interface dropDownInterface {
  menu: MenuProps["items"];
  onChange: () => void;
}

// interface image {
//   description: string;
//   file: string;
// }

interface egami {
  description: string;
  file: string;
  url: string;
}
const MakeFormTable = () => {
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
  const [editModal, setEditModal] = useState(false);
  const [componentReload, setComponentReload] = useState(0);
  const edit: MenuProps["items"] = [
    {
      label: "Edit",
      key: "1",
      icon: <EditOutlined />,
      onClick: () => {
        setEditModal(true);
      },
    },
    {
      label: "View",
      key: "2",
      icon: <EyeOutlined />,
      onClick: async () => {
        await api.patch(`makeForm/sendToHo/${modal.id}`);
      },
    },
  ];

  const view: MenuProps["items"] = [
    {
      label: "View",
      key: "1",
      icon: <EyeOutlined />,
      onClick: () => {
        setIsModalOpen(true);
      },
    },
  ];

  const draft: MenuProps["items"] = [
    {
      label: "Edit",
      key: "1",
      icon: <EditOutlined />,
      onClick: () => {
        setEditModal(true);
      },
    },
    {
      label: "View",
      key: "2",
      icon: <EyeOutlined />,
      onClick: () => {
        setIsModalOpen(true);
      },
    },
    {
      label: "Send to HO",
      key: "3",
      icon: <SendOutlined />,
      onClick: async () => {
        try {
          await api.patch(`/makeForm/send-ToHo/${modal.id}`);
          messageApi.open({
            type: "success",
            content: "succesfully sent to ho",
          });
          setComponentReload((prev) => prev + 1);
        } catch (e: any) {
          console.log(e);
          messageApi.open({
            type: "error",
            content: e.toString(),
          });
        }
      },
    },
  ];

  const [modal, setModal] = useState<allTableDataType>({
    id: 0,
    makerId: 0,
    makeId: 0,
    makerName: "",
    madeAt: new Date(),
    checkedAt: new Date(),
    assignedAt: new Date(),
    hoId: 0,
    hoName: "",
    cif: "",
    customerAccount: "",
    customerName: "",
    customerPhone: "",
    images: [],
    status: 0,
  });
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
      render: (checkedAt) => <Flex justify="center">{ExtractDate(checkedAt)}</Flex>,
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
    {
      title: "Actions",
      dataIndex: "status",
      render: (status: number, row: allTableDataType) => {
        if (status === 0) {
          return (
            <Flex justify="center" align="center">
              <DropDown
                menu={draft}
                onChange={() => {
                  setModal(row);
                }}
              />
            </Flex>
          );
        } else if (status === 3) {
          return (
            <Flex justify="center" align="center">
              <DropDown
                menu={edit}
                onChange={() => {
                  setModal(row);
                }}
              />
            </Flex>
          );
        } else {
          return (
            <Flex justify="center" align="center">
              <DropDown
                menu={view}
                onChange={() => {
                  setModal(row);
                }}
              />
            </Flex>
          );
        }
      },
    },
  ];

  const DropDown = (drop: dropDownInterface) => (
    <Dropdown
      menu={{ items: drop.menu }}
      trigger={["click"]}
      onOpenChange={drop.onChange}
    >
      <Button>
        Actions
        <DownOutlined />
      </Button>
    </Dropdown>
  );


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [state, setState] = useState<"empty" | "loading" | "success" | "error">(
    "loading"
  );
  const [makeForms, setMakeForms] = useState<allTableDataType[]>();
  useEffect(() => {
    const fetchAccepted = async () => {
      try {
        const form = await api.get("/makeForm", { params: { makerId: 10 } });
        if (!form || form.data.length === 0) {
          setState("empty");
        } else {
          setState("success");
          console.log("form.data" + form.data);
          setMakeForms(form.data);
        }
      } catch (error) {
        setState("error");
        console.log("error" + error);
      }
    };
    fetchAccepted();
  }, [componentReload]);

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditModal(false);
  };

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
      messageApi.open({
        type: "success",
        content: "Images created Successfully",
      });
      clearImage();
      setEditModal(false);
      setComponentReload((prev) => prev + 1);
    } catch (e: any) {
      //   console.log("Error on edit" + e);
      clearImage();
      messageApi.open({
        type: "error",
        content: e.toString(),
      });
    }
  };

  const toBase64 = (image: File | undefined | null) => {
    console.log("in the base64");
    if (image === null || undefined) {
      return;
    }
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      if (image) {
        reader.readAsDataURL(image);
        reader.onload = () => {
          if (typeof reader.result === "string") {
            resolve(reader.result);
          } else {
            reject(new Error("Failed to parse or some shit"));
          }
        };
        reader.onerror = () => {
          reject(new Error("Failed mf"));
        };
      } else {
        reject(new Error("Failed mf"));
      }
    });
  };

  return (
    <>
      {state === "empty" && <Table<allTableDataType> columns={columns} />}
      {state === "loading" && <Spin size="large" />}
      {state === "error" && <p>Something wrong happened</p>}
      {state === "success" && (
        <>
          {contextHolder}
          <Flex gap="middle" vertical>
            <Table<allTableDataType>
              columns={columns}
              dataSource={makeForms}
              pagination={{
                showSizeChanger: true,
                pageSizeOptions: ["5", "10", "20", "50", "100", "200"],
              }}
            />
          </Flex>
          <Modal
            title="View Request"
            okButtonProps={{ style: { display: "none" } }}
            onCancel={handleCancel}
            cancelButtonProps={{ style: { display: "none" } }}
            closable={{ "aria-label": "Custom Close Button" }}
            open={isModalOpen}
            width={1000}
          >
            {modal === undefined ? (
              <>Nothing to display</>
            ) : (
              <Flex vertical>
                <DisplayInfo {...modal} />
                <Flex vertical align="center" gap={"middle"}>
                  <p>
                    <strong>Images</strong>
                  </p>
                  <Flex gap={"large"}>
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
                  </Flex>
                </Flex>
              </Flex>
            )}
          </Modal>
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
                                        content:
                                          "Description edited successfully",
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
                                      image.descriptionCopy ===
                                        image.description ||
                                      image.description == ""
                                    }
                                  >
                                    <SaveOutlined />
                                  </Button>
                                </Popconfirm>
                              }
                            ></Input>
                            <Popconfirm
                              title={
                                "Are you sure, you want to delete this image?"
                              }
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
                                <QuestionCircleOutlined
                                  style={{ color: "red" }}
                                />
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
                        <Button
                          disabled={fields.length === 0}
                          htmlType="submit"
                        >
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
      )}
    </>
  );
};

export default MakeFormTable;

// current: page,
// pageSize: pageSize,
// total: totalCount,
// showSizeChanger: true, // allows changing how many rows per page
// onChange: (page, pageSize) => {
//   setPage(page);
//   setPageSize(pageSize);
// }

// <Dropdown
//                 menu={{ items: view }}
//                 trigger={["click"]}
//                 onOpenChange={() => {
//                   setModal(row);
//                 }}
//               >
//                 <Button>
//                   Actions
//                   <DownOutlined />
//                 </Button>
//               </Dropdown>
