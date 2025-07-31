import streamlit as st
import cv2
import numpy as np
from enhanced_emotion_detector import EnhancedEmotionDetector
from standalone_analyzer import generate_full_analysis
from database_auth import DatabaseAuth
from collections import Counter
import pandas as pd
import os

# Page configuration
st.set_page_config(
    page_title="Mood Tracker - Real-Time Emotion Detection", 
    layout="wide",
    initial_sidebar_state="expanded"
)

# Initialize database authentication
auth = DatabaseAuth()

# Custom CSS for better styling
st.markdown("""
<style>
    .main-header {
        background: linear-gradient(90deg, #c4836b, #e6a085);
        padding: 1rem;
        border-radius: 10px;
        color: white;
        text-align: center;
        margin-bottom: 2rem;
    }
    .user-info {
        background: #f0f2f6;
        padding: 1rem;
        border-radius: 8px;
        border-left: 4px solid #c4836b;
    }
    .emotion-card {
        background: white;
        padding: 1rem;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        margin: 0.5rem 0;
    }
</style>
""", unsafe_allow_html=True)

# Authentication Section
if "authenticated" not in st.session_state:
    st.session_state.authenticated = False

if not st.session_state.authenticated:
    st.markdown('<div class="main-header"><h1>🧠 Mood Tracker - Login Required</h1></div>', unsafe_allow_html=True)
    
    st.markdown("### 🔐 Please Login with Your Account")
    st.info("Enter the email address you used to register on the main Mood Tracker website.")
    
    col1, col2 = st.columns([2, 1])
    
    with col1:
        email = st.text_input("📧 Email Address", placeholder="Enter your registered email")
        
    with col2:
        st.markdown("<br>", unsafe_allow_html=True)  # Add spacing
        login_btn = st.button("🚀 Login", type="primary")
    
    if login_btn and email:
        with st.spinner("Authenticating..."):
            if auth.authenticate_user(email):
                st.success(f"✅ Welcome back, {st.session_state.username}!")
                st.rerun()
            else:
                st.error("❌ User not found. Please check your email or register on the main website first.")
    
    st.markdown("---")
    st.markdown("### 📝 Don't have an account?")
    st.info("Please visit the main Mood Tracker website to create your account first, then return here to use the emotion detection feature.")
    
    st.stop()

# Main Application (Authenticated Users)
user_data = st.session_state.user_data
username = st.session_state.username

st.markdown(f'<div class="main-header"><h1>🧠 Real-Time Emotion Detection</h1><h3>Welcome, {username}!</h3></div>', unsafe_allow_html=True)

# User Information Sidebar
with st.sidebar:
    st.markdown(f'<div class="user-info"><h3>👤 User Profile</h3><p><strong>Name:</strong> {user_data["name"]}</p><p><strong>Email:</strong> {user_data["email"]}</p><p><strong>User ID:</strong> {user_data["id"]}</p></div>', unsafe_allow_html=True)
    
    if st.button("🚪 Logout"):
        for key in list(st.session_state.keys()):
            del st.session_state[key]
        st.rerun()

# Initialize detector
if "detector" not in st.session_state:
    st.session_state.detector = EnhancedEmotionDetector(user_data)

detector = st.session_state.detector

# Control buttons
col1, col2, col3 = st.columns([1, 1, 2])

with col1:
    start_detection = st.button("▶️ Start Detection", type="primary")

with col2:
    stop_detection = st.button("⛔ Stop Detection")

with col3:
    show_analysis = st.button("📊 Show Full Analysis")

# Session state for detection control
if "detection_running" not in st.session_state:
    st.session_state.detection_running = False

if start_detection:
    st.session_state.detection_running = True

if stop_detection:
    st.session_state.detection_running = False

# Main content area
if show_analysis:
    st.markdown("## 📈 Your Emotion Analysis")
    if os.path.exists(detector.CSV_FILE):
        generate_full_analysis(detector.CSV_FILE, key_prefix=f"user_{user_data['id']}")
    else:
        st.info("🆕 No emotion data found yet. Start detection to begin tracking your emotions!")

# Real-time detection
if st.session_state.detection_running:
    st.markdown("### 🎥 Live Emotion Detection")
    
    # Create placeholders
    video_placeholder = st.empty()
    emotion_placeholder = st.empty()
    stats_placeholder = st.empty()
    
    # Initialize webcam
    cap = cv2.VideoCapture(0)
    
    if not cap.isOpened():
        st.error("❌ Could not access webcam. Please check your camera permissions.")
        st.session_state.detection_running = False
    else:
        cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
        cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
        
        emotion_counter = Counter()
        frame_count = 0
        
        try:
            while st.session_state.detection_running:
                ret, frame = cap.read()
                if not ret:
                    st.error("❌ Failed to read from webcam")
                    break
                
                frame = cv2.flip(frame, 1)  # Mirror the frame
                
                # Analyze every 5th frame for performance
                if frame_count % 5 == 0:
                    emotion, confidence = detector.analyze_frame(frame)
                    
                    if confidence >= detector.confidence_threshold:
                        # Log significant emotion changes
                        if emotion != detector.current_emotion:
                            detector.log_emotion_change(emotion, confidence, frame)
                        
                        detector.current_emotion = emotion
                        detector.current_confidence = confidence
                        emotion_counter[emotion] += 1
                
                # Draw emotion info on frame
                if detector.current_emotion:
                    emoji = detector.emotion_emoji.get(detector.current_emotion, "🙂")
                    label = f"{emoji} {detector.current_emotion.upper()} ({detector.current_confidence:.1f}%)"
                else:
                    label = "🔍 Detecting..."
                
                frame = detector.draw_text_with_emoji(frame, label, 30, 60)
                
                # Convert BGR to RGB for Streamlit
                frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                video_placeholder.image(frame_rgb, channels="RGB", use_container_width=True)
                
                # Update emotion display
                if detector.current_emotion:
                    emotion_placeholder.markdown(f'<div class="emotion-card"><h2>{detector.emotion_emoji.get(detector.current_emotion, "🙂")} Current Emotion: {detector.current_emotion.upper()}</h2><p>Confidence: {detector.current_confidence:.1f}%</p></div>', unsafe_allow_html=True)
                
                # Update stats
                if emotion_counter:
                    stats_placeholder.bar_chart(emotion_counter)
                
                frame_count += 1
                
        except Exception as e:
            st.error(f"❌ Detection error: {e}")
        finally:
            cap.release()
            cv2.destroyAllWindows()

# Show user statistics
if not st.session_state.detection_running:
    st.markdown("### 📊 Your Emotion Statistics")
    stats = detector.get_emotion_stats()
    
    if stats:
        col1, col2, col3 = st.columns(3)
        
        with col1:
            st.metric("Total Detections", stats.get("total_detections", 0))
        
        with col2:
            if stats.get("emotion_counts"):
                most_common = max(stats["emotion_counts"], key=stats["emotion_counts"].get)
                st.metric("Most Common Emotion", most_common)
        
        with col3:
            st.metric("Avg Confidence", f"{stats.get('avg_confidence', 0):.1f}%")
        
        if stats.get("emotion_counts"):
            st.bar_chart(stats["emotion_counts"])
    else:
        st.info("🆕 No emotion data available yet. Start detection to begin tracking!")

# Footer
st.markdown("---")
st.markdown("### 💡 Tips for Better Detection")
st.markdown("""
- Ensure good lighting on your face
- Look directly at the camera
- Keep your face clearly visible
- Avoid covering your face with hands or objects
- Stay within the camera frame
""")
