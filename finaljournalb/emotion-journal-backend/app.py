from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline
import csv
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)

# Load Hugging Face 27-emotion classification model
emotion_pipeline = pipeline(
    "text-classification",
    model="bhadresh-savani/distilbert-base-uncased-emotion",
    return_all_scores=True
)

# Expanded Emotion-based smart suggestions
def get_suggestions(emotion):
    suggestions_map = {
        "joy": {
            "quote": "Let your joy be contagious!",
            "video": "https://www.youtube.com/watch?v=ZbZSe6N_BXs",
            "checklist": ["Celebrate your wins 🎉", "Spread happiness 😊", "Reflect on your blessings 🙏"]
        },
        "sadness": {
            "quote": "Tears are words the heart can't express.",
            "video": "https://www.youtube.com/watch?v=ZToicYcHIOU",
            "checklist": ["Reach out to a friend 🧡", "Write your thoughts down 📝", "Take deep breaths 🌬️"]
        },
        "anger": {
            "quote": "Speak when you are angry and you will make the best speech you will ever regret.",
            "video": "https://www.youtube.com/watch?v=1vx8iUvfyCY",
            "checklist": ["Pause and breathe 🌫️", "Do something physical 🏃", "Journal it out ✍️"]
        },
        "fear": {
            "quote": "Everything you've ever wanted is on the other side of fear.",
            "video": "https://www.youtube.com/watch?v=2OEL4P1Rz04",
            "checklist": ["Acknowledge the fear 😟", "Practice grounding 🌍", "Speak with someone 💬"]
        },
        "love": {
            "quote": "Love is the bridge between you and everything.",
            "video": "https://www.youtube.com/watch?v=mdC1H5Y77MI",
            "checklist": ["Show appreciation 💌", "Connect with loved ones 🫂", "Radiate kindness 🌟"]
        },
        "gratitude": {
            "quote": "Gratitude turns what we have into enough.",
            "video": "https://www.youtube.com/watch?v=oHv6vTKD6lg",
            "checklist": ["Write 3 things you're grateful for 🙏", "Say thank you 😊", "Help someone today 💖"]
        },
        "curiosity": {
            "quote": "Stay curious. It’s the path to lifelong learning.",
            "video": "https://www.youtube.com/watch?v=J1uc3vVxP-U",
            "checklist": ["Research a new topic 📚", "Ask questions ❓", "Explore something different 🌐"]
        },
        "surprise": {
            "quote": "Embrace the unexpected. That's where the magic happens.",
            "video": "https://www.youtube.com/watch?v=Qd6nLM2QlWw",
            "checklist": ["Note 3 unexpected joys ✨", "Try something new 🚀", "Reflect on surprises 🤯"]
        },
        "nervousness": {
            "quote": "It’s okay to feel nervous. That means you care.",
            "video": "https://www.youtube.com/watch?v=VYpGBtR8Lbs",
            "checklist": ["Take calming breaths 🌬️", "Speak kindly to yourself 💬", "Visualize success 🎯"]
        },
        "disappointment": {
            "quote": "Disappointment is a stepping stone to growth.",
            "video": "https://www.youtube.com/watch?v=RXa4KDWZRIg",
            "checklist": ["Reflect on lessons learned 📓", "Talk it out 💭", "Practice acceptance 🤝"]
        },
        "realization": {
            "quote": "Awareness is the greatest agent for change.",
            "video": "https://www.youtube.com/watch?v=U7XjObQ3Lrg",
            "checklist": ["Write your insight down 🧠", "Reframe your mindset 🔁", "Plan your next steps 📌"]
        },
        "neutral": {
            "quote": "Stillness speaks volumes.",
            "video": "https://www.youtube.com/watch?v=inpok4MKVLM",
            "checklist": ["Observe your thoughts 👁️", "Journal mindfully ✍️", "Sit in silence for 5 mins 🧘"]
        },
        "embarrassment": {
            "quote": "Everyone trips. What matters is how you recover.",
            "video": "https://www.youtube.com/watch?v=Wl2_knlv_xw",
            "checklist": ["Laugh at yourself 😂", "Own your story 🗣️", "Move on gracefully 🕊️"]
        },
        "relief": {
            "quote": "Exhale. You made it through.",
            "video": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            "checklist": ["Celebrate with a treat 🍫", "Thank those who helped 🙌", "Take time to relax 🛀"]
        },
        "pride": {
            "quote": "Be proud of how far you’ve come.",
            "video": "https://www.youtube.com/watch?v=lTYRtRXh3FM",
            "checklist": ["Document your progress 📈", "Share your achievement 🎉", "Reward yourself 🏆"]
        },
        "remorse": {
            "quote": "Acknowledgment is the first step to healing.",
            "video": "https://www.youtube.com/watch?v=Ow0lr63y4Mw",
            "checklist": ["Apologize if needed ✉️", "Forgive yourself 💙", "Learn from mistakes 📘"]
        },
        "confusion": {
            "quote": "Confusion is a sign of learning something new.",
            "video": "https://www.youtube.com/watch?v=kdhhQhqi_AE",
            "checklist": ["List out what’s unclear 🗒️", "Seek guidance 🤝", "Give it time ⏳"]
        },
        "grief": {
            "quote": "Grief is love with no place to go.",
            "video": "https://www.youtube.com/watch?v=gsYL4PC0hyk",
            "checklist": ["Honor your emotions 💔", "Talk to someone 👂", "Give yourself grace 🤍"]
        },
        "desire": {
            "quote": "Desire fuels ambition.",
            "video": "https://www.youtube.com/watch?v=VYOjWnS4cMY",
            "checklist": ["Visualize what you want 🧭", "Write your goals 📑", "Take one small action today 💡"]
        },
        "optimism": {
            "quote": "Optimism is the faith that leads to achievement.",
            "video": "https://www.youtube.com/watch?v=OPf0YbXqDm0",
            "checklist": ["Affirm your future ✨", "Smile more today 😊", "Lift someone else up 🌈"]
        },
        "admiration": {
            "quote": "Appreciation opens the heart.",
            "video": "https://www.youtube.com/watch?v=r2LCbVZytmQ",
            "checklist": ["Compliment someone 💬", "Reflect on your values 🪞", "Be inspired by greatness ⭐"]
        },
        "approval": {
            "quote": "You are enough just as you are.",
            "video": "https://www.youtube.com/watch?v=2vjPBrBU-TM",
            "checklist": ["Accept compliments 💝", "Acknowledge your effort 👏", "Say 'I am proud of me' 🗣️"]
        },
        "caring": {
            "quote": "To care is to connect deeply.",
            "video": "https://www.youtube.com/watch?v=VNqNnUJVcVs",
            "checklist": ["Do a kind deed today 💞", "Call someone important ☎️", "Send love to yourself 💗"]
        },
        "amusement": {
            "quote": "Laughter is a sunbeam of the soul.",
            "video": "https://www.youtube.com/watch?v=fLexgOxsZu0",
            "checklist": ["Watch a comedy 🤣", "Share a joke 😂", "Be silly for a moment 🤪"]
        },
        "annoyance": {
            "quote": "Annoyance is a clue—listen to it, then let go.",
            "video": "https://www.youtube.com/watch?v=tVj0ZTS4WF4",
            "checklist": ["Take a breather 🧘", "Remove yourself from the trigger 🚪", "Reframe the situation 🌀"]
        },
        "excitement": {
            "quote": "Let your excitement lead the way!",
            "video": "https://www.youtube.com/watch?v=9EcjWd-O4jI",
            "checklist": ["Channel your energy 🧨", "Share the news 📣", "Dive into the moment 💫"]
        }
    }

    return suggestions_map.get(emotion.lower(), {
        "quote": "Emotions are valid. Keep reflecting.",
        "video": "https://www.youtube.com/watch?v=inpok4MKVLM",
        "checklist": ["Drink water 💧", "Take a mindful pause 🧘", "Write 3 things you're grateful for 🙏"]
    })
def log_journal_entry(text, emotion, confidence):
    log_file = "journal_log.csv"
    file_exists = os.path.isfile(log_file)

    with open(log_file, mode='a', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        if not file_exists:
            writer.writerow(["timestamp", "entry", "emotion", "confidence"])
        writer.writerow([datetime.now().isoformat(), text, emotion, confidence])


# API Endpoint
@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    text = data.get('text', '')

    if not text:
        return jsonify({"error": "No text provided"}), 400

    results = emotion_pipeline(text)[0]
    top_emotion = max(results, key=lambda x: x['score'])

    emotion = top_emotion['label']
    confidence = round(top_emotion['score'], 2)
    suggestion = get_suggestions(emotion)

    # ✅ Log journal entry to CSV
    log_journal_entry(text, emotion, confidence)

    return jsonify({
        "emotion": emotion.capitalize(),
        "confidence": confidence,
        "suggestion": suggestion
    })


if __name__ == '__main__':
    app.run(debug=True)
