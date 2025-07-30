"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Play,
  Pause,
  RotateCcw,
  Brain,
  PlayCircle,
  Sparkles,
  Flame,
  Maximize,
  X,
  Trophy,
  Zap,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  Bell,
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { SelfCareAPI, NotificationManager, type Task, type UserProgress } from "@/lib/api"

const AMBIENT_BACKGROUNDS = [
  {
    name: "Forest",
    emoji: "🌲",
    gradient: "from-brand-primary via-brand-medium-brown to-brand-light-peach",
    sound: "forest",
    elements: ["🌳", "🦋", "🌿", "🍃"],
  },
  {
    name: "Ocean",
    emoji: "🌊",
    gradient: "from-blue-600 via-blue-500 to-cyan-400", // Keeping original for ocean as no specific new blue provided
    sound: "waves",
    elements: ["🌊", "🐚", "⭐", "🌙"],
  },
  {
    name: "Sky",
    emoji: "☁️",
    gradient: "from-purple-600 via-pink-500 to-orange-400", // Keeping original for sky as no specific new gradient provided
    sound: "piano",
    elements: ["☁️", "⭐", "🌙", "✨"],
  },
]

const LEVEL_CONFIG = [
  {
    level: 1,
    name: "Seedling Sprout",
    emoji: "🌱",
    minXP: 0,
    maxXP: 100,
    description: "Just beginning your wellness journey",
    gardenTheme: "A small patch of soil with tiny sprouts",
    unlocks: ["Basic garden plot", "Simple tasks"],
  },
  {
    level: 2,
    name: "Garden Tender",
    emoji: "🌿",
    minXP: 101,
    maxXP: 300,
    description: "Learning to nurture your daily habits",
    gardenTheme: "Small plants and herbs growing",
    unlocks: ["Herb garden section", "Timer bonuses", "Streak tracking"],
  },
  {
    level: 3,
    name: "Bloom Cultivator",
    emoji: "🌸",
    minXP: 301,
    maxXP: 600,
    description: "Your garden is starting to flourish",
    gardenTheme: "Beautiful flowers and small trees",
    unlocks: ["Flower beds", "Mindful mode", "Achievement badges"],
  },
  {
    level: 4,
    name: "Garden Master",
    emoji: "🌺",
    minXP: 601,
    maxXP: 1000,
    description: "A true master of self-care practices",
    gardenTheme: "Lush garden with diverse flora",
    unlocks: ["Exotic plants", "Weather effects", "Garden themes"],
  },
  {
    level: 5,
    name: "Zen Guardian",
    emoji: "🏯",
    minXP: 1001,
    maxXP: Number.POSITIVE_INFINITY,
    description: "Enlightened keeper of the wellness sanctuary",
    gardenTheme: "Mystical garden with temple and zen elements",
    unlocks: ["Sacred grove", "Meditation temple", "Legendary achievements"],
  },
]

export default function SelfCareChecklist() {
  const [userId] = useState(() => `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)
  const [api] = useState(() => new SelfCareAPI(userId))

  const [currentLevelIndex, setCurrentLevelIndex] = useState(0)
  const [tasks, setTasks] = useState<Task[]>([])
  const [userProgress, setUserProgress] = useState<UserProgress>({
    totalXP: 0,
    currentLevel: 1,
    streak: 0,
    lastActiveDate: new Date().toISOString().split("T")[0],
    completedToday: 0,
  })
  const [activeTimer, setActiveTimer] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState<number>(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [mindfulMode, setMindfulMode] = useState(false)
  const [selectedBackground, setSelectedBackground] = useState(0)
  const [soundEnabled, setSoundEnabled] = useState(false)
  const [showLevelUp, setShowLevelUp] = useState(false)
  const [fallingLeaves, setFallingLeaves] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  const currentLevel = LEVEL_CONFIG[currentLevelIndex]
  const completedTasks = tasks.filter((task) => task.timerCompleted).length
  const progressPercentage = (completedTasks / tasks.length) * 100
  const isLevelComplete = completedTasks === tasks.length

  // Check if user can access next level
  const canGoToNextLevel = currentLevelIndex < LEVEL_CONFIG.length - 1 && isLevelComplete
  const canGoToPrevLevel = currentLevelIndex > 0

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true)

        // Request notification permission
        await NotificationManager.requestPermission()

        // Load user progress
        const progress = await api.getUserProgress()
        setUserProgress(progress)
        setCurrentLevelIndex(progress.currentLevel - 1)

        // Load tasks for current level
        const levelTasks = await api.getTasks(progress.currentLevel)
        setTasks(levelTasks)

        // Check for due reminders
        const reminders = await api.getReminders()
        reminders.forEach((reminder) => {
          NotificationManager.showNotification("Self-Care Reminder", {
            body: reminder.message,
            tag: "self-care-reminder",
          })
        })
      } catch (error) {
        console.error("Failed to initialize data:", error)
      } finally {
        setLoading(false)
      }
    }

    initializeData()
  }, [api])

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false)
            if (activeTimer) {
              completeTask(activeTimer)
            }
            setActiveTimer(null)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isTimerRunning, timeLeft, activeTimer])

  // Falling leaves effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.1) {
        const leaves = ["🍂", "🍃", "🍁"]
        const randomLeaf = leaves[Math.floor(Math.random() * leaves.length)]
        setFallingLeaves((prev) => [...prev, `${randomLeaf}-${Date.now()}`])

        setTimeout(() => {
          setFallingLeaves((prev) => prev.slice(1))
        }, 3000)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const completeTask = async (taskId: string) => {
    try {
      const task = tasks.find((t) => t.id === taskId)
      if (!task) return

      const result = await api.completeTask(taskId, task.difficulty)

      // Update local state
      setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, completed: true, timerCompleted: true } : t)))

      // Update user progress
      setUserProgress((prev) => ({
        ...prev,
        totalXP: result.totalXP,
        completedToday: result.completedToday,
      }))

      // Show level up if applicable
      if (result.bonusXP > 0) {
        setShowLevelUp(true)
        setTimeout(() => setShowLevelUp(false), 3000)
      }

      // Show completion notification
      NotificationManager.showNotification("Task Completed! 🎉", {
        body: `You earned ${result.xpGained} XP for completing "${task.title}"`,
        tag: "task-completed",
      })
    } catch (error) {
      console.error("Failed to complete task:", error)
    }
  }

  const startTask = async (task: Task) => {
    try {
      // Start timer on backend
      await api.startTimer(task.id, task.duration)

      // Update local state
      setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, timerStarted: true } : t)))

      setActiveTimer(task.id)
      setTimeLeft(task.duration * 60)
      setIsTimerRunning(true)

      // Set reminder notification
      NotificationManager.scheduleReminder(task.title, task.duration)
    } catch (error) {
      console.error("Failed to start task:", error)
    }
  }

  const pauseTimer = () => {
    setIsTimerRunning(!isTimerRunning)
  }

  const resetTimer = () => {
    setIsTimerRunning(false)
    setActiveTimer(null)
    setTimeLeft(0)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getGardenVisualization = () => {
    const completedElements = tasks.filter((task) => task.timerCompleted).map((task) => task.gardenElement.emoji)
    return completedElements.join(" ") || currentLevel.emoji
  }

  const goToNextLevel = async () => {
    if (canGoToNextLevel) {
      const newLevelIndex = currentLevelIndex + 1
      setCurrentLevelIndex(newLevelIndex)
      setActiveTimer(null)
      setIsTimerRunning(false)
      setTimeLeft(0)

      try {
        const levelTasks = await api.getTasks(newLevelIndex + 1)
        setTasks(levelTasks)
      } catch (error) {
        console.error("Failed to load next level tasks:", error)
      }
    }
  }

  const goToPrevLevel = async () => {
    if (canGoToPrevLevel) {
      const newLevelIndex = currentLevelIndex - 1
      setCurrentLevelIndex(newLevelIndex)
      setActiveTimer(null)
      setIsTimerRunning(false)
      setTimeLeft(0)

      try {
        const levelTasks = await api.getTasks(newLevelIndex + 1)
        setTasks(levelTasks)
      } catch (error) {
        console.error("Failed to load previous level tasks:", error)
      }
    }
  }

  const startMindfulMode = () => {
    setMindfulMode(true)
    setSoundEnabled(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background-outer flex items-center justify-center">
        <Card className="p-8 text-center bg-container-main">
          <div className="text-4xl mb-4 text-decorative-orange-light">🌱</div>
          <h2 className="text-xl font-bold mb-2 text-dark-gray">Loading Your Garden...</h2>
          <p className="text-light-gray">Preparing your wellness journey</p>
        </Card>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background-outer p-4">
        {/* Falling Leaves Animation */}
        <AnimatePresence>
          {fallingLeaves.map((leaf) => (
            <motion.div
              key={leaf}
              initial={{
                y: -50,
                x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 800),
                opacity: 1,
                rotate: 0,
              }}
              animate={{
                y: (typeof window !== "undefined" ? window.innerHeight : 800) + 50,
                rotate: 360,
                opacity: 0,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 3, ease: "linear" }}
              className="fixed text-2xl pointer-events-none z-10"
            >
              {leaf.split("-")[0]}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Header */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-black text-darkest-gray flex items-center gap-2">
                🌼 Self-Care Garden
                <motion.div animate={{ rotate: isLevelComplete ? 360 : 0 }} transition={{ duration: 0.5 }}>
                  <Sparkles className="w-6 h-6 text-decorative-orange-light" />
                </motion.div>
              </h1>
              <p className="text-medium-gray text-lg">Grow your wellness sanctuary, one level at a time</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge
                variant="secondary"
                className="flex items-center gap-1 bg-brand-light-peach text-dark-gray font-semibold"
              >
                <Flame className="w-4 h-4 text-brand-accent-orange" />
                {userProgress.streak} day streak
              </Badge>
              <Badge
                variant="outline"
                className="flex items-center gap-1 border-brand-medium-brown text-dark-gray font-semibold"
              >
                ⭐ {userProgress.totalXP} XP
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => NotificationManager.requestPermission()}
                className="flex items-center gap-1 bg-container-main text-dark-gray border-brand-medium-brown hover:bg-brand-lightest-peach"
              >
                <Bell className="w-4 h-4" />
                Notifications
              </Button>
            </div>
          </div>

          {/* Garden Visualization */}
          <Card className="mb-6 bg-container-main">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-dark-gray font-bold text-2xl">
                🌱 Your Wellness Garden - {currentLevel.gardenTheme}
                <motion.div
                  animate={{ scale: completedTasks > 0 ? [1, 1.1, 1] : 1 }}
                  transition={{
                    duration: 0.5,
                    repeat: completedTasks > 0 ? Number.POSITIVE_INFINITY : 0,
                    repeatDelay: 2,
                  }}
                >
                  <span className="text-3xl">{getGardenVisualization()}</span>
                </motion.div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-light-gray text-lg mb-2">
                    {completedTasks === 0 && "Start your wellness journey! Each completed task grows your garden 🌱"}
                    {completedTasks > 0 &&
                      completedTasks < tasks.length &&
                      `Your ${currentLevel.name} garden is growing beautifully! 🌸`}
                    {isLevelComplete && `Magnificent! Your ${currentLevel.name} sanctuary is complete! ✨`}
                  </p>
                  <div className="flex flex-wrap gap-1 text-sm text-lightest-gray">
                    {currentLevel.unlocks.map((unlock, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="text-xs border-brand-lightest-peach text-lightest-gray"
                      >
                        {unlock}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button
                  onClick={startMindfulMode}
                  variant="outline"
                  className="flex items-center gap-2 bg-container-main text-dark-gray border-brand-medium-brown hover:bg-brand-lightest-peach"
                >
                  <Maximize className="w-4 h-4" />
                  Mindful Mode
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Level Navigation */}
          <Card className="mb-6 bg-container-main">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-center">
                <div className="flex items-center gap-6">
                  <Button
                    onClick={goToPrevLevel}
                    disabled={!canGoToPrevLevel}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 bg-container-main text-dark-gray border-brand-medium-brown hover:bg-brand-lightest-peach"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Prev
                  </Button>
                  <div className="text-center">
                    <div className="text-3xl mb-1">{currentLevel.emoji}</div>
                    <CardTitle className="text-xl font-bold text-dark-gray">
                      Level {currentLevel.level}: {currentLevel.name}
                    </CardTitle>
                    <p className="text-base text-light-gray">{currentLevel.description}</p>
                  </div>
                  <Button
                    onClick={goToNextLevel}
                    disabled={!canGoToNextLevel}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 bg-container-main text-dark-gray border-brand-medium-brown hover:bg-brand-lightest-peach"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-light-gray">
                  <span>Level Progress</span>
                  <span>{Math.round(progressPercentage)}%</span>
                </div>
                <Progress value={progressPercentage} className="h-2 bg-brand-lightest-peach [&>div]:bg-brand-primary" />
                {isLevelComplete && (
                  <Badge className="w-full justify-center bg-brand-primary text-white font-semibold">
                    <Trophy className="w-3 h-3 mr-1" />
                    Level Complete! {canGoToNextLevel ? "Unlock next level!" : "Max level reached!"}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Task List */}
        <div className="max-w-4xl mx-auto grid gap-4 md:grid-cols-2">
          <AnimatePresence>
            {tasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  className={`relative overflow-hidden transition-all duration-300 cursor-pointer ${
                    task.timerCompleted
                      ? "bg-card-bg-light-orange border-brand-light-peach"
                      : task.timerStarted
                        ? "bg-card-bg-light-orange-transparent border-brand-light-peach"
                        : "hover:shadow-lg hover:border-brand-medium-brown"
                  }`}
                  onClick={() => !task.timerCompleted && !activeTimer && startTask(task)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{task.timerCompleted ? "✅" : task.timerStarted ? "⏳" : "⭕"}</div>
                        <div>
                          <CardTitle
                            className={`text-lg font-semibold ${task.timerCompleted ? "line-through text-lightest-gray" : "text-dark-gray"}`}
                          >
                            {task.gardenElement.emoji} {task.title}
                          </CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-sm border-brand-lightest-peach text-lightest-gray">
                              {task.type}
                            </Badge>
                            <Badge variant="secondary" className="text-sm bg-brand-light-peach text-dark-gray">
                              {task.duration}min
                            </Badge>
                            <Badge variant="outline" className="text-sm border-brand-lightest-peach text-lightest-gray">
                              +{task.difficulty === "easy" ? 10 : task.difficulty === "medium" ? 20 : 30} XP
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="mb-3 p-2 bg-card-bg-more-transparent rounded-lg">
                      <div className="flex items-center gap-2 text-base text-medium-gray">
                        <span>Grows:</span>
                        <span className="text-lg">{task.gardenElement.emoji}</span>
                        <span className="text-sm">({task.gardenElement.name})</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex items-center gap-1 bg-container-main text-dark-gray border-brand-medium-brown hover:bg-brand-lightest-peach"
                              onClick={(e) => {
                                e.stopPropagation()
                                if (task.videoLink) {
                                  window.open(task.videoLink, "_blank")
                                }
                              }}
                            >
                              <PlayCircle className="w-4 h-4" />
                              Learn
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-base">Watch how-to video</p>
                          </TooltipContent>
                        </Tooltip>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex items-center gap-1 bg-container-main text-dark-gray border-brand-medium-brown hover:bg-brand-lightest-peach"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Brain className="w-4 h-4" />
                              Why?
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle className="text-2xl font-bold text-dark-gray">Why This Matters</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <p className="text-medium-gray text-lg">{task.scienceExplanation}</p>
                              <p className="text-sm text-lightest-gray italic">Source: {task.scienceSource}</p>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>

                      <div className="flex items-center gap-1">
                        {activeTimer === task.id ? (
                          <>
                            <span className="text-base font-medium mr-2 text-dark-gray">{formatTime(timeLeft)}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-container-main text-dark-gray border-brand-medium-brown hover:bg-brand-lightest-peach"
                              onClick={(e) => {
                                e.stopPropagation()
                                pauseTimer()
                              }}
                            >
                              {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-container-main text-dark-gray border-brand-medium-brown hover:bg-brand-lightest-peach"
                              onClick={(e) => {
                                e.stopPropagation()
                                resetTimer()
                              }}
                            >
                              <RotateCcw className="w-4 h-4" />
                            </Button>
                          </>
                        ) : task.timerCompleted ? (
                          <Badge className="bg-brand-primary text-white font-semibold">
                            <Trophy className="w-3 h-3 mr-1" />
                            Complete
                          </Badge>
                        ) : task.timerStarted ? (
                          <Badge variant="secondary" className="bg-brand-light-peach text-dark-gray font-semibold">
                            <Zap className="w-3 h-3 mr-1" />
                            In Progress
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="border-brand-lightest-peach text-lightest-gray font-semibold"
                          >
                            Click to Start
                          </Badge>
                        )}
                      </div>
                    </div>

                    {activeTimer === task.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-3"
                      >
                        <Progress
                          value={((task.duration * 60 - timeLeft) / (task.duration * 60)) * 100}
                          className="h-2 bg-brand-lightest-peach [&>div]:bg-brand-primary"
                        />
                      </motion.div>
                    )}
                  </CardContent>

                  {task.timerCompleted && (
                    <motion.div
                      initial={{ scale: 0, rotate: 0 }}
                      animate={{ scale: 1, rotate: 360 }}
                      className="absolute top-2 right-2"
                    >
                      <div className="w-8 h-8 bg-brand-primary rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">✨</span>
                      </div>
                    </motion.div>
                  )}
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Level Complete Celebration */}
        <AnimatePresence>
          {isLevelComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
            >
              <Card className="p-8 text-center max-w-md mx-4 bg-container-main">
                <motion.div
                  animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: 2 }}
                  className="text-6xl mb-4 text-decorative-orange-light"
                >
                  {currentLevel.emoji}
                </motion.div>
                <h2 className="text-4xl font-bold mb-2 text-dark-gray">Level Complete!</h2>
                <p className="text-medium-gray text-xl mb-4">
                  Amazing! You've mastered <strong className="font-bold">{currentLevel.name}</strong>!
                </p>
                <Badge className="mb-4 bg-brand-primary text-white font-semibold">+100 XP Bonus!</Badge>
                {canGoToNextLevel ? (
                  <Button onClick={goToNextLevel} className="bg-brand-primary text-white hover:bg-brand-darker-brown">
                    Unlock Next Level
                  </Button>
                ) : (
                  <Button
                    onClick={() => window.location.reload()}
                    className="bg-brand-primary text-white hover:bg-brand-darker-brown"
                  >
                    Start New Day
                  </Button>
                )}
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced Mindful Mode */}
        <AnimatePresence>
          {mindfulMode && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`fixed inset-0 bg-gradient-to-br ${AMBIENT_BACKGROUNDS[selectedBackground].gradient} z-50`}
            >
              <div className="absolute inset-0 bg-black/20" />

              {/* Floating Elements Animation */}
              {AMBIENT_BACKGROUNDS[selectedBackground].elements.map((element, index) => (
                <motion.div
                  key={index}
                  className="absolute text-4xl opacity-30 text-decorative-orange-light"
                  initial={{
                    x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 800),
                    y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 600),
                  }}
                  animate={{
                    x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 800),
                    y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 600),
                  }}
                  transition={{
                    duration: 10 + Math.random() * 10,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                >
                  {element}
                </motion.div>
              ))}

              <div className="relative h-full flex flex-col items-center justify-center text-white">
                <Button
                  onClick={() => setMindfulMode(false)}
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 text-white hover:bg-white/20"
                >
                  <X className="w-6 h-6" />
                </Button>

                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                  className="mt-12 text-6xl"
                >
                  {currentLevel.emoji}
                </motion.div>

                <h2 className="text-5xl font-bold mb-4">Mindful Mode</h2>
                <p className="text-2xl mb-8 text-center max-w-2xl font-light">
                  Welcome to your {currentLevel.name} sanctuary. Breathe deeply and let your garden flourish.
                </p>

                {/* Background Selection */}
                <div className="flex gap-4 mb-8">
                  {AMBIENT_BACKGROUNDS.map((bg, index) => (
                    <Button
                      key={index}
                      onClick={() => setSelectedBackground(index)}
                      variant={selectedBackground === index ? "default" : "outline"}
                      className="flex items-center gap-2 bg-white/20 border-white/30 text-white hover:bg-white/30"
                    >
                      <span>{bg.emoji}</span>
                      {bg.name}
                    </Button>
                  ))}
                </div>

                {/* Sound Control */}
                <Button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  variant="outline"
                  className="flex items-center gap-2 bg-white/20 border-white/30 text-white hover:bg-white/30 mb-8"
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  {soundEnabled ? "Sound On" : "Sound Off"}
                </Button>

                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  className="mt-12 text-6xl"
                >
                  {getGardenVisualization()}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </TooltipProvider>
  )
}
