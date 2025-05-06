import React, { useState } from "react";
import { Modal, Form, Input, Button, Row, Col, Typography, Space, Divider, Tooltip } from "antd";
import { useSnapshot } from "valtio";
import state from "../../Utils/Store";
import SkillShareService from "../../Services/SkillShareService";
import UploadFileService from "../../Services/UploadFileService";
import { 
  UploadOutlined, 
  DeleteOutlined, 
  InboxOutlined,
  InfoCircleOutlined,
  ShareAltOutlined,
  FileImageOutlined
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;
const uploader = new UploadFileService();

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

const CreateSkillShareModal = () => {
  const snap = useSnapshot(state);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [mediaFiles, setMediaFiles] = useState([]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      // Call the service to create the Skill Share
      await SkillShareService.createSkillShare({
        ...values,
        userId: snap.currentUser?.uid,
        mediaUrls: mediaFiles.map(file => file.url),
        mediaTypes: mediaFiles.map(file => file.type)
      });
      state.SkillShares = await SkillShareService.getAllSkillShares();
      
      // Reset the form and close the modal on success
      form.resetFields();
      setMediaFiles([]);
      state.createSkillShareOpened = false;
    } catch (error) {
      console.error("Error creating Skill Share:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileInputChange = async (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;
    
    // Check if adding these files would exceed the limit
    if (mediaFiles.length + files.length > 3) {
      alert(`You can only upload up to 3 files in total. You've selected ${files.length} files but can only add ${3 - mediaFiles.length} more.`);
      // Reset the file input
      e.target.value = null;
      return;
    }
    
    setUploadingMedia(true);
    
    try {
      // Process all files in parallel
      const uploadPromises = files.map(async (file) => {
        const fileType = file.type.split("/")[0];
        
        // Validate video duration if it's a video
        if (fileType === "video") {
          const isValid = await validateVideoDuration(file);
          if (!isValid) {
            alert(`Video "${file.name}" must be 30 seconds or less`);
            return null;
          }
        }
        
        const url = await uploader.uploadFile(file, "posts");
        
        return {
          uid: Date.now() + Math.random().toString(36).substring(2, 9),
          url: url,
          type: fileType,
          name: file.name
        };
      });
      
      const results = await Promise.all(uploadPromises);
      const validResults = results.filter(result => result !== null);
      
      setMediaFiles(prev => [...prev, ...validResults]);
    } catch (error) {
      console.error("Error uploading files:", error);
    } finally {
      setUploadingMedia(false);
      // Reset the file input
      e.target.value = null;
    }
  };

  const validateVideoDuration = (file) => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      
      video.onloadedmetadata = function() {
        window.URL.revokeObjectURL(video.src);
        resolve(video.duration <= 30);
      };
      
      video.src = URL.createObjectURL(file);
    });
  };

  const removeMediaFile = (uid) => {
    setMediaFiles(prev => prev.filter(file => file.uid !== uid));
  };

  const renderMediaPreview = () => {
    return (
      <>
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          marginBottom: 12, 
          color: themeColors.primary,
          fontWeight: 600
        }}>
          <FileImageOutlined style={{ marginRight: 8 }} />
          <span>Uploaded Media Files ({mediaFiles.length}/3)</span>
        </div>
        <Row gutter={[16, 16]}>
          {mediaFiles.map(file => (
            <Col key={file.uid} span={8}>
              <div style={{ position: 'relative' }}>
                {file.type === 'image' ? (
                  <img 
                    src={file.url} 
                    alt={file.name}
                    style={{ 
                      width: '100%', 
                      height: 120, 
                      objectFit: 'cover', 
                      borderRadius: 8,
                      border: `1px solid ${themeColors.border}`
                    }}
                  />
                ) : (
                  <video 
                    src={file.url} 
                    controls
                    style={{ 
                      width: '100%', 
                      height: 120, 
                      objectFit: 'cover', 
                      borderRadius: 8,
                      border: `1px solid ${themeColors.border}`
                    }}
                  />
                )}
                <Button 
                  type="text" 
                  danger 
                  icon={<DeleteOutlined />} 
                  onClick={() => removeMediaFile(file.uid)}
                  style={{ 
                    position: 'absolute', 
                    top: 0, 
                    right: 0,
                    background: 'rgba(255, 255, 255, 0.7)',
                    borderRadius: 8
                  }}
                />
              </div>
            </Col>
          ))}
        </Row>
      </>
    );
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (uploadingMedia || mediaFiles.length >= 3) return;
    
    const files = Array.from(e.dataTransfer.files);
    
    // Check if adding these files would exceed the limit
    if (mediaFiles.length + files.length > 3) {
      alert(`You can only upload up to 3 files in total. You've dropped ${files.length} files but can only add ${3 - mediaFiles.length} more.`);
      return;
    }
    
    setUploadingMedia(true);
    
    try {
      // Process all files in parallel
      const uploadPromises = files.map(async (file) => {
        // Check if file is image or video
        if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
          alert(`File "${file.name}" is not an image or video.`);
          return null;
        }
        
        const fileType = file.type.split("/")[0];
        
        // Validate video duration if it's a video
        if (fileType === "video") {
          const isValid = await validateVideoDuration(file);
          if (!isValid) {
            alert(`Video "${file.name}" must be 30 seconds or less`);
            return null;
          }
        }
        
        const url = await uploader.uploadFile(file, "posts");
        
        return {
          uid: Date.now() + Math.random().toString(36).substring(2, 9),
          url: url,
          type: fileType,
          name: file.name
        };
      });
      
      const results = await Promise.all(uploadPromises);
      const validResults = results.filter(result => result !== null);
      
      setMediaFiles(prev => [...prev, ...validResults]);
    } catch (error) {
      console.error("Error uploading files:", error);
    } finally {
      setUploadingMedia(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setMediaFiles([]);
    state.createSkillShareOpened = false;
  };

  return (
    <Modal
      title={
        <div style={{ 
          borderBottom: `2px solid ${themeColors.secondary}`, 
          paddingBottom: 8,
          marginBottom: 8
        }}>
          <Title level={4} style={{ margin: 0, color: themeColors.textPrimary }}>
            Share Your Skills
          </Title>
          <Text type="secondary" style={{ fontSize: 14 }}>
            Show your expertise and inspire the community
          </Text>
        </div>
      }
      footer={null}
      open={snap.createSkillShareOpened}
      onCancel={handleCancel}
      width={550}
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
          name="mealDetails"
          label={
            <div style={{ display: "flex", alignItems: "center" }}>
              <ShareAltOutlined style={{ marginRight: 8, color: themeColors.primary }} />
              <span style={{ color: themeColors.textPrimary, fontWeight: 500 }}>Skill Description</span>
              <Tooltip title="Share detailed information about your skills or techniques">
                <InfoCircleOutlined style={{ marginLeft: 8, color: themeColors.textSecondary }} />
              </Tooltip>
            </div>
          }
          rules={[{ required: true, message: "Please share details about your skills" }]}
        >
          <Input.TextArea 
            placeholder="Describe your skills, techniques, or areas of expertise in detail" 
            rows={4}
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
        
        <div style={{ 
          background: themeColors.surface,
          padding: "16px",
          borderRadius: 12,
          marginBottom: 16,
          marginTop: 16
        }}>
          <Form.Item
            label={
              <div style={{ display: "flex", alignItems: "center" }}>
                <UploadOutlined style={{ marginRight: 8, color: themeColors.secondary }} />
                <span style={{ color: themeColors.textPrimary, fontWeight: 500 }}>Media Upload</span>
                <Tooltip title="Upload Max 3 photos or videos (max 30 sec) to showcase your skills">
                  <InfoCircleOutlined style={{ marginLeft: 8, color: themeColors.textSecondary }} />
                </Tooltip>
              </div>
            }
            rules={[{ required: mediaFiles.length === 0, message: "Please upload at least one media file" }]}
          >
            <div 
              style={{ 
                border: `2px dashed ${themeColors.border}`, 
                borderRadius: '8px', 
                padding: '20px', 
                textAlign: 'center',
                background: themeColors.background,
                cursor: mediaFiles.length >= 3 ? 'not-allowed' : 'pointer',
                position: 'relative'
              }}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <p><InboxOutlined style={{ fontSize: '48px', color: themeColors.primary }} /></p>
              <p style={{ margin: '8px 0', color: themeColors.textPrimary }}>
                Click or drag files to this area to upload
              </p>
              <p style={{ color: themeColors.textSecondary }}>
                {mediaFiles.length >= 3 ? 
                  "Maximum number of files reached" : 
                  `Select up to ${3 - mediaFiles.length} files at once. Supports images and videos.`}
              </p>
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileInputChange}
                disabled={mediaFiles.length >= 3 || uploadingMedia}
                style={{ 
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  opacity: 0,
                  cursor: mediaFiles.length >= 3 ? 'not-allowed' : 'pointer'
                }}
              />
            </div>
            {uploadingMedia && (
              <p style={{ 
                color: themeColors.secondary, 
                marginTop: 8,
                textAlign: 'center',
                fontStyle: 'italic'
              }}>
                Media is uploading, please wait...
              </p>
            )}
          </Form.Item>
          
          {mediaFiles.length > 0 && renderMediaPreview()}
        </div>
        
        <Divider style={{ margin: "16px 0", borderColor: themeColors.border }} />
        
        <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
          <Space style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button 
              onClick={handleCancel}
              style={{ 
                borderRadius: 8,
                borderColor: themeColors.border,
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
              disabled={mediaFiles.length === 0 || uploadingMedia}
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
              {loading ? "Sharing..." : "Share Skill"}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateSkillShareModal;