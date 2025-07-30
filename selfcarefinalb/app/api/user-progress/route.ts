import { type NextRequest, NextResponse } from "next/server"

// Mock user data
const USER_PROGRESS: Record<
  string,
  {
    totalXP: number
    currentLevel: number
    streak: number
    lastActiveDate: string
  }
> = {}

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
  const userId = searchParams.get("userId")

  if (!userId) {
    return NextResponse.json({ success: false, error: "Missing userId parameter" }, { status: 400 })
  }

  try {
    const today = new Date().toISOString().split("T")[0]

    // Get user progress
    const userProgress = USER_PROGRESS[userId] || {
      totalXP: 0,
      currentLevel: 1,
      streak: 0,
      lastActiveDate: today,
    }

    // Get today's completed tasks
    const todayLogs = USER_TASK_LOGS.filter((log) => log.user_id === userId && log.date === today && log.completed_at)

    // Calculate streak
    let streak = 0
    const currentDate = new Date()
    for (let i = 0; i < 30; i++) {
      // Check last 30 days
      const checkDate = new Date(currentDate)
      checkDate.setDate(currentDate.getDate() - i)
      const dateString = checkDate.toISOString().split("T")[0]

      const dayLogs = USER_TASK_LOGS.filter(
        (log) => log.user_id === userId && log.date === dateString && log.completed_at,
      )

      if (dayLogs.length > 0) {
        streak++
      } else if (i > 0) {
        // Don't break on today if no tasks completed yet
        break
      }
    }

    // Determine current level based on XP
    let currentLevel = 1
    if (userProgress.totalXP >= 1001) currentLevel = 5
    else if (userProgress.totalXP >= 601) currentLevel = 4
    else if (userProgress.totalXP >= 301) currentLevel = 3
    else if (userProgress.totalXP >= 101) currentLevel = 2

    const updatedProgress = {
      ...userProgress,
      currentLevel,
      streak,
      completedToday: todayLogs.length,
    }

    USER_PROGRESS[userId] = updatedProgress

    return NextResponse.json({
      success: true,
      progress: updatedProgress,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch user progress" }, { status: 500 })
  }
}
