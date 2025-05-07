import React, { useEffect, useState } from "react";
import "../../Styles/center_section.css";
import StoryBox from "./StoryBox";
import MyPost from "./MyPostBox";
import FriendsPost from "./FriendsPost";
import { useSnapshot } from "valtio";
import state from "../../Utils/Store";
import PostService from "../../Services/PostService";
import LearningProgressBox from "./LearningProgressBox";
import LearningProgressCard from "./LearningProgressCard";
import CreaetSkillShareBox from "./SkillShareBox";
import SkillShareCard from "./SkillShareCard";
import FriendsSection from "./FriendsSection";
import NotificationsDropdown from "./NotificationsDropdown";
import { Avatar, Row, Col, Spin } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CommentOutlined, 
  LineChartOutlined, 
  BulbOutlined, 
  TeamOutlined,
  PlusCircleFilled
} from "@ant-design/icons";

// New color theme definition
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

const CenterSection = () => {
  const snap = useSnapshot(state);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("1");

  useEffect(() => {
    PostService.getPosts()
      .then((result) => {
        state.posts = result;
        setTimeout(() => setLoading(false), 800); // Add slight delay for animation effect
      })
      .catch((err) => {
        console.error("Error fetching posts:", err);
        setLoading(false);
      });
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const pulseAnimation = {
    scale: [1, 1.05, 1],
    transition: { duration: 2, repeat: Infinity, repeatType: "reverse" }
  };

  const tabItems = [
    { key: "1", title: "Comment & Feedback", icon: <CommentOutlined /> },
    { key: "2", title: "Learning Progress Updates", icon: <LineChartOutlined /> },
    { key: "3", title: "SkillShare", icon: <BulbOutlined /> },
    { key: "4", title: "Friends", icon: <TeamOutlined /> }
  ];

  return (
    <motion.div 
      className="center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      style={{
        width: "100%",
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "0 16px"
      }}
    >
      {/* Keeping the original nav section exactly as it was */}
      <nav>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "1.5rem",
            fontWeight: 600,
          }}
        >
          <img style={{ maxHeight: 60 }} src="/assets/learnloop.svg" alt="logo" />
          learnloop
        </div>
        <Avatar
          style={{
            cursor: "pointer",
            border: "5px solidrgb(223, 27, 86)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
          }}
          onClick={() => {
            state.profileModalOpend = true;
          }}
          size={60}
          src={snap.currentUser?.image}
        />
      </nav>

      <motion.div variants={fadeInUp} initial="hidden" animate="visible">
        <StoryBox />
      </motion.div>

      <motion.div 
        variants={fadeInUp} 
        initial="hidden" 
        animate="visible"
        transition={{ delay: 0.3 }}
        style={{
          backgroundColor: themeColors.cardBg,
          borderRadius: "12px",
          padding: "20px",
          boxShadow: `0 8px 24px ${themeColors.shadow}`,
          marginBottom: "24px",
          border: `1px solid ${themeColors.border}`
        }}
      >
        <NotificationsDropdown />

        {/* Custom Animated Tab Bar */}
        <div className="custom-tabs-container" style={{ marginBottom: "20px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              borderBottom: `2px solid ${themeColors.border}`,
              position: "relative",
              overflow: "hidden",
              margin: "20px 0"
            }}
          >
            {tabItems.map((tab) => (
              <motion.div
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                whileHover={{ 
                  scale: 1.05,
                  backgroundColor: `${themeColors.shadow}`
                }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: "12px 16px",
                  cursor: "pointer",
                  fontWeight: 600,
                  position: "relative",
                  flex: 1,
                  textAlign: "center",
                  borderBottom: tab.key === activeTab 
                    ? `3px solid ${themeColors.primary}` 
                    : "3px solid transparent",
                  color: tab.key === activeTab 
                    ? themeColors.primary 
                    : themeColors.textSecondary,
                  transition: "all 0.3s ease"
                }}
              >
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: Number(tab.key) * 0.1 }}
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}
                >
                  <motion.div
                    animate={tab.key === activeTab 
                      ? { scale: [1, 1.2, 1], rotate: [0, 5, 0, -5, 0] } 
                      : {}}
                    transition={{ duration: 0.5 }}
                    style={{ fontSize: "20px" }}
                  >
                    {tab.icon}
                  </motion.div>
                  <span>{tab.title}</span>
                  
                  {tab.key === activeTab && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: "3px",
                        backgroundColor: themeColors.primary
                      }}
                    />
                  )}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Tab Content with Animations */}
        <AnimatePresence mode="wait">
          {activeTab === "1" && (
            <motion.div
              key="tab1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {loading ? (
                <div style={{ textAlign: "center", padding: "40px" }}>
                  <Spin size="large" />
                </div>
              ) : (
                <motion.div variants={staggerContainer} initial="hidden" animate="visible">
                  <motion.div variants={fadeInUp}>
                    <MyPost />
                  </motion.div>
                  <motion.div variants={staggerContainer}>
                    {snap.posts.map((post, index) => (
                      <motion.div 
                        key={post?.id} 
                        variants={fadeInUp}
                        custom={index}
                        whileHover={{ scale: 1.01, boxShadow: `0 8px 24px ${themeColors.shadow}` }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <FriendsPost post={post} />
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
          )}

          {activeTab === "2" && (
            <motion.div
              key="tab2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div variants={staggerContainer} initial="hidden" animate="visible">
                <motion.div variants={fadeInUp}>
                  <LearningProgressBox />
                </motion.div>
                <motion.div variants={staggerContainer}>
                  {snap.LearningProgresss.map((plan, index) => (
                    <motion.div 
                      key={plan.id} 
                      variants={fadeInUp}
                      custom={index}
                      whileHover={{ scale: 1.02, y: -5 }}
                    >
                      <LearningProgressCard plan={plan} />
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </motion.div>
          )}

          {activeTab === "3" && (
            <motion.div
              key="tab3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div variants={staggerContainer} initial="hidden" animate="visible">
                <motion.div variants={fadeInUp}>
                  <CreaetSkillShareBox />
                </motion.div>
                <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
                  {snap.SkillShares.map((plan, index) => (
                    <Col xs={24} sm={12} md={8} key={plan.id}>
                      <motion.div 
                        variants={fadeInUp}
                        custom={index}
                        whileHover={{ 
                          y: -10,
                          boxShadow: `0 12px 24px ${themeColors.shadow}`
                        }}
                      >
                        <SkillShareCard plan={plan} />
                      </motion.div>
                    </Col>
                  ))}
                </Row>
              </motion.div>
            </motion.div>
          )}

          {activeTab === "4" && (
            <motion.div
              key="tab4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div variants={staggerContainer} initial="hidden" animate="visible">
                <FriendsSection />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      
      <motion.div 
        animate={pulseAnimation}
        whileHover={{ scale: 1.1, boxShadow: `0 12px 24px ${themeColors.shadow}` }}
        whileTap={{ scale: 0.9 }}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "60px",
          height: "60px",
          backgroundColor: themeColors.primary,
          borderRadius: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: `0 8px 16px ${themeColors.shadow}`,
          color: themeColors.cardBg,
          fontSize: "24px",
          cursor: "pointer",
          zIndex: 1000
        }}
      >
        <PlusCircleFilled style={{ fontSize: "24px", color: themeColors.cardBg }} />
      </motion.div>
    </motion.div>
  );
};

export default CenterSection;