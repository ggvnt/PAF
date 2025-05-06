import React, { useState } from "react";
import { Modal, Form, Input, Button, Upload, message, Space, Typography, Divider, Tooltip } from "antd";
import { useSnapshot } from "valtio";
import state from "../../Utils/Store";
import UploadFileService from "../../Services/UploadFileService";
import { UploadOutlined, FileImageOutlined, VideoCameraOutlined, InfoCircleOutlined } from "@ant-design/icons";
import PostService from "../../Services/PostService";

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

const { Title, Text, Paragraph } = Typography;
const uploader = new UploadFileService();

const CreatePostModal = () => {
  const snap = useSnapshot(state);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [fileType, setFileType] = useState("image");
  const [image, setImage] = useState("");

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      const body = {
        ...values,
        mediaLink: image,
        userId: snap.currentUser?.uid,
        mediaType: fileType,
      };
      await PostService.createPost(body);
      state.posts = await PostService.getPosts();
      message.success("Post created successfully");
      state.createPostModalOpened = false;
      form.resetFields();
      setImage("");
    } catch (error) {
      console.error("Form validation failed:", error);
      message.error("Failed to create post. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleFileChange = async (info) => {
    if (info.file) {
      try {
        setImageUploading(true);
        const fileType = info.file.type.split("/")[0];
        setFileType(fileType);
        const url = await uploader.uploadFile(
          info.fileList[0].originFileObj,
          "posts"
        );
        setImage(url);
        form.setFieldsValue({ mediaLink: url });
        message.success(`${fileType} uploaded successfully`);
      } catch (error) {
        message.error("Upload failed. Please try again.");
        console.error("Upload error:", error);
      } finally {
        setImageUploading(false);
      }
    } else if (info.file.status === "removed") {
      setImage("");
      form.setFieldsValue({ mediaLink: "" });
    }
  };
  
  const handleCancel = () => {
    form.resetFields();
    setImage("");
    state.createPostModalOpened = false;
  };

  const MediaPreview = () => {
    if (!image) return null;
    
    if (fileType === "image") {
      return (
        <div style={{ marginBottom: 16, textAlign: "center" }}>
          <div style={{
            padding: 12,
            background: themeColors.surface,
            borderRadius: 12,
            border: `1px solid ${themeColors.border}`,
          }}>
            <img
              src={image}
              alt="Preview"
              style={{
                maxWidth: "100%",
                maxHeight: "300px",
                borderRadius: 8,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
              }}
            />
          </div>
        </div>
      );
    }
    
    if (fileType === "video") {
      return (
        <div style={{ marginBottom: 16, textAlign: "center" }}>
          <div style={{
            padding: 12,
            background: themeColors.surface,
            borderRadius: 12,
            border: `1px solid ${themeColors.border}`,
          }}>
            <video
              controls
              src={image}
              style={{
                maxWidth: "100%",
                maxHeight: "300px",
                borderRadius: 8,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
              }}
            />
          </div>
        </div>
      );
    }
    
    return null;
  };

  return (
    <Modal
      title={
        <div style={{ 
          borderBottom: `2px solid ${themeColors.primary}`, 
          paddingBottom: 8,
          marginBottom: 8
        }}>
          <Title level={4} style={{ margin: 0, color: themeColors.textPrimary }}>
            Create New Post
          </Title>
          <Text type="secondary" style={{ fontSize: 14 }}>
            Share your thoughts with the community
          </Text>
        </div>
      }
      onCancel={handleCancel}
      footer={null}
      visible={state.createPostModalOpened}
      width={600}
      centered
      destroyOnClose
      bodyStyle={{ 
        padding: "24px",
        background: themeColors.cardBg,
        borderRadius: 12 
      }}
      style={{ 
        borderRadius: 16,
        overflow: "hidden" 
      }}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit} requiredMark="optional">
        <Form.Item
          name="contentDescription"
          label={
            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={{ marginRight: 8, color: themeColors.textPrimary, fontWeight: 500 }}>
                What's on your mind?
              </span>
              <Tooltip title="Share your thoughts, ideas, or questions">
                <InfoCircleOutlined style={{ color: themeColors.textSecondary }} />
              </Tooltip>
            </div>
          }
          rules={[
            { required: true, message: "Please enter content description" },
          ]}
        >
          <Input.TextArea
            rows={4}
            placeholder="What would you like to share?"
            style={{ 
              borderRadius: 8, 
              borderColor: themeColors.border,
              padding: "12px",
              fontSize: "15px",
              resize: "vertical",
              boxShadow: "none",
              transition: "all 0.3s ease"
            }}
          />
        </Form.Item>
        
        <Divider style={{ margin: "16px 0", borderColor: themeColors.border }} />
        
        <div style={{ 
          display: "flex", 
          flexDirection: "column",
          background: themeColors.surface,
          padding: "16px",
          borderRadius: 12,
          marginBottom: 16
        }}>
          <Form.Item
            name="mediaLink"
            label={
              <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ marginRight: 8, color: themeColors.textPrimary, fontWeight: 500 }}>
                  Add Media
                </span>
                <Tooltip title="Upload an image or video to enhance your post">
                  <InfoCircleOutlined style={{ color: themeColors.textSecondary }} />
                </Tooltip>
              </div>
            }
            rules={[{ required: true, message: "Please upload an image or video" }]}
            style={{ marginBottom: imageUploading ? 8 : 0 }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <Upload
                accept="image/*,video/*"
                onChange={handleFileChange}
                showUploadList={false}
                beforeUpload={() => false}
                maxCount={1}
              >
                <Button 
                  icon={image ? (fileType === "image" ? <FileImageOutlined /> : <VideoCameraOutlined />) : <UploadOutlined />}
                  disabled={imageUploading}
                  style={{
                    borderRadius: 8,
                    background: image ? themeColors.success : themeColors.primary,
                    borderColor: image ? themeColors.success : themeColors.primary,
                    color: "white",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 2px 6px rgba(71, 118, 230, 0.2)",
                    transition: "all 0.3s ease"
                  }}
                >
                  {imageUploading ? "Uploading..." : image ? `${fileType} Uploaded` : "Upload Media"}
                </Button>
              </Upload>
              
              {image && (
                <Text type="success" style={{ fontSize: 14 }}>
                  Media ready to share!
                </Text>
              )}
            </div>
          </Form.Item>
          
          {imageUploading && (
            <div style={{ 
              textAlign: "center", 
              margin: "8px 0", 
              padding: "8px",
              background: "rgba(0, 191, 255, 0.1)",
              borderRadius: 8
            }}>
              <Text style={{ color: themeColors.primary }}>
                Media is uploading, please wait...
              </Text>
            </div>
          )}
        </div>
        
        <MediaPreview />
        
        <Form.Item style={{ marginBottom: 0, marginTop: 16 }}>
          <Space style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button 
              onClick={handleCancel}
              style={{
                borderRadius: 8,
                height: "40px",
                padding: "0 16px"
              }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              disabled={imageUploading || !image}
              style={{
                background: themeColors.gradient,
                borderColor: themeColors.primary,
                borderRadius: 8,
                height: "40px",
                padding: "0 20px",
                boxShadow: "0 4px 12px rgba(71, 118, 230, 0.3)",
                transition: "all 0.3s ease"
              }}
            >
              {loading ? "Creating..." : "Create Post"}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreatePostModal;