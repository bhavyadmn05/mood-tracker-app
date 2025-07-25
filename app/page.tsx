"use client"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { FloatingParticles } from "@/components/floating-particles"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push("/auth")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#d4c4b0] flex items-center justify-center">
        <div className="text-2xl text-[#c4836b] animate-pulse">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#d4c4b0] relative overflow-hidden">
      {/* Floating Particles Background */}
      <FloatingParticles />

      {/* Main Content Container - Elevated Cream Card */}
      <div className="min-h-screen max-w-7xl mx-auto my-8 bg-[#faf8f5] backdrop-blur-sm rounded-3xl shadow-2xl relative z-10 overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between px-8 py-6 relative z-10">
          <div className="text-4xl font-black text-transparent bg-gradient-to-r from-[#c4836b] via-[#e6a085] to-[#c4836b] bg-clip-text animate-pulse">
            <span className="inline-block animate-bounce hover:animate-spin transition-all duration-500 hover:scale-110 cursor-pointer bg-gradient-to-r from-[#c4836b] via-[#d4956f] via-[#e6a085] via-[#f2b896] to-[#c4836b] bg-size-200 animate-gradient-x bg-clip-text text-transparent animate-slide-in-left">
              MOOD TRACKER
            </span>
          </div>
          <nav className="flex gap-8 items-center">
            <Link
              href="/about"
              className="text-lg font-semibold text-gray-600 hover:text-gray-800 hover:scale-110 transition-all duration-300 hover:animate-pulse"
            >
              About
            </Link>
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-lg font-medium text-gray-700">Hi, {user.name}! 👋</span>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="border-[#c4836b] text-[#c4836b] hover:bg-[#c4836b] hover:text-white transition-all duration-300 bg-transparent"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Link
                href="/auth"
                className="text-lg font-semibold text-gray-600 hover:text-gray-800 hover:scale-110 transition-all duration-300 hover:animate-pulse"
              >
                Login
              </Link>
            )}
          </nav>
        </header>

        {/* Welcome Message for Authenticated Users */}
        {user && (
          <section className="px-8 py-8 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="bg-gradient-to-r from-[#c4836b]/10 to-[#e6a085]/10 rounded-3xl p-8 mb-8">
                <h2 className="text-3xl font-light text-gray-800 mb-4">
                  Welcome back,{" "}
                  <span className="font-bold text-transparent bg-gradient-to-r from-[#c4836b] to-[#e6a085] bg-clip-text">
                    {user.name}
                  </span>
                  !
                </h2>
                <p className="text-lg text-gray-600">
                  Ready to continue your emotional wellness journey? Let's track how you're feeling today.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Hero Section */}
        <section className="px-8 py-16 relative z-10">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="relative w-full h-[400px] bg-gray-50/50 backdrop-blur-sm rounded-3xl overflow-hidden">
                <Image
                  src="/good-mood.png?height=400&width=500"
                  alt="Mood tracking visualization"
                  fill
                  className="object-contain p-8"
                />
                {/* Enhanced decorative elements */}
                <div className="absolute bottom-8 left-4 w-4 h-4 bg-orange-400 rounded-full animate-bounce"></div>
                <div className="absolute top-1/2 right-4 w-3 h-3 bg-orange-300 rounded-full animate-pulse"></div>
                <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-[#c4836b] rounded-full animate-ping"></div>
                <div className="absolute bottom-1/3 right-1/4 w-5 h-5 bg-[#e6a085] rounded-full animate-bounce delay-300"></div>
              </div>
            </div>
            <div className="space-y-8 relative animate-slide-in-right">
              {/* Decorative elements around text */}
              <div className="absolute -top-4 -left-4 w-8 h-8 text-orange-300 opacity-60 animate-spin-slow">✨</div>
              <div className="absolute top-1/2 -right-6 w-6 h-6 text-[#c4836b] opacity-40 animate-bounce">💫</div>

              <div className="space-y-6">
                <h1 className="text-4xl lg:text-6xl leading-tight overflow-hidden">
                  <span className="inline-block font-light text-gray-700 hover:text-gray-900 transition-colors duration-500">
                    Because
                  </span>{" "}
                  <span className="inline-block font-medium text-gray-800 hover:scale-105 transition-transform duration-300">
                    Every
                  </span>{" "}
                  <span className="inline-block font-black text-transparent bg-gradient-to-r from-[#c4836b] via-[#e6a085] to-[#f2b896] bg-clip-text animate-gradient-x bg-size-200 hover:animate-pulse cursor-pointer text-5xl lg:text-7xl">
                    Feeling
                  </span>
                  <br />
                  <span className="inline-block font-light text-gray-700 mt-2">Deserves to Be </span>
                  <span className="inline-block font-bold text-gray-900 relative">
                    Seen
                    <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-[#c4836b] to-[#e6a085] rounded-full animate-pulse"></div>
                  </span>
                </h1>
              </div>

              <div className="space-y-6 relative">
                <div className="absolute -left-3 top-0 w-1 h-full bg-gradient-to-b from-[#c4836b] to-transparent rounded-full opacity-30"></div>
                <p className="text-lg lg:text-xl text-gray-600 leading-relaxed pl-6 font-light">
                  <span className="inline-block hover:text-[#c4836b] transition-colors duration-300 cursor-default">
                    Capture
                  </span>{" "}
                  <span className="inline-block font-medium text-gray-800 hover:scale-105 transition-transform duration-300 cursor-default">
                    how you feel
                  </span>{" "}
                  <span className="inline-block hover:text-[#c4836b] transition-colors duration-300 cursor-default">
                    and let
                  </span>{" "}
                  <span className="inline-block font-semibold text-transparent bg-gradient-to-r from-[#c4836b] to-[#e6a085] bg-clip-text hover:animate-pulse cursor-default">
                    data guide
                  </span>{" "}
                  <span className="inline-block hover:text-[#c4836b] transition-colors duration-300 cursor-default">
                    your journey to
                  </span>{" "}
                  <span className="inline-block font-bold text-gray-900 relative cursor-default hover:text-[#c4836b] transition-colors duration-300">
                    emotional wellness
                    <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#c4836b] rounded-full hover:w-full transition-all duration-500"></div>
                  </span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Catalog Section */}
        <section className="px-8 py-16 relative z-10">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-light text-gray-800 text-center mb-12">
              {user ? `What would you like to do today, ${user.name}?` : "What Would You Like to Do Today?"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Product 1 */}
              <Card className="bg-gray-50/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300 hover:shadow-xl">
                <div className="rflex items-center justify-center h-64">
                  <Image
                    src="/mood.png?height=256&width=300"
                    alt="Rouge 540 Baccarat"
                    height={100}
                    width={250}
                    className="object-cover mx-auto"
                  />
                </div>
                <CardContent className="p-6 text-center space-y-4">
                  <h3 className="font-bold text-gray-800">Mood Tracking</h3>
                  <p className="text-sm text-gray-600">
                    Track how you're feeling daily and understand your emotional trends over time.
                  </p>
                  <Button
  className="w-full bg-[#c4836b] hover:bg-[#b5745a] text-white py-2 rounded-xl hover:scale-105 transition-all duration-300 shadow-md"
  onClick={() => window.location.href = 'http://localhost:8501'}
>
  
                    {user ? "Log My Mood" : "Get Started"}
                  </Button>
                </CardContent>
              </Card>

              {/* Product 2 */}
              <Card className="bg-gray-50/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300 hover:shadow-xl">
                <div className="rflex items-center justify-center h-64">
                  <Image
                    src="/write.png?height=256&width=300"
                    alt="Escentric Molecules 02"
                    height={140}
                    width={250}
                    className="object-cover mx-auto"
                  />
                </div>
                <CardContent className="p-6 text-center space-y-4">
                  <h3 className="font-bold text-gray-800">Lets Journal</h3>
                  <p className="text-sm text-gray-600">
                    Reflect your day and express your thoughts in a safe and beautiful journal.
                  </p>
                  <Button onClick={() => window.location.href = 'http://localhost:3000'}className="w-full bg-[#c4836b] hover:bg-[#b5745a] text-white py-2 rounded-xl hover:scale-105 transition-all duration-300 shadow-md" >
                    {user ? "Start Journaling" : "Get Started"}
                  </Button>
                </CardContent>
              </Card>

              {/* Product 3 */}
              <Card className="bg-gray-50/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300 hover:shadow-xl">
                <div className="rflex items-center justify-center h-64">
                  <Image
                    src="/self-care.png"
                    height={140}
                    width={300}
                    alt="Narciso Ex Nihilo"
                    className="object-cover mx-auto"
                  />
                </div>
                <CardContent className="p-6 text-center space-y-4">
                  <h3 className="font-bold text-gray-800">Your Daily Dose of Self-Care</h3>
                  <p className="text-sm text-gray-600">
                    Discover personalized self-care routines to relax, recharge, and nurture your well-being.
                  </p>
                  <Button className="w-full bg-[#c4836b] hover:bg-[#b5745a] text-white py-2 rounded-xl hover:scale-105 transition-all duration-300 shadow-md" onClick={() => window.location.href = 'http://localhost:3002'}>
                    {user ? "Explore Self-Care Tips" : "Get Started"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
