// API utility functions for frontend

export interface Task {
  id: string
  title: string
  type: "physical" | "mental" | "emotional"
  difficulty: "easy" | "medium" | "hard"
  duration: number
  level: number
  whenToShow: string[]
  videoLink: string
  gardenElement: {
    emoji: string
    name: string
  }
  scienceExplanation: string
  scienceSource: string
  completed?: boolean
  timerStarted?: boolean
  timerCompleted?: boolean
}

export interface UserProgress {
  totalXP: number
  currentLevel: number
  streak: number
  lastActiveDate: string
  completedToday: number
}

export class SelfCareAPI {
  private baseUrl = "/api"
  private userId: string

  constructor(userId: string) {
    this.userId = userId
  }

  async getTasks(level?: number, mood?: string): Promise<Task[]> {
    const params = new URLSearchParams({
      userId: this.userId,
      ...(level && { level: level.toString() }),
      ...(mood && { mood }),
    })

    const response = await fetch(`${this.baseUrl}/tasks?${params}`)
    const data = await response.json()

    if (!data.success) {
      throw new Error(data.error)
    }

    return data.tasks
  }

  async startTimer(taskId: string, duration: number): Promise<any> {
    const response = await fetch(`${this.baseUrl}/start-timer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: this.userId,
        taskId,
        duration,
      }),
    })

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.error)
    }

    return data.timer
  }

  async completeTask(taskId: string, difficulty: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/complete-task`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: this.userId,
        taskId,
        timestamp: new Date().toISOString(),
        difficulty,
      }),
    })

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.error)
    }

    return data
  }

  async setReminder(taskId: string, reminderTime: string, message?: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/reminder`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: this.userId,
        taskId,
        reminderTime,
        message,
      }),
    })

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.error)
    }

    return data.reminder
  }

  async getReminders(): Promise<any[]> {
    const response = await fetch(`${this.baseUrl}/reminder?userId=${this.userId}`)
    const data = await response.json()

    if (!data.success) {
      throw new Error(data.error)
    }

    return data.dueReminders
  }

  async getUserProgress(): Promise<UserProgress> {
    const response = await fetch(`${this.baseUrl}/user-progress?userId=${this.userId}`)
    const data = await response.json()

    if (!data.success) {
      throw new Error(data.error)
    }

    return data.progress
  }
}

// Notification utility
export class NotificationManager {
  static async requestPermission(): Promise<boolean> {
    if (!("Notification" in window)) {
      console.log("This browser does not support notifications")
      return false
    }

    if (Notification.permission === "granted") {
      return true
    }

    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission()
      return permission === "granted"
    }

    return false
  }

  static showNotification(title: string, options?: NotificationOptions): void {
    if (Notification.permission === "granted") {
      new Notification(title, {
        icon: "/icon-192x192.png",
        badge: "/icon-192x192.png",
        ...options,
      })
    }
  }

  static scheduleReminder(taskTitle: string, delayMinutes: number): void {
    setTimeout(
      () => {
        this.showNotification(`Self-Care Reminder`, {
          body: `Time for: ${taskTitle}`,
          tag: "self-care-reminder",
        })
      },
      delayMinutes * 60 * 1000,
    )
  }
}
