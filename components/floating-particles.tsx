"use client"

import { useEffect, useState } from "react"

interface Particle {
  id: number
  x: number
  y: number
  size: number
  color: string
  duration: number
  delay: number
  opacity: number
}

export function FloatingParticles() {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    // Create initial particles
    const initialParticles: Particle[] = []
    const colors = ["#c4836b", "#e6a085", "#f2b896", "#d4956f", "#ff9a56"]

    for (let i = 0; i < 15; i++) {
      initialParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        duration: Math.random() * 20 + 15, // 15-35 seconds for smooth movement
        delay: Math.random() * 5,
        opacity: Math.random() * 0.7 + 0.3,
      })
    }

    setParticles(initialParticles)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            opacity: particle.opacity,
            transform: `translate(-50%, -50%)`,
            animation: `smoothFloat ${particle.duration}s linear infinite`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}

      {/* Additional star shapes with smooth movement */}
      {[...Array(8)].map((_, i) => (
        <div
          key={`star-${i}`}
          className="absolute text-orange-300 opacity-60"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            fontSize: `${Math.random() * 16 + 12}px`,
            animation: `smoothTwinkle ${15 + Math.random() * 10}s linear infinite, starFloat ${20 + Math.random() * 15}s linear infinite`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        >
          ✦
        </div>
      ))}
    </div>
  )
}
