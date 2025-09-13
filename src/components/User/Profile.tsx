/**
 * USER PROFILE COMPONENT
 * 
 * PURPOSE:
 * User profile management interface allowing users to view their personal information
 * and manage their profile picture. Provides comprehensive user data display with
 * profile image upload, update, and deletion capabilities.
 * 
 * FUNCTIONALITY:
 * - Displays user information (name, username, branch, role, phone, status)
 * - Profile picture management with upload, update, and delete operations
 * - Image validation and Base64 encoding for API submission
 * - Status visualization with colored tags (Active/Blocked)
 * - Modal-based profile picture upload with drag-and-drop support
 * - Real-time profile updates with trigger-based re-fetching
 * - Confirmation dialogs for destructive operations
 * 
 * API INTERACTIONS:
 * - GET /api/user-profiles/get-user/{userId}: Fetches current user profile data
 * - PATCH /api/user-profiles/change-profile: Updates profile picture with Base64 data
 * - PATCH /api/user-profiles/delete-profile/{userId}: Removes profile picture
 * - Uses AuthContext for current user identification
 * - Comprehensive error handling with user feedback
 * 
 * USER INTERACTIONS:
 * - View personal profile information in card format
 * - Add/update profile picture via modal upload interface
 * - Delete existing profile picture with confirmation
 * - Drag-and-drop or click to select image files
 * - Preview selected image before saving
 * - Real-time status updates and success/error messages
 * 
 * STATE MANAGEMENT:
 * - User profile data state with complete user interface
 * - File upload state with UploadFile array management
 * - Base64 encoded image state for API submission
 * - Modal visibility state for upload interface
 * - Trigger state for forcing profile data refresh
 * - Message API integration for user notifications
 * 
 * IMAGE HANDLING:
 * - File type validation (images only)
 * - Base64 encoding via toBase64 utility function
 * - Image preview with URL.createObjectURL
 * - Profile picture display from BASE_URL + path
 * - Single file upload with maxCount: 1 restriction
 * 
 * USAGE: Personal profile page for authenticated users to manage their profile information
 */

import {
  //   Typography,
  Avatar,
  Button,
  Card,
  Flex,
  Divider,
  UploadProps,
  Upload,
  message,
  UploadFile,
  Modal,
  Tag,
  Popconfirm,
} from "antd";
import { useContext, useEffect, useState } from "react";
import { toBase64 } from "../../services/DisplayFunctions";
import { UserOutlined } from "@ant-design/icons";
import { api } from "../../services/axios";
import { AuthContext } from "../../context/AuthContext";
import { BASE_URL } from "../../services/Constants";

export interface user {
  id: number;
  name: string;
  username: string;
  userId: string;
  branch: string;
  role: string;
  phoneNumber: string;
  status: string;
  loginStatus: number;
  presentStatus: number;
  profilePicture: string;
}

const Profile = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [encodedProfile, setEncodedProfile] = useState("");
  const [profileImageModal, setProfileImageModal] = useState(false);
  const [trigger, setTrigger] = useState(0);
  const [user, setUser] = useState<user>({
    id: 0,
    name: "",
    username: "",
    userId: "",
    branch: "",
    role: "",
    phoneNumber: "",
    status: "0",
    loginStatus: 0,
    presentStatus: 0,
    profilePicture: "",
  });
  const USER = useContext(AuthContext);
  useEffect(() => {
    const userProfile = async () => {
      try {
        const res = await api.get(
          `/api/user-profiles/get-user/${USER?.user?.userId}`
        );
        setUser(res.data);
      } catch (e) {
        console.log(e);
        messageApi.open({
          type: "error",
          content: "some error happened",
        });
      }
    };
    userProfile();
  }, [trigger]);
  const emptyStates = () => {
    setEncodedProfile("");
  };
  const beforeUpload = async (file: File) => {
    if (file) {
      const encoded = await toBase64(file);
      setEncodedProfile(encoded);
      return encoded;
    }
  };
  const onModalCancel = () => {
    setProfileImageModal(false);
    emptyStates();
    setFileList([]);
  };
  const props: UploadProps = {
    maxCount: 1,
    accept: "image/*",
    fileList: fileList,
    async beforeUpload(file: File) {
      if (!file.type.startsWith("image/")) {
        messageApi.open({
          type: "error",
          content: "Only images are accepted",
        });
        return false;
      }
      const encoded = await beforeUpload(file);
      if (!encoded) {
        console.log(encodedProfile);
        messageApi.open({
          type: "error",
          content: "some error happened",
        });
        return false;
      }
      setFileList([
        {
          uid: String(Date.now()),
          name: file.name,
          status: "done",
          url: URL.createObjectURL(file),
        },
      ]);

      return false;
    },
  };
  async function handleSave() {
    try {
      await api.patch("/api/user-profiles/change-profile", {
        id: USER?.user?.userId,
        base64: encodedProfile,
      });
      messageApi.open({
        type: "success",
        content: "successfully changed profile",
      });
      setTrigger((prev) => prev + 1);
    } catch (e) {
      console.log(e);
      messageApi.open({
        type: "error",
        content: e?.response.data ?? "Something went wrong",
      });
    } finally {
      onModalCancel();
    }
  }

  async function handleDelete() {
    try {
      await api.patch(
        `/api/user-profiles/delete-profile/${USER?.user?.userId}`
      );
      messageApi.open({
        type: "success",
        content: "Deleted profile successfully",
      });
      setTrigger((prev) => prev + 1);
    } catch (e) {
      console.log(e);
      messageApi.open({
        type: "error",
        content: e?.response.data ?? "Something went wrong",
      });
    }
  }

  return (
    <>
      {contextHolder}
      <Card style={{ minWidth: "350px" }}>
        {!user.profilePicture ? (
          <Flex align="center" gap={10}>
            <Flex vertical align="center">
              <p>Profile picture</p>
              <Avatar shape="square" size={70} icon={<UserOutlined />} />
            </Flex>
            <Flex style={{ marginTop: "45px" }}>
              <Button onClick={() => setProfileImageModal(true)}>
                Add Picture
              </Button>
            </Flex>
          </Flex>
        ) : (
          <Flex align="center" gap={5}>
            <Flex vertical align="center">
              <p>Profile picture</p>
              <Avatar
                src={BASE_URL+"/"+user.profilePicture}
                shape="square"
                size={70}
              ></Avatar>
            </Flex>
            <Flex style={{ marginTop: "45px" }} gap={5}>
              <Button onClick={() => setProfileImageModal(true)}>
                Add Photo
              </Button>
              <Popconfirm
                title="Profile Delete"
                description="Are you sure you want to delete your profile?"
                onConfirm={handleDelete}
              >
                <Button danger>Delete Photo</Button>
              </Popconfirm>
            </Flex>
          </Flex>
        )}
        <Divider />
        <Flex vertical>
          <Flex justify="space-between">
            <p>Name:</p>
            <p>{user.name}</p>
          </Flex>
          <Flex justify="space-between">
            <p>Username:</p>
            <p>{user.username}</p>
          </Flex>
          <Flex justify="space-between">
            <p>Branch:</p>
            <p>{user.branch}</p>
          </Flex>
          <Flex justify="space-between">
            <p>Role:</p>
            <p>{user.role}</p>
          </Flex>
          <Flex justify="space-between">
            <p>Phone Number:</p>
            <p>{user.phoneNumber}</p>
          </Flex>
          {user.status === "1" ? (
            <Flex gap={5} justify="space-between" align="center">
              <p>Status:</p>
              <Tag color="green" style={{ height: "fit-content" }}>
                Active
              </Tag>
            </Flex>
          ) : (
            <Flex gap={5} justify="space-between" align="center">
              <p>Status:</p>
              <Tag color="red">Blocked</Tag>
            </Flex>
          )}
        </Flex>
      </Card>
      <Modal
        onCancel={() => {
          onModalCancel();
        }}
        cancelButtonProps={{ style: { display: "none" } }}
        okButtonProps={{ style: { display: "none" } }}
        open={profileImageModal}
        title="Upload a Profile-Picture"
      >
        {" "}
        <Upload.Dragger {...props}>
          Drag
          <br />
          or
          <br />
          <Button style={{ marginBottom: "15px", marginTop: "5px" }}>
            Pick a Picture
          </Button>
        </Upload.Dragger>
        {!fileList[0] ||
          (fileList[0].url !== "" && (
            <Flex vertical justify="center" gap={10}>
              <Card>
                <Flex vertical align="center">
                  <p>Profile picture</p>
                  <Avatar shape="square" size={70} src={fileList[0].url} />
                </Flex>
              </Card>
              <Button onClick={handleSave}>Save</Button>
            </Flex>
          ))}
      </Modal>
    </>
  );
};

export default Profile;
