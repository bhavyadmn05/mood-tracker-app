import { type NextRequest, NextResponse } from "next/server"

// Mock reminders storage
const REMINDERS: Array<{
  id: string
  user_id: string
  task_id: string
  reminder_time: string
  message: string
  sent: boolean
}> = []

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, taskId, reminderTime, message } = body

    if (!userId || !taskId || !reminderTime) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: userId, taskId, reminderTime" },
        { status: 400 },
      )
    }

    const reminder = {
      id: `reminder_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      user_id: userId,
      task_id: taskId,
      reminder_time: reminderTime,
      message: message || "Time for your self-care task!",
      sent: false,
    }

    REMINDERS.push(reminder)

    return NextResponse.json({
      success: true,
      reminder: reminder,
      message: "Reminder set successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to set reminder" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")

  try {
    let userReminders = REMINDERS

    if (userId) {
      userReminders = REMINDERS.filter((reminder) => reminder.user_id === userId)
    }

    // Check for due reminders
    const now = new Date()
    const dueReminders = userReminders.filter((reminder) => {
      const reminderTime = new Date(reminder.reminder_time)
      return reminderTime <= now && !reminder.sent
    })

    // Mark due reminders as sent
    dueReminders.forEach((reminder) => {
      const index = REMINDERS.findIndex((r) => r.id === reminder.id)
      if (index >= 0) {
        REMINDERS[index].sent = true
      }
    })

    return NextResponse.json({
      success: true,
      reminders: userReminders,
      dueReminders: dueReminders,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch reminders" }, { status: 500 })
  }
}
