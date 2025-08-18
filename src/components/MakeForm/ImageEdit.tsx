import {
  DeleteOutlined,
  QuestionCircleOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Flex, Input, message, Popconfirm, Image } from "antd";
import { imageReturn } from "./AllMakeFormTable";
import { dissassociate, editDescription } from "../../services/MakeForm";
import { useEffect, useState } from "react";

const ImageEdit = (images: { images: imageReturn[] }) => {
  const [Images, setImages] = useState<imageReturn[]>(
    JSON.parse(JSON.stringify(images.images))
  );

  useEffect(() => {
    const reset = () => {
      setImages(JSON.parse(JSON.stringify(images.images)));
    };
    reset();
  }, [images.images]);

  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const dissassociationMutation = useMutation({
    mutationFn: (id: number) => dissassociate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["makes"] });
      messageApi.open({
        type: "success",
        content: "Successfully deleted Image",
      });
    },
    onError: (error) => {
      messageApi.open({
        type: "error",
        content: error instanceof Error ? error.message : String(error),
      });
    },
  });

  const editDescriptionMutation = useMutation({
    mutationFn: (image: imageReturn) => editDescription(image),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["makes"] });
      messageApi.open({
        type: "success",
        content: "Description update Successful",
      });
    },
    onError: (error) => {
      messageApi.open({
        type: "error",
        content: error instanceof Error ? error.message : String(error),
      });
    },
  });
  return (
    <Flex vertical align="center" gap={"middle"} wrap>
      {contextHolder}
      <p>
        <strong>Images</strong>
      </p>
      <Flex gap={"large"} wrap justify="center" align="center">
        {Images.length !== 0 ? (
          Images.map((image) => {
            return (
              <Flex
                vertical
                gap={"middle"}
                align="center"
                style={{ position: "relative" }}
                wrap
              >
                <Image height={260} src={image.url} />
                <Input
                  value={image.description}
                  onChange={(e) => {
                    setImages(
                      Images.map((imaged) =>
                        imaged.id !== image.id
                          ? imaged
                          : { ...imaged, description: e.target.value }
                      )
                    );
                  }}
                  addonAfter={
                    <Popconfirm
                      title={"Are you sure, you want to edit the description"}
                      onConfirm={async () => {
                        try {
                          editDescriptionMutation.mutate(image);
                          setImages(
                            Images.map((imaged) =>
                              imaged.id !== image.id
                                ? imaged
                                : {
                                    ...imaged,
                                    descriptionCopy: imaged.description,
                                  }
                            )
                          );
                        } catch (e: unknown) {
                          //   console.log("Error on edit" + e);
                          messageApi.open({
                            type: "error",
                            content: e instanceof Error ? e.message : String(e),
                          });
                        }
                      }}
                      okText="Yes"
                      cancelText="No"
                      icon={<QuestionCircleOutlined style={{ color: "red" }} />}
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
                      dissassociationMutation.mutate(image.id);
                      setImages(
                        Images.filter((imaged) => imaged.id !== image.id)
                      );
                    } catch (e: unknown) {
                      messageApi.open({
                        type: "error",
                        content: e instanceof Error ? e.message : String(e),
                      });
                    }
                  }}
                  okText="Yes"
                  cancelText="No"
                  icon={<QuestionCircleOutlined style={{ color: "red" }} />}
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
          <>
            <p>No images are found</p>
          </>
        )}
      </Flex>
    </Flex>
  );
};

export default ImageEdit;
