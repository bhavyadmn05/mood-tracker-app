"use client"

import { useState, useEffect } from "react"
import "./JournalEntry.css"

const JournalEntry = () => {
  const [entry, setEntry] = useState("")
  const [emotion, setEmotion] = useState(null)
  const [confidence, setConfidence] = useState(null)
  const [suggestion, setSuggestion] = useState(null)
  const [loading, setLoading] = useState(false)
  const [charCount, setCharCount] = useState(0)

  useEffect(() => {
    setCharCount(entry.length)
  }, [entry])

  const handleSubmit = async () => {
    if (!entry.trim()) return

    setLoading(true)
    setEmotion(null)
    setConfidence(null)
    setSuggestion(null)

    try {
      const response = await fetch("http://127.0.0.1:5000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: entry }),
      })

      const data = await response.json()
      setEmotion(data.emotion)
      setConfidence(data.confidence)
      setSuggestion(data.suggestion)
    } catch (error) {
      console.error("Error analyzing journal entry:", error)
    } finally {
      setLoading(false)
    }
  }

  const getEmotionEmoji = (emotion) => {
    const emojiMap = {
      happy: "😊",
      sad: "🌧",
      angry: "🌪",
      fear: "🌙",
      surprise: "✨",
      disgust: "🍃",
      neutral: "🌸",
      joy: "🌻",
      love: "💚",
      excited: "🌟",
      anxious: "🌊",
      calm: "🕊",
    }
    return emojiMap[emotion?.toLowerCase()] || "🌿"
  }

  const getConfidenceColor = (confidence) => {
    const conf = Number.parseFloat(confidence)
    if (conf >= 0.8) return "#c4836b"
    if (conf >= 0.6) return "#e6a085"
    return "#ff9a56"
  }

  const handleCheckboxChange = (e, idx) => {
    const li = e.target.parentElement
    if (e.target.checked) {
      li.style.background = "linear-gradient(135deg, rgba(72, 187, 120, 0.1), rgba(72, 187, 120, 0.05))"
      li.style.transform = "translateX(5px)"
      li.style.boxShadow = "0 3px 8px rgba(72, 187, 120, 0.2)"
    } else {
      li.style.background = "rgba(255, 255, 255, 0.7)"
      li.style.transform = ""
      li.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.05)"
    }
  }

  return (
    <div className="journal-wrapper">
      <div className="journal-card">
        <h1 className="journal-heading">🌿 Your Safe Space for Reflection</h1>

        <div style={{ position: "relative" }}>
          <textarea
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            placeholder="Take a deep breath... How are you feeling today? Share whatever is on your mind. This is your safe space."
            className="journal-textarea"
            maxLength={2000}
          />
          <div
            className="char-counter"
            style={{
              color: charCount > 1800 ? "#ff9a56" : charCount > 1500 ? "#e6a085" : "#c4836b",
            }}
          >
            {charCount}/2000
          </div>
        </div>

        <button className="journal-button" onClick={handleSubmit} disabled={loading || !entry.trim()}>
          {loading ? "🌸 Understanding your feelings..." : "🌱 Reflect & Find Peace"}
        </button>

        {loading && <div className="journal-loading">Taking a moment to understand your emotions...</div>}

        {emotion && (
          <div className="journal-result">
            <h3>
              {getEmotionEmoji(emotion)} I sense you're feeling:{" "}
              <strong
                style={{
                  color: "#374151",
                  background: "linear-gradient(135deg, #c4836b, #e6a085)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
              </strong>
            </h3>
            <p>
              Confidence:{" "}
              <strong style={{ color: getConfidenceColor(confidence) }}>
                {(Number.parseFloat(confidence) * 100).toFixed(1)}%
              </strong>
            </p>

            {suggestion && (
              <div className="suggestions">
                {/* 🌸 Quote */}
                <div className="quote-card">
                  <h3>💫 A gentle reminder for you</h3>
                  <p style={{ fontSize: "1rem", lineHeight: "1.6", color: "#374151" }}>{suggestion.quote}</p>
                </div>

                {/* 🌿 Checklist */}
                <div className="checklist-section">
                  <h3>🌱 Gentle activities to nurture yourself</h3>
                  <ul>
                    {suggestion.checklist.map((item, idx) => (
                      <li key={idx}>
                        <input type="checkbox" id={`task-${idx}`} onChange={(e) => handleCheckboxChange(e, idx)} />
                        <label htmlFor={`task-${idx}`}>{item}</label>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 🎬 Video */}
                <div className="video-section">
                  <h3>🕊 A peaceful moment for you</h3>
                  <div className="video-wrapper">
                    <iframe
                      src={suggestion.video.replace("watch?v=", "embed/")}
                      title="Peaceful Relaxation Video"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default JournalEntry
