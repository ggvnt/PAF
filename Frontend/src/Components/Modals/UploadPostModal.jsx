import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Button, Upload } from "antd";
import { useSnapshot } from "valtio";
import state from "../../Utils/Store";
import PostService from "../../Services/PostService";
import UploadFileService from "../../Services/UploadFileService";
import { UploadOutlined } from "@ant-design/icons";

const themeColors = {
  primary: "#2563EB", // Deeper blue - professional and trustworthy
  secondary: "#7C3AED", // Rich purple - distinctive but not overwhelming
  accent: "#0EA5E9", // Bright blue for call-to-action elements
  background: "#F8FAFC", // Very light gray-blue for better readability
  surface: "#F1F5F9", // Subtle cool gray for content areas
  cardBg: "#FFFFFF", // Pure white for content blocks
  textPrimary: "#1E293B", // Dark blue-gray for main text
  textSecondary: "#475569", // Medium slate for secondary text
  border: "#CBD5E1", // Light gray-blue border that's visible but not distracting
  hover: "#1D4ED8", // Slightly darker blue for hover states
  danger: "#EF4444", // Accessible red for errors and warnings
  success: "#10B981", // Vibrant green for success states
  neutral: "#94A3B8", // Neutral gray-blue for inactive elements
  shadow: "rgba(37, 99, 235, 0.1)", // Subtle blue-tinted shadow
  gradient: "linear-gradient(145deg, #2563EB 0%,rgb(58, 198, 237) 100%)" // Professional gradient
};

const uploader = new UploadFileService();
const UploadPostModal = () => {
  const snap = useSnapshot(state);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const selectedPost = snap.selectedPost;
  const [fileType, setFileType] = useState("image");
  const [image, setImage] = useState("");
  const [imageUploading, setImageUploading] = useState(false);

  useEffect(() => {
    setImage(selectedPost?.mediaLink);
    setFileType(selectedPost.mediaType);
    form.setFieldsValue({
      contentDescription: selectedPost?.contentDescription,
    });
  }, [snap.selectedPost]);

  const handleUpdate = async (values) => {
    try {
      setLoading(true);
      const body = {
        contentDescription: values.contentDescription,
        mediaLink: image,
        mediaType: fileType,
      };
      await PostService.updatePost(selectedPost.id, body);
      state.posts = await PostService.getPosts();
      state.updatePostModalOpened = false; // Close the modal after update
    } catch (error) {
      console.error("Failed to update post:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (info) => {
    if (info.file) {
      setImageUploading(true);
      const fileType = info.file.type.split("/")[0];
      setFileType(fileType);
      const url = await uploader.uploadFile(
        info.fileList[0].originFileObj,
        "posts"
      );
      setImage(url);
    } else if (info.file.status === "removed") {
    }
    setImageUploading(false);
  };

  return (
    <Modal
      open={snap.updatePostModalOpened}
      onCancel={() => {
        state.updatePostModalOpened = false;
      }}
      footer={[
        <Button
          key="cancel"
          onClick={() => (state.updatePostModalOpened = false)}
          style={{ borderRadius: 8, borderColor: themeColors.primary, }}
        >
          Cancel
        </Button>,
        <Button
          disabled={imageUploading}
          key="update"
          type="primary"
          loading={loading}
          onClick={form.submit}
          style={{
            background: themeColors.primary,
            borderColor: themeColors.primary,
            borderRadius: 8,
            boxShadow: "0 2px 8px rgba(255, 107, 53, 0.2)"
          }}
        >
          Update
        </Button>,
      ]}
    >
      <h1>Update Post</h1>
      <Form
        form={form}
        initialValues={{ contentDescription: selectedPost.contentDescription }}
        onFinish={handleUpdate}
      >
        <Form.Item
          name="contentDescription"
          label="Content Description"
          rules={[
            { required: true, message: "Please enter content description" },
          ]}
        >
          <Input.TextArea />
        </Form.Item>
        {!imageUploading && (
          <Form.Item
            name="mediaLink"
            label="Media Link"
            rules={[{ required: true, message: "Please enter media link" }]}
          >
            <Upload
              accept="image/*,video/*"
              onChange={handleFileChange}
              showUploadList={false}
              beforeUpload={() => false}
              style={{ marginBottom: "1rem" }}
            >
              <Button icon={<UploadOutlined />}>Upload Media</Button>
            </Upload>
          </Form.Item>
        )}
      </Form>
      {imageUploading && <p>Please wait media is uploading</p>}
      {fileType === "image" && (
        <img src={image} style={{ maxHeight: 400 }} alt="Post" />
      )}
      {fileType === "video" && (
        <video controls src={image} style={{ maxHeight: 400, width: "100%" }} />
      )}
      <div style={{ height: 16 }} />
    </Modal>
  );
};

export default UploadPostModal;
