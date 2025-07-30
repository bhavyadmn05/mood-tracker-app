import { type NextRequest, NextResponse } from "next/server"

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

// Mock XP tracking
const USER_XP: Record<string, number> = {}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, taskId, timestamp, difficulty = "easy" } = body

    if (!userId || !taskId) {
      return NextResponse.json({ success: false, error: "Missing required fields: userId, taskId" }, { status: 400 })
    }

    const completedAt = timestamp ? new Date(timestamp) : new Date()
    const today = completedAt.toISOString().split("T")[0]

    // Find existing log or create new one
    const existingLogIndex = USER_TASK_LOGS.findIndex(
      (log) => log.user_id === userId && log.task_id === taskId && log.date === today,
    )

    if (existingLogIndex >= 0) {
      // Update existing log
      USER_TASK_LOGS[existingLogIndex].completed_at = completedAt.toISOString()
    } else {
      // Create new log
      USER_TASK_LOGS.push({
        id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        user_id: userId,
        task_id: taskId,
        date: today,
        completed_at: completedAt.toISOString(),
      })
    }

    // Calculate XP gain
    const xpGain = difficulty === "easy" ? 10 : difficulty === "medium" ? 20 : 30
    USER_XP[userId] = (USER_XP[userId] || 0) + xpGain

    // Check for level completion bonus
    const todayLogs = USER_TASK_LOGS.filter((log) => log.user_id === userId && log.date === today && log.completed_at)

    let bonusXP = 0
    if (todayLogs.length % 4 === 0) {
      // Assuming 4 tasks per level
      bonusXP = 100
      USER_XP[userId] += bonusXP
    }

    return NextResponse.json({
      success: true,
      message: "Task completed successfully",
      xpGained: xpGain,
      bonusXP: bonusXP,
      totalXP: USER_XP[userId],
      completedToday: todayLogs.length,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to complete task" }, { status: 500 })
  }
}
