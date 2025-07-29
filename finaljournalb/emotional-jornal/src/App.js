"use client"
import JournalEntry from "./components/JournalEntry"

function App() {
  const handleJournalSubmit = async (text) => {
    console.log("Journal Submitted:", text)
    // 🔜 Will connect this to Flask backend in Step 2
  }

  return (
    <div style={{ backgroundColor: "#d4c4b0", minHeight: "100vh", padding: "40px" }}>
      <JournalEntry onSubmit={handleJournalSubmit} />
    </div>
  )
}

export default App
