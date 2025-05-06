import React, { useState } from "react";
import {
  Modal,
  Upload,
  Input,
  Button,
  DatePicker,
  message,
  Select,
  Form,
  Slider,
  Typography,
  Card,
  Divider,
  Row,
  Col,
  Tag,
  Tooltip
} from "antd";
import { 
  UploadOutlined, 
  ClockCircleOutlined, 
  FireOutlined,
  CalendarOutlined,
  EditOutlined,
  TagOutlined,
  ExperimentOutlined,
  BulbOutlined,
  BookOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  PictureOutlined
} from "@ant-design/icons";
import { useSnapshot } from "valtio";
import state from "../../Utils/Store";
import UploadFileService from "../../Services/UploadFileService";
import StoryService from "../../Services/StoryService";
import moment from "moment";

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
const { Option } = Select;
const { Text, Title } = Typography;

const CreateStoryModal = () => {
  const snap = useSnapshot(state);
  const [imageUploading, setImageUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [showPreview, setShowPreview] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    timestamp: null,
    exerciseType: "",
    timeDuration: 30,
    intensity: "",
    image: "",
    category: "Beginner"
  });

  // Duration markers for slider
  const durationMarks = {
    0: '0',
    30: '30',
    60: '60',
    90: '90',
    120: '120'
  };

  // Function to get intensity color based on value
  const getIntensityColor = (intensity) => {
    switch(intensity) {
      case "No Efforts": return '#52c41a';
      case "Mid Efforts": return '#1890ff';
      case "Moderate Efforts": return '#faad14';
      case "Severe Efforts": return '#f5222d';
      case "Maximal Efforts": return '#722ed1';
      default: return themeColors.textSecondary;
    }
  };

  const handleCreateWorkoutStory = async () => {
    try {
      setLoading(true);
      const body = {
        ...formData,
        image: uploadedImage,
        userId: snap.currentUser?.uid,
      };
      
      await StoryService.createWorkoutStory(body);
      state.storyCards = await StoryService.getAllWorkoutStories();
      message.success("Learning Plan created successfully");
      
      // Reset form and modal
      form.resetFields();
      setUploadedImage(null);
      setShowPreview(false);
      state.createWorkoutStatusModalOpened = false;
    } catch (error) {
      message.error("Error creating Learning Plan");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (info) => {
    if (info.file) {
      setImageUploading(true);
      try {
        const url = await uploader.uploadFile(
          info.fileList[0].originFileObj,
          "workoutStories"
        );
        setUploadedImage(url);
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setImageUploading(false);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      timestamp: date,
    });
  };

  const handleIntensityChange = (value) => {
    setFormData({
      ...formData,
      intensity: value,
    });
  };

  const handleCategoryChange = (value) => {
    setFormData({
      ...formData,
      category: value,
    });
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  const renderContent = () => {
    if (showPreview) {
      return (
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <Title level={5} style={{ color: themeColors.primary, margin: 0 }}>
              Plan Preview
            </Title>
            <Button 
              type="link" 
              onClick={togglePreview}
              icon={<EditOutlined />}
            >
              Back to Edit
            </Button>
          </div>
          
          {uploadedImage ? (
            <div style={{ 
              borderRadius: '16px', 
              overflow: 'hidden',
              boxShadow: '0 8px 24px rgba(119, 90, 218, 0.15)',
              marginBottom: '24px',
              position: 'relative'
            }}>
              <img
                style={{ 
                  width: "100%", 
                  height: "280px",
                  objectFit: 'cover'
                }}
                src={uploadedImage}
                alt="Learning Plan"
              />
            </div>
          ) : (
            <div style={{
              margin: '20px 0 30px',
              border: `2px dashed ${themeColors.border}`,
              borderRadius: '16px',
              padding: '60px 0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: themeColors.surface
            }}>
              <PictureOutlined style={{ fontSize: '32px', color: themeColors.primary, marginBottom: '16px' }} />
              <Text type="secondary">No image uploaded</Text>
            </div>
          )}
          
          <Card style={{ 
            borderRadius: '12px', 
            borderColor: themeColors.border,
            background: themeColors.background
          }}>
            <div style={{ textAlign: 'left' }}>
              <Title level={5}>Plan Summary</Title>
              <Row gutter={[16, 8]}>
                <Col span={8}><Text type="secondary">Title:</Text></Col>
                <Col span={16}><Text strong>{formData.title || "Not specified"}</Text></Col>
                
                <Col span={8}><Text type="secondary">Type:</Text></Col>
                <Col span={16}><Text>{formData.exerciseType || "Not specified"}</Text></Col>
                
                <Col span={8}><Text type="secondary">Duration:</Text></Col>
                <Col span={16}>
                  <Text>{formData.timeDuration} minutes</Text>
                </Col>
                
                <Col span={8}><Text type="secondary">Difficulty:</Text></Col>
                <Col span={16}>
                  <Tag color={getIntensityColor(formData.intensity)}>
                    {formData.intensity || "Not specified"}
                  </Tag>
                </Col>
                
                <Col span={8}><Text type="secondary">Category:</Text></Col>
                <Col span={16}>
                  <Tag color={
                    formData.category === "Beginner" ? "green" :
                    formData.category === "Intermediate" ? "blue" :
                    formData.category === "Advanced" ? "purple" : "red"
                  }>
                    {formData.category}
                  </Tag>
                </Col>
              </Row>
            </div>
          </Card>
        </div>
      );
    } else {
      return (
        <div>
          <Title level={5} style={{ color: themeColors.primary, marginBottom: '16px' }}>
            Create Learning Plan
          </Title>
          
          <Row gutter={24}>
            <Col span={16}>
              <Form.Item 
                label={
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    <EditOutlined style={{ marginRight: '8px', color: themeColors.primary }} />
                    Title
                  </span>
                } 
                name="title" 
                rules={[{ required: true, message: 'Please input a title' }]}
              >
                <Input
                  placeholder="Enter plan title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  style={{ borderRadius: '8px' }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item 
                label={
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    <CalendarOutlined style={{ marginRight: '8px', color: themeColors.primary }} />
                    Start Date
                  </span>
                } 
                name="timestamp"
              >
                <DatePicker
                  placeholder="Select date"
                  style={{ width: "100%", borderRadius: '8px' }}
                  value={formData.timestamp}
                  onChange={handleDateChange}
                />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item 
                label={
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    <TagOutlined style={{ marginRight: '8px', color: themeColors.primary }} />
                    Learning Type
                  </span>
                } 
                name="exerciseType"
              >
                <Input
                  placeholder="What type of learning?"
                  name="exerciseType"
                  value={formData.exerciseType}
                  onChange={handleInputChange}
                  style={{ borderRadius: '8px' }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                label={
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    <ExperimentOutlined style={{ marginRight: '8px', color: themeColors.primary }} />
                    Category
                  </span>
                } 
                name="category"
              >
                <Select
                  placeholder="Select category"
                  style={{ width: "100%", borderRadius: '8px' }}
                  value={formData.category}
                  onChange={handleCategoryChange}
                  dropdownStyle={{ borderRadius: '8px' }}
                >
                  <Option value="Beginner">
                    <Tag color="green">Beginner</Tag>
                  </Option>
                  <Option value="Intermediate">
                    <Tag color="blue">Intermediate</Tag>
                  </Option>
                  <Option value="Advanced">
                    <Tag color="purple">Advanced</Tag>
                  </Option>
                  <Option value="Expert">
                    <Tag color="red">Expert</Tag>
                  </Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item 
            label={
              <span style={{ display: 'flex', alignItems: 'center' }}>
                <BulbOutlined style={{ marginRight: '8px', color: themeColors.primary }} />
                Description
              </span>
            } 
            name="description"
          >
            <Input.TextArea
              placeholder="Add some details about this learning plan..."
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              style={{ borderRadius: '8px' }}
            />
          </Form.Item>
          
          <Form.Item 
            label={
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  <ClockCircleOutlined style={{ marginRight: '8px', color: themeColors.primary }} />
                  Study Time
                </span>
                <Text 
                  strong 
                  style={{ 
                    color: formData.timeDuration > 60 ? '#f5222d' : formData.timeDuration > 30 ? '#faad14' : '#52c41a',
                  }}
                >
                  {formData.timeDuration} minutes
                </Text>
              </div>
            }
            name="timeDuration"
            style={{ marginBottom: 24 }}
          >
            <div style={{ 
              backgroundColor: themeColors.surface,
              padding: '24px 16px 8px',
              borderRadius: '12px',
              border: `1px solid ${themeColors.border}`,
            }}>
              <Slider
                min={0}
                max={120}
                step={5}
                value={formData.timeDuration}
                marks={durationMarks}
                tooltip={{ formatter: value => `${value} min` }}
                trackStyle={{ backgroundColor: themeColors.primary }}
                handleStyle={{ borderColor: themeColors.primary }}
                onChange={(value) => {
                  setFormData({
                    ...formData,
                    timeDuration: value,
                  });
                }}
              />
            </div>
          </Form.Item>

          <Form.Item 
            label={
              <span style={{ display: 'flex', alignItems: 'center' }}>
                <FireOutlined style={{ marginRight: '8px', color: themeColors.primary }} />
                Difficulty Level
              </span>
            } 
            name="intensity"
          >
            <div className="intensity-selection">
              <Row gutter={[12, 12]}>
                {["No Efforts", "Mid Efforts", "Moderate Efforts", "Severe Efforts", "Maximal Efforts"].map((level) => (
                  <Col key={level} xs={12} md={8} lg={formData.intensity === level ? 8 : 4}>
                    <Card
                      onClick={() => handleIntensityChange(level)}
                      style={{ 
                        cursor: 'pointer',
                        borderRadius: '8px',
                        borderColor: formData.intensity === level ? getIntensityColor(level) : themeColors.border,
                        background: formData.intensity === level ? `${getIntensityColor(level)}10` : themeColors.cardBg,
                        transition: 'all 0.3s ease',
                        transform: formData.intensity === level ? 'scale(1.05)' : 'scale(1)',
                      }}
                      bodyStyle={{ padding: '10px' }}
                    >
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        justifyContent: 'center', 
                        flexDirection: 'column'
                      }}>
                        <FireOutlined style={{ 
                          fontSize: '18px', 
                          color: getIntensityColor(level),
                          marginBottom: '4px'
                        }} />
                        {formData.intensity === level ? (
                          <Text strong style={{ color: getIntensityColor(level), fontSize: '12px', textAlign: 'center' }}>
                            {level}
                          </Text>
                        ) : (
                          <Tooltip title={level}>
                            <div style={{ height: '16px', width: '16px', overflow: 'hidden' }}></div>
                          </Tooltip>
                        )}
                        {formData.intensity === level && (
                          <CheckCircleOutlined style={{ color: getIntensityColor(level), marginTop: '4px' }} />
                        )}
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          </Form.Item>
          
          <Form.Item label={
            <span style={{ display: 'flex', alignItems: 'center' }}>
              <PictureOutlined style={{ marginRight: '8px', color: themeColors.primary }} />
              Plan Image
            </span>
          }>
            {uploadedImage ? (
              <div style={{ 
                borderRadius: '16px', 
                overflow: 'hidden',
                boxShadow: '0 8px 24px rgba(119, 90, 218, 0.15)',
                marginBottom: '8px',
                position: 'relative'
              }}>
                <img
                  style={{ 
                    width: "100%", 
                    height: "200px",
                    objectFit: 'cover'
                  }}
                  src={uploadedImage}
                  alt="Learning Plan"
                />
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '40px 16px 16px',
                  background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
                  display: 'flex',
                  justifyContent: 'center'
                }}>
                  <Upload
                    accept="image/*"
                    onChange={handleFileChange}
                    showUploadList={false}
                    beforeUpload={() => false}
                  >
                    <Button 
                      icon={<UploadOutlined />} 
                      type="primary"
                      ghost
                      style={{ 
                        borderColor: 'white', 
                        color: 'white',
                        borderRadius: '8px'
                      }}
                    >
                      Change Image
                    </Button>
                  </Upload>
                </div>
              </div>
            ) : (
              <div style={{
                margin: '8px 0',
                border: `2px dashed ${themeColors.border}`,
                borderRadius: '16px',
                padding: '30px 0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: themeColors.surface
              }}>
                {imageUploading ? (
                  <Text>Uploading image...</Text>
                ) : (
                  <Upload
                    accept="image/*"
                    onChange={handleFileChange}
                    showUploadList={false}
                    beforeUpload={() => false}
                  >
                    <div style={{ textAlign: 'center' }}>
                      <PictureOutlined style={{ fontSize: '32px', color: themeColors.primary, marginBottom: '16px' }} />
                      <div>
                        <Text strong style={{ fontSize: '16px', color: themeColors.primary }}>Upload Plan Image</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: '13px' }}>This will be displayed on your learning plan card</Text>
                      </div>
                      <Button
                        type="primary"
                        style={{
                          marginTop: '16px',
                          borderRadius: '8px',
                          background: themeColors.gradient,
                          border: 'none'
                        }}
                      >
                        Browse Images
                      </Button>
                    </div>
                  </Upload>
                )}
              </div>
            )}
          </Form.Item>
        </div>
      );
    }
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{
            width: 4,
            height: 24,
            background: themeColors.primary,
            marginRight: 12,
            borderRadius: 2
          }} />
          <Title level={4} style={{ margin: 0, color: themeColors.textPrimary }}>
            Create Learning Plan
          </Title>
        </div>
      }
      open={snap.createWorkoutStatusModalOpened}
      onCancel={() => {
        state.createWorkoutStatusModalOpened = false;
        setShowPreview(false);
      }}
      width={700}
      bodyStyle={{ 
        padding: '24px', 
        backgroundColor: themeColors.background,
        borderRadius: '12px'
      }}
      footer={null}
      centered
    >
      <Card 
        bordered={false} 
        style={{ 
          background: themeColors.cardBg,
          borderRadius: '12px',
          boxShadow: '0 8px 24px rgba(119, 90, 218, 0.12)',
          maxHeight: '70vh',  // Limit height
          overflow: 'auto'    // Enable scrolling
        }}
      >
        <Form 
          form={form} 
          layout="vertical"
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '16px' 
          }}
        >
          {renderContent()}
          
          <div 
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              marginTop: '24px'
            }}
          >
            <Button 
              onClick={() => (state.createWorkoutStatusModalOpened = false)}
              style={{
                borderRadius: '8px',
              }}
            >
              Cancel
            </Button>
            
            {showPreview ? (
              <Button
                loading={loading}
                type="primary"
                onClick={handleCreateWorkoutStory}
                style={{
                  background: themeColors.gradient,
                  borderColor: themeColors.primary,
                  borderRadius: '8px',
                  boxShadow: "0 4px 12px rgba(119, 90, 218, 0.2)"
                }}
              >
                Create Learning Plan
              </Button>
            ) : (
              <Button
                type="primary"
                onClick={togglePreview}
                style={{
                  background: themeColors.gradient,
                  borderColor: themeColors.primary,
                  borderRadius: '8px',
                  boxShadow: "0 4px 12px rgba(119, 90, 218, 0.2)"
                }}
              >
                Preview <EyeOutlined />
              </Button>
            )}
          </div>
        </Form>
      </Card>
    </Modal>
  );
};

export default CreateStoryModal;