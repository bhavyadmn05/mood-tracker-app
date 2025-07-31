# ✅ Updated standalone_analyzer.py to accept key_prefix for download buttons
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
import streamlit as st
import os
from fpdf import FPDF
from io import BytesIO
import tempfile

def generate_full_analysis(csv_path, key_prefix=""):
    if not os.path.exists(csv_path) or os.stat(csv_path).st_size == 0:
        st.warning("📭 No past emotion detection found. Please start detection to generate your report.")
        return

    try:
        df = pd.read_csv(csv_path)

        if df.empty:
            return

        if 'Timestamp' in df.columns:
            try:
                if '_' in str(df['Timestamp'].iloc[0]):
                    df['Timestamp'] = pd.to_datetime(df['Timestamp'], format='%Y-%m-%d_%H-%M-%S')
                else:
                    df['Timestamp'] = pd.to_datetime(df['Timestamp'])
            except:
                df['Timestamp'] = pd.to_datetime(df['Timestamp'], errors='coerce')

        st.markdown("## 🧠 Emotion Report")
        st.markdown("A visual summary of your past emotions.")
        st.markdown("---")

        emotion_counts = df['Emotion'].value_counts()
        colors = plt.cm.Set3(np.linspace(0, 1, len(emotion_counts)))

        col1, col2 = st.columns(2)

        with col1:
            st.markdown("### 🥧 Emotion Distribution")
            fig1, ax1 = plt.subplots(figsize=(4, 4))
            ax1.pie(emotion_counts, labels=emotion_counts.index, autopct='%1.1f%%', colors=colors)
            ax1.axis('equal')
            st.pyplot(fig1)

        with col2:
            st.markdown("### 📊 Emotion Frequency")
            fig2, ax2 = plt.subplots(figsize=(5, 3.5))
            ax2.bar(emotion_counts.index, emotion_counts.values, color=colors)
            ax2.set_ylabel("Count")
            ax2.set_xticklabels(emotion_counts.index, rotation=45)
            st.pyplot(fig2)

        col3, col4 = st.columns(2)

        with col3:
            st.markdown("### 📈 Confidence Levels")
            fig3 = None
            if 'Confidence' in df.columns:
                conf_vals = pd.to_numeric(df['Confidence'], errors='coerce').dropna()
                if not conf_vals.empty:
                    fig3, ax3 = plt.subplots(figsize=(5, 3))
                    ax3.hist(conf_vals, bins=20, color='skyblue', edgecolor='white')
                    ax3.set_xlabel("Confidence (%)")
                    ax3.set_ylabel("Frequency")
                    ax3.set_title("Confidence Distribution")
                    st.pyplot(fig3)
                else:
                    st.warning("No valid confidence data available.")
            else:
                st.warning("Confidence column not found.")

        with col4:
            st.markdown("### ⏱️ Emotion Timeline")
            if 'Timestamp' in df.columns and not df['Timestamp'].isna().all():
                try:
                    timeline = df.groupby([pd.Grouper(key='Timestamp', freq='10S'), 'Emotion']).size().unstack(fill_value=0)
                    st.line_chart(timeline)
                except Exception as e:
                    st.warning(f"Could not plot timeline: {e}")
            else:
                st.warning("No timestamp data available.")

        st.markdown("---")
        st.markdown("### 📊 Summary Metrics")

        col5, col6, col7 = st.columns(3)

        with col5:
            st.metric("🎭 Most Common", f"{emotion_counts.idxmax()}", f"{emotion_counts.max()} times")

        with col6:
            st.metric("🧠 Unique Emotions", f"{df['Emotion'].nunique()}")

        with col7:
            st.metric("🔍 Total Detections", f"{len(df)}")

        avg_conf, min_conf, max_conf = None, None, None
        if 'Confidence' in df.columns and 'conf_vals' in locals() and not conf_vals.empty:
            avg_conf = conf_vals.mean()
            min_conf = conf_vals.min()
            max_conf = conf_vals.max()
            st.info(f"✅ **Avg Confidence:** {avg_conf:.2f}% | Min: {min_conf:.1f}% | Max: {max_conf:.1f}%")

        if 'Timestamp' in df.columns and not df['Timestamp'].isna().all():
            duration = df['Timestamp'].max() - df['Timestamp'].min()
            st.info(f"🕒 **Time Span:** `{df['Timestamp'].min()}` → `{df['Timestamp'].max()}`\n🧭 **Duration:** `{duration}`")

        st.markdown("---")
        with st.expander("📄 Show Full Emotion Log (Raw Data)"):
            st.dataframe(df)

        with st.expander("📥 Download Log as CSV"):
            st.download_button(
                label="Download CSV File",
                data=df.to_csv(index=False).encode('utf-8'),
                file_name=os.path.basename(csv_path),
                mime='text/csv',
                key=f"{key_prefix}_csv"
            )

        # ============ PDF Export ============
        fig_paths = []
        for idx, fig in enumerate([fig1, fig2] + ([fig3] if fig3 else [])):
            path = f"temp_plot_{idx}.png"
            fig.savefig(path, bbox_inches='tight')
            fig_paths.append(path)

        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmpfile:
            pdf = FPDF()
            pdf.add_page()
            pdf.set_font("Arial", "B", 16)
            username = os.path.basename(csv_path).split('_')[0]
            pdf.cell(0, 10, f"Emotion Report for {username}", ln=True)

            pdf.set_font("Arial", "", 12)
            pdf.multi_cell(0, 10, f"Total Detections: {len(df)}")
            pdf.multi_cell(0, 10, f"Most Common Emotion: {emotion_counts.idxmax()}")
            if avg_conf:
                pdf.multi_cell(0, 10, f"Avg Confidence: {avg_conf:.2f}%")
            if 'duration' in locals():
                pdf.multi_cell(0, 10, f"Duration: {duration}")

            for path in fig_paths:
                pdf.image(path, w=170)
                pdf.ln(3)

            pdf.output(tmpfile.name)

            with open(tmpfile.name, "rb") as pdf_file:
                st.download_button(
                    label="📥 Download Emotion Report (PDF)",
                    data=pdf_file.read(),
                    file_name=f"{username}_report.pdf",
                    mime="application/pdf",
                    key=f"{key_prefix}_pdf"
                )

        for path in fig_paths:
            if os.path.exists(path):
                os.remove(path)

    except Exception as e:
        st.error(f"❌ Error loading or analyzing data: {e}")
