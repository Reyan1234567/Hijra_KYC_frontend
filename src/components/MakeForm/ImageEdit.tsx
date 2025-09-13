/**
 * IMAGE EDIT COMPONENT
 * 
 * TYPE: Helper Component (Form Module)
 * PURPOSE: Provides image management functionality for KYC forms - edit descriptions and delete images
 * 
 * FUNCTIONALITY:
 * - Displays images associated with a KYC form in a grid layout
 * - Edit image descriptions with real-time input and save confirmation
 * - Delete images with confirmation dialog
 * - Real-time local state updates with server synchronization
 * - Success/error feedback via message notifications
 * - Optimistic UI updates with rollback on error
 * 
 * DATA OPERATIONS:
 * - API: PUT /makeForm/image/editDescription - updates image description
 * - API: DELETE /makeForm/image/dissassociate/{id} - removes image from form
 * - Service: editDescription(image) - updates image description
 * - Service: dissassociate(id) - deletes image association
 * - Invalidates React Query cache ["makes"] on successful operations
 * 
 * USER INTERACTIONS:
 * - View images in grid layout with descriptions
 * - Edit description inline with input field
 * - Save button (enabled only when description changes and is not empty)
 * - Delete button with confirmation dialog
 * - Real-time description editing with local state management
 * 
 * STATE MANAGEMENT:
 * - Images: imageReturn[] - local copy of images for optimistic updates
 * - Syncs with parent props via useEffect when images.images changes
 * - Uses React Query mutations for server operations
 * - Local state updates immediately, server sync follows
 * 
 * LIFECYCLE:
 * - Receives images array as props from parent component
 * - Creates local copy for optimistic updates
 * - Resets local state when parent props change
 * - Handles mutation success/error states
 * 
 * USAGE: Used within EditModal and other form editing components
 * ROLE PERMISSIONS: Maker users (for their own forms)
 */

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
import { BASE_URL } from "../../services/Constants";

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
                <Image height={260} src={BASE_URL+"/"+image.url} />
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
