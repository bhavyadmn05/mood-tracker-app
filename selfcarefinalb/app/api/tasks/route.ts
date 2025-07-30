import { type NextRequest, NextResponse } from "next/server"

// Mock database - in production, use a real database like PostgreSQL, MongoDB, etc.
const TASK_BANK = [
  // Level 1: Seedling Sprout
  {
    id: "1-1",
    title: "Drink a glass of water",
    type: "physical",
    difficulty: "easy",
    duration: 1,
    level: 1,
    whenToShow: ["tired", "focused", "energetic"],
    videoLink: "https://youtube.com/watch?v=hydration-tips",
    gardenElement: { emoji: "🌻", name: "Sunflower" },
    scienceExplanation: "Research shows drinking water improves focus by 14% and boosts cognitive performance",
    scienceSource: "Journal of Nutrition, 2012",
  },
  {
    id: "1-2",
    title: "Take 3 deep breaths",
    type: "mental",
    difficulty: "easy",
    duration: 2,
    level: 1,
    whenToShow: ["anxious", "stressed", "overwhelmed"],
    videoLink: "https://youtube.com/watch?v=breathing-technique",
    gardenElement: { emoji: "🍃", name: "Leaf" },
    scienceExplanation: "Deep breathing activates the parasympathetic nervous system, reducing anxiety by 40%",
    scienceSource: "Harvard Medical School, 2020",
  },
  {
    id: "1-3",
    title: "Smile at yourself in mirror",
    type: "emotional",
    difficulty: "easy",
    duration: 1,
    level: 1,
    whenToShow: ["sad", "neutral", "happy"],
    videoLink: "https://youtube.com/watch?v=positive-psychology",
    gardenElement: { emoji: "🌸", name: "Blossom" },
    scienceExplanation: "Smiling releases endorphins and reduces stress hormones by 23%",
    scienceSource: "Psychological Science, 2019",
  },
  {
    id: "1-4",
    title: "Stretch your arms",
    type: "physical",
    difficulty: "easy",
    duration: 2,
    level: 1,
    whenToShow: ["tired", "tense", "stiff"],
    videoLink: "https://youtube.com/watch?v=arm-stretches",
    gardenElement: { emoji: "🌿", name: "Herb" },
    scienceExplanation: "Simple stretching improves blood circulation and reduces muscle tension",
    scienceSource: "American College of Sports Medicine, 2019",
  },
  // Level 2: Garden Tender
  {
    id: "2-1",
    title: "Take a 5-minute walk",
    type: "physical",
    difficulty: "medium",
    duration: 5,
    level: 2,
    whenToShow: ["restless", "creative-block", "energetic"],
    videoLink: "https://youtube.com/watch?v=walking-benefits",
    gardenElement: { emoji: "🌳", name: "Tree" },
    scienceExplanation: "A 5-minute walk increases creativity by 60% and reduces stress hormones",
    scienceSource: "Stanford University Study, 2014",
  },
  {
    id: "2-2",
    title: "Practice mindful breathing",
    type: "mental",
    difficulty: "medium",
    duration: 5,
    level: 2,
    whenToShow: ["anxious", "scattered", "overwhelmed"],
    videoLink: "https://youtube.com/watch?v=mindful-breathing",
    gardenElement: { emoji: "🪷", name: "Lotus" },
    scienceExplanation: "Mindful breathing reduces cortisol levels and improves emotional regulation",
    scienceSource: "Mindfulness Journal, 2020",
  },
  // Add more tasks for levels 3-5...
]

// Mock user task logs
const USER_TASK_LOGS: Array<{
  id: string
  user_id: string
  task_id: string
  date: string
  started_at?: string
  completed_at?: string
  timer_duration?: number
}> = []

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const level = searchParams.get("level")
  const mood = searchParams.get("mood")
  const userId = searchParams.get("userId")

  try {
    let filteredTasks = TASK_BANK

    // Filter by level
    if (level) {
      filteredTasks = filteredTasks.filter((task) => task.level === Number.parseInt(level))
    }

    // Filter by mood
    if (mood) {
      filteredTasks = filteredTasks.filter((task) => task.whenToShow.includes(mood))
    }

    // Get user's completion status if userId provided
    if (userId) {
      const today = new Date().toISOString().split("T")[0]
      const userLogs = USER_TASK_LOGS.filter((log) => log.user_id === userId && log.date === today)

      filteredTasks = filteredTasks.map((task) => ({
        ...task,
        completed: userLogs.some((log) => log.task_id === task.id && log.completed_at),
        timerStarted: userLogs.some((log) => log.task_id === task.id && log.started_at),
        timerCompleted: userLogs.some((log) => log.task_id === task.id && log.completed_at),
      }))
    }

    return NextResponse.json({
      success: true,
      tasks: filteredTasks,
      total: filteredTasks.length,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch tasks" }, { status: 500 })
  }
}
