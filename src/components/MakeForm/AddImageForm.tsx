/**
 * AddImageForm - Dynamic image upload component for KYC documents
 * 
 * Manages multiple image uploads with descriptions using dual state:
 * - useReducer for image data (Base64, preview URLs, descriptions)
 * - Ant Design Form.List for validation and dynamic fields
 * 
 * File processing: File input → Base64 conversion + Object URL → State update
 * Submission: Validates form → Calls parent onFinish({ makeId, images }) → Resets state
 * 
 * Used by: EditModal, Search components for KYC document attachment
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

// Image object: description + Base64 file + preview URL
interface egami {
  description: string; // Document description
  file: string;        // Base64 data for API
  url: string;         // Object URL for preview
}

// Reducer actions for image array management
type EgamiAction =
  | { type: "ADD_IMAGE" }
  | { type: "REMOVE_IMAGE"; index: number }
  | { type: "SET_DESCRIPTION"; index: number; description: string }
  | { type: "SET_FILE"; index: number; file: string; url: string }
  | { type: "CLEAR_IMAGES" };

/**
 * STATE MANAGEMENT ANALYSIS:
 * 
 * This component uses THREE coordinated state management systems:
 * 
 * 1. useReducer (Custom Image State):
 *    - Purpose: Store actual image data (Base64, URLs, descriptions)
 *    - Data: egami[] array with file/description/url objects
 *    - Actions: ADD_IMAGE, REMOVE_IMAGE, SET_DESCRIPTION, SET_FILE, CLEAR_IMAGES
 *    - Why useReducer: Complex array operations need predictable state transitions
 * 
 * 2. Ant Design Form.List (Form Validation State):
 *    - Purpose: Handle form validation, field registration, dynamic UI
 *    - Data: Internal field objects managed by Ant Design
 *    - Methods: add(), remove(), validation rules
 *    - Why Form.List: Robust validation and dynamic field management
 * 
 * 3. Ant Design Message (Notification State):
 *    - Purpose: Display toast messages and user feedback
 *    - Usage: contextHolder provides message API
 * 
 * STATE SYNCHRONIZATION STRATEGY:
 * - Add/Remove: Both useReducer and Form.List updated simultaneously
 * - File Selection: Updates useReducer (data) + Form.List handles validation
 * - Description: Updates useReducer (data) + Form.List handles validation
 * - Submission: useReducer data sent to parent, both states reset
 * 
 * This dual-state approach separates concerns:
 * - Form.List = UI validation and field management
 * - useReducer = Business logic and data processing
 */

// Reducer: manages image array with immutable updates
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
  // STATE MANAGEMENT SYSTEM 1: Ant Design Form State
  // Manages form validation, field registration, and submission
  const [form] = useForm();
  
  // STATE MANAGEMENT SYSTEM 2: Custom Image State (useReducer)
  // Manages image data array with Base64 files, descriptions, and preview URLs
  const [images, dispatch] = useReducer(imagesReducer, []);
  
  // STATE MANAGEMENT SYSTEM 3: Ant Design Message State
  // Manages toast notifications and user feedback messages
  const [_, contextHolder] = message.useMessage();
  // Submit: send images to parent, close modal, reset state
  const onFinishEdit = async () => {
    prop.onFinish({makeId: prop.makeId, images: images});
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
        {/* FORM.LIST STATE: Dynamic field management with validation */}
        {/* fields[] - Array of form field objects managed by Ant Design */}
        {/* add() - Function to add new form field */}
        {/* remove(index) - Function to remove form field at index */}
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
                              // DUAL STATE UPDATE: File processing affects both states
                              // 1. Convert to Base64 for API submission
                              const encoded = await toBase64(e.target.files?.[0]);
                              // 2. Create Object URL for immediate preview
                              const url = URL.createObjectURL(e.target.files[0]);
                              // 3. Update useReducer state with both values
                              dispatch({
                                type: "SET_FILE",
                                index,
                                file: encoded,
                                url,
                              });
                              // Note: Form.List state is automatically updated by Ant Design
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
                            // SINGLE STATE UPDATE: Description only affects useReducer
                            // Form.List handles validation, useReducer stores actual data
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
                      // SYNCHRONIZED STATE REMOVAL: Both states must be updated
                      // 1. Remove from Form.List (handles validation state)
                      remove(index);
                      // 2. Remove from useReducer (handles image data)
                      dispatch({ type: "REMOVE_IMAGE", index: index });
                    }}
                  >
                    <DeleteOutlined /> Remove
                  </Button>
                </Card>
              ))}
              <Button
                onClick={() => {
                  // SYNCHRONIZED STATE ADDITION: Both states must be updated
                  // 1. Add to useReducer (creates empty image object)
                  dispatch({ type: "ADD_IMAGE" });
                  // 2. Add to Form.List (creates new form field)
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
