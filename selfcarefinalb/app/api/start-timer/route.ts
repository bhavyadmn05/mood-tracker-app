import { type NextRequest, NextResponse } from "next/server"

// Mock database for active timers
const ACTIVE_TIMERS: Array<{
  id: string
  user_id: string
  task_id: string
  started_at: string
  duration_minutes: number
  expected_end: string
}> = []

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, taskId, duration } = body

    if (!userId || !taskId || !duration) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: userId, taskId, duration" },
        { status: 400 },
      )
    }

    const now = new Date()
    const expectedEnd = new Date(now.getTime() + duration * 60 * 1000)
    const today = now.toISOString().split("T")[0]

    // Create timer record
    const timerId = `timer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const timer = {
      id: timerId,
      user_id: userId,
      task_id: taskId,
      started_at: now.toISOString(),
      duration_minutes: duration,
      expected_end: expectedEnd.toISOString(),
    }

    ACTIVE_TIMERS.push(timer)

    // Create or update user task log
    const existingLogIndex = USER_TASK_LOGS.findIndex(
      (log) => log.user_id === userId && log.task_id === taskId && log.date === today,
    )

    if (existingLogIndex >= 0) {
      USER_TASK_LOGS[existingLogIndex].started_at = now.toISOString()
      USER_TASK_LOGS[existingLogIndex].timer_duration = duration
    } else {
      USER_TASK_LOGS.push({
        id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        user_id: userId,
        task_id: taskId,
        date: today,
        started_at: now.toISOString(),
        timer_duration: duration,
      })
    }

    return NextResponse.json({
      success: true,
      timer: timer,
      message: "Timer started successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to start timer" }, { status: 500 })
  }
}
