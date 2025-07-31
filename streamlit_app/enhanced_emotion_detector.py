import cv2
from deepface import DeepFace
from PIL import Image, ImageFont, ImageDraw
import numpy as np
import os
import datetime
import csv
from collections import deque, Counter
import threading
import queue
import streamlit as st

class EnhancedEmotionDetector:
    def __init__(self, user_data: dict):
        self.user_data = user_data
        self.username = user_data["name"]
        self.user_id = user_data["id"]
        self.user_email = user_data["email"]

        self.emotion_emoji = {
            "happy": "😄", "sad": "😢", "angry": "😠", "fear": "😨",
            "disgust": "🤢", "surprise": "😲", "neutral": "😐"
        }

        # Try to load emoji font, fallback to default
        self.FONT_PATH = "C:/Windows/Fonts/seguiemj.ttf"
        if not os.path.exists(self.FONT_PATH):
            self.emoji_font = ImageFont.load_default()
        else:
            try:
                self.emoji_font = ImageFont.truetype(self.FONT_PATH, 40)
            except:
                self.emoji_font = ImageFont.load_default()

        self.emotion_history = deque(maxlen=3)
        self.confidence_history = deque(maxlen=3)
        self.confidence_threshold = 40

        # Create user-specific directories and files
        self.user_dir = f"logs/user_{self.user_id}_{self.username.replace(' ', '_')}"
        self.CSV_FILE = f"{self.user_dir}/emotion_log.csv"
        self.SNAPSHOTS_DIR = f"{self.user_dir}/snapshots"
        
        self.setup_files()

        self.current_emotion = None
        self.current_confidence = 0
        self.frame_count = 0

    def setup_files(self):
        """Create user-specific directories and CSV file"""
        os.makedirs(self.user_dir, exist_ok=True)
        os.makedirs(self.SNAPSHOTS_DIR, exist_ok=True)
        
        if not os.path.exists(self.CSV_FILE):
            with open(self.CSV_FILE, mode='w', newline='') as file:
                writer = csv.writer(file)
                writer.writerow([
                    "Timestamp", "Emotion", "Confidence", 
                    "User_ID", "Username", "Email"
                ])

    def preprocess_frame(self, frame):
        """Preprocess frame for better emotion detection"""
        return frame

    def smooth_predictions(self, emotion, confidence):
        """Smooth emotion predictions using history"""
        self.emotion_history.append(emotion)
        self.confidence_history.append(confidence)
        
        if len(self.emotion_history) < 2:
            return emotion, confidence
            
        emotion_counts = Counter(self.emotion_history)
        smoothed_emotion = emotion_counts.most_common(1)[0][0]
        smoothed_confidence = np.mean(list(self.confidence_history))
        
        return smoothed_emotion, smoothed_confidence

    def draw_text_with_emoji(self, frame, text, x, y):
        """Draw text with emoji on frame"""
        try:
            img_pil = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
            draw = ImageDraw.Draw(img_pil)
            draw.text((x, y), text, font=self.emoji_font, fill=(0, 255, 0))
            return cv2.cvtColor(np.array(img_pil), cv2.COLOR_RGB2BGR)
        except:
            # Fallback to OpenCV text if PIL fails
            cv2.putText(frame, text, (x, y), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
            return frame

    def log_emotion_change(self, emotion, confidence, frame):
        """Log emotion change with user data"""
        timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        # Save snapshot
        filename = f"{self.SNAPSHOTS_DIR}/{emotion}_{timestamp.replace(':', '-').replace(' ', '_')}.jpg"
        cv2.imwrite(filename, frame)
        
        # Log to CSV with user information
        with open(self.CSV_FILE, mode='a', newline='') as file:
            writer = csv.writer(file)
            writer.writerow([
                timestamp, emotion, f"{confidence:.2f}",
                self.user_id, self.username, self.user_email
            ])
        
        # Display in Streamlit
        st.success(f"📸 {self.username}: {emotion} ({confidence:.1f}%)")

    def analyze_frame(self, frame):
        """Analyze frame for emotions"""
        try:
            processed_frame = self.preprocess_frame(frame)
            result = DeepFace.analyze(
                processed_frame,
                actions=['emotion'],
                enforce_detection=False,
                detector_backend='opencv'
            )
            
            dominant_emotion = result[0]['dominant_emotion']
            confidence = result[0]['emotion'][dominant_emotion]
            
            smoothed_emotion, smoothed_confidence = self.smooth_predictions(
                dominant_emotion, confidence
            )
            
            return smoothed_emotion, smoothed_confidence
            
        except Exception as e:
            st.error(f"Analysis error: {e}")
            return "neutral", 0

    def get_emotion_stats(self):
        """Get emotion statistics for the user"""
        if not os.path.exists(self.CSV_FILE):
            return {}
            
        try:
            import pandas as pd
            df = pd.read_csv(self.CSV_FILE)
            
            if df.empty:
                return {}
                
            stats = {
                "total_detections": len(df),
                "emotion_counts": df['Emotion'].value_counts().to_dict(),
                "avg_confidence": df['Confidence'].astype(float).mean(),
                "date_range": {
                    "start": df['Timestamp'].min(),
                    "end": df['Timestamp'].max()
                }
            }
            
            return stats
            
        except Exception as e:
            st.error(f"Error getting stats: {e}")
            return {}
