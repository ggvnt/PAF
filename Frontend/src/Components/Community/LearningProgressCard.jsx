import React, { useState } from "react";
import { Card, Button, Row, Col, Typography, Space, Divider, Tag, Tooltip, Progress, Dropdown } from "antd";
import { useSnapshot } from "valtio";
import state from "../../Utils/Store";
import { 
  EditOutlined, 
  DeleteOutlined, 
  InfoCircleOutlined, 
  AimOutlined, 
  BookOutlined,
  PlusOutlined,
  ShareAltOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  TrophyOutlined
} from "@ant-design/icons";
import LearningProgressService from "../../Services/LearningProgressService";

const { Title, Text, Paragraph } = Typography;

// Theme colors - unchanged as requested
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
const LearningProgressCard = ({ plan }) => {
  const snap = useSnapshot(state);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  
  // Calculate progress percentage based on completed items or default value
  const progressPercentage = plan.completedItems ? 
    Math.round((plan.completedItems / plan.totalItems) * 100) : 25; // Example default
  
  const deletePlan = async () => {
    try {
      setDeleteLoading(true);
      await LearningProgressService.deleteLearningProgress(plan.id);
      state.LearningProgresss = await LearningProgressService.getAllLearningProgresss();
    } catch (error) {
      console.error("Failed to delete Learning Progress:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const updateTemplates = [
    { key: 'tutorial', text: 'Completed Tutorial', icon: <BookOutlined /> },
    { key: 'skill', text: 'New Skill Learned', icon: <TrophyOutlined /> },
    { key: 'milestone', text: 'Reached Milestone', icon: <CheckCircleOutlined /> }
  ];

 

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        marginBottom: 24,
        cursor: "pointer",
        transition: "all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)",
      }}
      onClick={() => setExpanded(!expanded)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Side Progress Indicator */}
      <div 
        style={{
          position: "absolute",
          left: "-4px",
          top: 0,
          bottom: 0,
          width: "8px",
          borderRadius: "4px",
          background: "#E0E6F0",
          zIndex: 2,
          overflow: "hidden"
        }}
      >
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: `${progressPercentage}%`,
            background: progressPercentage === 100 ? themeColors.success : themeColors.primary,
            transition: "height 1s cubic-bezier(0.34, 1.56, 0.64, 1)"
          }}
        />
      </div>

      {/* Main Card Content */}
      <div
        style={{
          borderRadius: "16px",
          padding: expanded ? "0" : "0",
          marginLeft: "16px",
          background: themeColors.cardBg,
          boxShadow: isHovered || expanded
            ? "0 20px 40px rgba(71, 118, 230, 0.15)"
            : "0 8px 16px rgba(71, 118, 230, 0.08)",
          transition: "all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)",
          transform: expanded ? "scale(1.02)" : isHovered ? "scale(1.01)" : "scale(1)",
          overflow: "hidden",
          border: "none"
        }}
      >
        {/* Card Header */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          padding: "24px 28px",
          position: "relative",
          background: themeColors.cardBg,
        }}>
          {/* Top Row with Title and Status */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px"
          }}>
            <Space direction="vertical" size={2}>
              <Row align="middle" gutter={8}>
                <Col>
                  <div style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "6px",
                    background: progressPercentage === 100 ? themeColors.success : themeColors.primary,
                    marginRight: "8px"
                  }} />
                </Col>
                <Col>
                  <Title level={4} style={{ 
                    margin: 0,
                    fontSize: "20px",
                    fontWeight: 600,
                    color: themeColors.textPrimary,
                    transition: "transform 0.3s ease",
                    transform: isHovered ? "translateY(-2px)" : "translateY(0)"
                  }}>
                    {plan.planName}
                  </Title>
                </Col>
              </Row>
              {/* Category and Last Updated */}
              <Row align="middle" style={{ marginTop: "4px" }}>
                <Col>
                  <Tag style={{ 
                    borderRadius: "20px", 
                    background: "transparent",
                    border: `1px solid ${themeColors.border}`,
                    color: themeColors.textSecondary,
                    fontSize: "12px",
                    padding: "1px 12px",
                    marginRight: "8px"
                  }}>
                    {plan.category || "Learning Plan"}
                  </Tag>
                </Col>
                <Col>
                  <Text type="secondary" style={{ 
                    fontSize: "12px", 
                    display: "flex", 
                    alignItems: "center",
                    color: themeColors.textSecondary
                  }}>
                    <ClockCircleOutlined style={{ marginRight: "4px" }} />
                    {plan.lastUpdated || "2 days ago"}
                  </Text>
                </Col>
              </Row>
            </Space>
          </div>

          {/* Second Row with Progress Details */}
          {/* <div style={{ marginBottom: "16px" }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "8px"
            }}>
              <Text style={{ 
                color: themeColors.textPrimary, 
                fontWeight: 500,
                fontSize: "14px"
              }}>
                Progresszzzz
              </Text>
              <Text style={{ 
                color: themeColors.primary, 
                fontWeight: 600,
                fontSize: "14px"
              }}>
                {progressPercentage}%
              </Text>
            </div>
            
            <Progress 
              percent={progressPercentage} 
              showInfo={false}
              strokeColor={{
                from: themeColors.primary,
                to: themeColors.secondary
              }}
              strokeWidth={8}
              trailColor="#F0F5FF"
              style={{ 
                borderRadius: "4px",
                height: "8px"
              }}
            />
            
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "8px"
            }}>
              <Text style={{
                fontSize: "13px",
                color: themeColors.textSecondary
              }}>
                {plan.completedItems || 0} of {plan.totalItems || 0} items completed
              </Text>
              
              {!expanded && (
                <Button
                  type="text"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpanded(true);
                  }}
                  style={{
                    color: themeColors.primary,
                    fontSize: "13px",
                    padding: "4px 8px",
                    height: "auto"
                  }}
                >
                  View Details
                </Button>
              )}
            </div>
          </div> */}

          {/* Description Preview Section */}
          <div style={{
            background: themeColors.background,
            borderRadius: "12px",
            padding: "16px",
            marginBottom: expanded ? "16px" : "0"
          }}>
            <Row gutter={[8, 8]}>
              <Col span={24}>
                <Text strong style={{ 
                  fontSize: "14px", 
                  color: themeColors.primary, 
                  display: "block",
                  marginBottom: "8px"
                }}>
                  <InfoCircleOutlined style={{ marginRight: "8px" }} />
                  Description
                </Text>
                <Paragraph 
                  ellipsis={{ rows: expanded ? 5 : 2, expandable: false }}
                  style={{ 
                    fontSize: "14px",
                    color: themeColors.textPrimary,
                    lineHeight: "1.6",
                    marginBottom: 0
                  }}
                >
                  {plan.description}
                </Paragraph>
              </Col>
            </Row>
          </div>

          {/* Quick Actions for Collapsed View */}
          {!expanded && (
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between",
              marginTop: "16px"
            }}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  setExpanded(true);
                  setShowUpdateForm(true);
                }}
                style={{
                  borderRadius: "30px",
                  background: themeColors.primary,
                  border: "none",
                  height: "36px",
                  padding: "0 20px",
                  boxShadow: "0 6px 16px rgba(71, 118, 230, 0.2)",
                  transition: "all 0.3s"
                }}
              >
                Add Progress
              </Button>
              <Space>
                <Button
                  type="default"
                  icon={<ShareAltOutlined />}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    borderRadius: "30px",
                    border: `1px solid ${themeColors.border}`,
                    height: "36px",
                    width: "36px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 0
                  }}
                />
                {snap.currentUser?.uid === plan.userId && (
                  <Button
                    type="default"
                    icon={<EditOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      state.selectedLearningProgress = plan;
                      state.editLearningProgressOpened = true;
                    }}
                    style={{
                      borderRadius: "30px",
                      border: `1px solid ${themeColors.border}`,
                      height: "36px",
                      width: "36px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 0
                    }}
                  />
                )}
              </Space>
            </div>
          )}
        </div>

        {/* Expanded View Content */}
        {expanded && (
          <div>
            {/* Separator */}
            <div style={{
              height: "4px",
              background: themeColors.gradient,
              margin: "0"
            }} />

            {/* Content Area */}
            <div style={{
              padding: "24px 28px",
              background: themeColors.background
            }}>
              {/* Skills Section */}
              <div style={{
                background: "white",
                borderRadius: "16px",
                padding: "20px",
                marginBottom: "20px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)"
              }}>
                <Text strong style={{ 
                  fontSize: "16px", 
                  color: themeColors.primary, 
                  display: "flex", 
                  alignItems: "center",
                  marginBottom: "16px"
                }}>
                  <AimOutlined style={{ marginRight: "10px" }} />
                  New Skills Learned
                </Text>

                <Row gutter={[10, 10]}>
                  {(plan.routines ? plan.routines.split(',') : []).length > 0 ? (
                    (plan.routines.split(',').map((skill, index) => (
                      <Col key={index}>
                        <Tag 
                          color={
                            index % 4 === 0 ? themeColors.primary : 
                            index % 4 === 1 ? themeColors.secondary : 
                            index % 4 === 2 ? themeColors.accent : 
                            "#69c0ff"
                          } 
                          style={{ 
                            borderRadius: "30px", 
                            padding: "6px 16px", 
                            fontSize: "13px",
                            border: "none",
                            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                            fontWeight: 500,
                            margin: "4px"
                          }}
                        >
                          {skill.trim()}
                        </Tag>
                      </Col>
                    )))
                  ) : (
                    <Col span={24}>
                      <Text type="secondary" italic>No skills added yet</Text>
                    </Col>
                  )}
                </Row>
              </div>

              {/* Tutorials Section */}
              <div style={{
                background: "white",
                borderRadius: "16px",
                padding: "20px",
                marginBottom: "20px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)"
              }}>
                <Text strong style={{ 
                  fontSize: "16px", 
                  color: themeColors.primary, 
                  display: "flex", 
                  alignItems: "center",
                  marginBottom: "16px"
                }}>
                  <BookOutlined style={{ marginRight: "10px" }} />
                  Tutorials
                </Text>
                <Paragraph 
                  style={{ 
                    fontSize: "14px",
                    color: themeColors.textPrimary,
                    lineHeight: "1.6",
                    marginBottom: 0
                  }}
                >
                  {plan.goal || "Your learning tutorials and resources will appear here."}
                </Paragraph>
              </div>

              {/* Add Progress Form */}
              {showUpdateForm && (
                <div style={{
                  background: "white",
                  borderRadius: "16px",
                  padding: "20px",
                  marginBottom: "20px",
                  border: `2px dashed ${themeColors.secondary}`,
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)"
                }}>
                  <Text strong style={{ 
                    fontSize: "16px", 
                    color: themeColors.secondary, 
                    display: "flex", 
                    alignItems: "center",
                    marginBottom: "16px"
                  }}>
                    <PlusOutlined style={{ marginRight: "10px" }} />
                    Add Learning Progress Update
                  </Text>
                  
                  <Row gutter={[12, 12]}>
                    {updateTemplates.map(template => (
                      <Col key={template.key} xs={24} sm={8}>
                        <div 
                          style={{
                            border: `1px solid ${themeColors.border}`,
                            borderRadius: "12px",
                            padding: "16px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            cursor: "pointer",
                            transition: "all 0.3s",
                            background: "white",
                            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)",
                            height: "100%"
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log(`Selected template: ${template.key}`);
                          }}
                        >
                          <div style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "48px",
                            height: "48px",
                            borderRadius: "24px",
                            background: template.key === 'tutorial' ? `${themeColors.primary}10` : 
                                        template.key === 'skill' ? `${themeColors.secondary}10` : 
                                        `${themeColors.accent}10`,
                            color: template.key === 'tutorial' ? themeColors.primary : 
                                  template.key === 'skill' ? themeColors.secondary : 
                                  themeColors.accent,
                            fontSize: "20px",
                            marginBottom: "12px"
                          }}>
                            {template.icon}
                          </div>
                          <Text strong style={{
                            color: themeColors.textPrimary,
                            textAlign: "center"
                          }}>
                            {template.text}
                          </Text>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </div>
              )}

              {/* Action Buttons */}
              <Row gutter={16} align="middle" justify="space-between">
                <Col>
                  <Space size={12}>
                    <Button
                      type={showUpdateForm ? "default" : "primary"}
                      icon={showUpdateForm ? null : <PlusOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowUpdateForm(!showUpdateForm);
                      }}
                      style={{
                        borderRadius: "8px",
                        background: showUpdateForm ? "white" : themeColors.primary,
                        color: showUpdateForm ? themeColors.textPrimary : "white",
                        border: showUpdateForm ? `1px solid ${themeColors.border}` : "none",
                        height: "40px",
                        padding: "0 20px"
                      }}
                    >
                      {showUpdateForm ? "Cancel Update" : "Add Progress"}
                    </Button>
                    <Button
                      type="default"
                      icon={<ShareAltOutlined />}
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        borderRadius: "8px",
                        border: `1px solid ${themeColors.border}`,
                        height: "40px",
                        padding: "0 20px",
                        background: "white"
                      }}
                    >
                      Share Progress
                    </Button>
                  </Space>
                </Col>
                
                {snap.currentUser?.uid === plan.userId && (
                  <Col>
                    <Space size={12}>
                      <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          state.selectedLearningProgress = plan;
                          state.editLearningProgressOpened = true;
                        }}
                        style={{
                          borderRadius: "8px",
                          background: themeColors.primary,
                          border: "none",
                          height: "40px",
                          padding: "0 20px"
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        danger
                        type="primary"
                        icon={<DeleteOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          deletePlan();
                        }}
                        loading={deleteLoading}
                        style={{
                          borderRadius: "8px",
                          background: themeColors.danger,
                          border: "none",
                          height: "40px",
                          padding: "0 20px"
                        }}
                      >
                        Delete
                      </Button>
                    </Space>
                  </Col>
                )}
              </Row>

              {/* Close Expanded View Button */}
              <div style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "24px"
              }}>
                <Button
                  type="text"
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpanded(false);
                  }}
                  style={{
                    color: themeColors.textSecondary,
                    fontSize: "14px",
                    height: "auto",
                    padding: "4px 16px"
                  }}
                >
                  Close Details
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningProgressCard;