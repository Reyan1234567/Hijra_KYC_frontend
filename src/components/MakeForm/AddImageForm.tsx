/**
 * ADD IMAGE FORM COMPONENT
 * 
 * TYPE: Form Component (MakeForm Module)
 * PURPOSE: Provides a dynamic form for adding multiple images with descriptions to KYC forms
 * 
 * FUNCTIONALITY:
 * - Dynamic form with add/remove image functionality
 * - File upload with Base64 encoding for API submission
 * - Image preview with URL.createObjectURL for immediate feedback
 * - Description input for each image with validation
 * - useReducer pattern for complex state management
 * - Form validation with required field rules
 * - Automatic form reset after successful submission
 * 
 * STATE MANAGEMENT:
 * - Uses useReducer with custom actions for image array management
 * - Actions: ADD_IMAGE, REMOVE_IMAGE, SET_DESCRIPTION, SET_FILE, CLEAR_IMAGES
 * - Maintains separate state for form fields and image data
 * 
 * USER INTERACTIONS:
 * - Add new image slots with Plus button
 * - Remove individual images with Delete button
 * - File selection with image preview
 * - Description input for each image
 * - Save button (disabled when no images)
 * - Form submission with validation
 * 
 * DATA FLOW:
 * - Converts selected files to Base64 using toBase64 utility
 * - Creates preview URLs with URL.createObjectURL
 * - Calls parent onFinish callback with makeId and images array
 * - Triggers modal closure via setEditModal callback
 * 
 * USAGE: Used by EditModal and Search components for image management
 */

import { useForm } from "antd/es/form/Form";
import { DeleteOutlined } from "@ant-design/icons";
import { Button, Flex, Form, Input, Image, Card, message } from "antd";
import { toBase64 } from "../../services/DisplayFunctions";
import { Plus } from "lucide-react";
import { useReducer } from "react";

interface addImageFormInterface {
  setEditModal: () => void;
  makeId:number;
  onFinish: ({ makeId, images }: { makeId: number; images: egami[] }) => void;
}

interface egami {
  description: string;
  file: string;
  url: string;
}

type EgamiAction =
  | { type: "ADD_IMAGE" }
  | { type: "REMOVE_IMAGE"; index: number }
  | { type: "SET_DESCRIPTION"; index: number; description: string }
  | { type: "SET_FILE"; index: number; file: string; url: string }
  | { type: "CLEAR_IMAGES" };

const imagesReducer = (state: egami[], action: EgamiAction): egami[] => {
  switch (action.type) {
    case "ADD_IMAGE":
      return [...state, { file: "", description: "", url: "" }];
    case "REMOVE_IMAGE":
      return state.filter((_, i) => i !== action.index);
    case "SET_DESCRIPTION":
      return state.map((img, i) =>
        i === action.index ? { ...img, description: action.description } : img
      );
    case "SET_FILE":
      return state.map((img, i) =>
        i === action.index
          ? { ...img, file: action.file, url: action.url }
          : img
      );
    case "CLEAR_IMAGES":
      return [];
    default:
      return state;
  }
};
const AddImageForm = (prop: addImageFormInterface) => {
  const [form] = useForm();
  const [images, dispatch] = useReducer(imagesReducer, []);
  const [_, contextHolder] = message.useMessage();
  const onFinishEdit = async () => {
    prop.onFinish({makeId:prop.makeId, images:images});
    prop.setEditModal();
    dispatch({ type: "CLEAR_IMAGES" });
    form.resetFields();
  };

  return (
    <>
      {contextHolder}
      <Form
        form={form}
        onFinish={() => {
          // setDescription(value);
          onFinishEdit();
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
                                e.target.files[0]
                              );
                              dispatch({
                                type: "SET_FILE",
                                index,
                                file: encoded,
                                url,
                              });
                            }
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
                            dispatch({
                              type: "SET_DESCRIPTION",
                              index,
                              description: e.target.value,
                            });
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
                      dispatch({ type: "REMOVE_IMAGE", index: index });
                    }}
                  >
                    <DeleteOutlined /> Remove
                  </Button>
                </Card>
              ))}
              <Button
                onClick={() => {
                  dispatch({ type: "ADD_IMAGE" });
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
  );
};

export default AddImageForm;
