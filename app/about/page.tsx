import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FloatingParticles } from "@/components/floating-particles"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#d4c4b0] relative overflow-hidden">
      {/* Floating Particles Background */}
      <FloatingParticles />

      {/* Main Content Container - Elevated Cream Card */}
      <div className="min-h-screen max-w-7xl mx-auto my-8 bg-[#faf8f5] backdrop-blur-sm rounded-3xl shadow-2xl relative z-10 overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between px-8 py-6 relative z-10">
          <Link
            href="/"
            className="text-4xl font-black text-transparent bg-gradient-to-r from-[#c4836b] via-[#e6a085] to-[#c4836b] bg-clip-text animate-pulse"
          >
            <span className="inline-block animate-bounce hover:animate-spin transition-all duration-500 hover:scale-110 cursor-pointer bg-gradient-to-r from-[#c4836b] via-[#d4956f] via-[#e6a085] via-[#f2b896] to-[#c4836b] bg-size-200 animate-gradient-x bg-clip-text text-transparent animate-slide-in-left">
              MOOD TRACKER
            </span>
          </Link>
          <nav className="flex gap-8">
            <Link
              href="/"
              className="text-lg font-semibold text-gray-600 hover:text-gray-800 hover:scale-110 transition-all duration-300 hover:animate-pulse"
            >
              Home
            </Link>
            <Link
              href="/auth"
              className="text-lg font-semibold text-gray-600 hover:text-gray-800 hover:scale-110 transition-all duration-300 hover:animate-pulse"
            >
              Login
            </Link>
          </nav>
        </header>

        {/* Hero Section */}
        <section className="px-8 py-16 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-6 animate-slide-in-left">
              <h1 className="text-5xl lg:text-7xl font-light text-gray-800 leading-tight">
                About{" "}
                <span className="font-black text-transparent bg-gradient-to-r from-[#c4836b] via-[#e6a085] to-[#f2b896] bg-clip-text animate-gradient-x bg-size-200">
                  Mood Tracker
                </span>
              </h1>
              <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
                Your personal companion for emotional wellness, self-discovery, and mental health awareness
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="px-8 py-16 relative z-10">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 animate-slide-in-left">
              <div className="space-y-6">
                <h2 className="text-4xl font-light text-gray-800">
                  Our{" "}
                  <span className="font-bold text-transparent bg-gradient-to-r from-[#c4836b] to-[#e6a085] bg-clip-text">
                    Mission
                  </span>
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  We believe that understanding your emotions is the first step toward better mental health. Mood
                  Tracker empowers you to recognize patterns, celebrate progress, and build emotional resilience through
                  mindful self-reflection and data-driven insights.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Every feeling matters. Every emotion tells a story. We're here to help you listen to yours.
                </p>
              </div>
            </div>
            <div className="relative animate-slide-in-right">
              <div className="relative w-full h-[400px] bg-gradient-to-br from-orange-100 to-orange-50 rounded-3xl overflow-hidden shadow-lg">
                <Image
                  src="/emojis.png?height=400&width=500"
                  alt="Emotional wellness illustration"
                  fill
                  className="object-contain p-8"
                />
                {/* Decorative elements */}
                <div className="absolute top-8 right-8 w-6 h-6 bg-[#c4836b] rounded-full animate-pulse"></div>
                <div className="absolute bottom-12 left-8 w-4 h-4 bg-orange-400 rounded-full animate-bounce"></div>
                <div className="absolute top-1/3 left-4 w-3 h-3 bg-[#e6a085] rounded-full animate-ping"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-8 py-16 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-light text-gray-800 mb-6">
                Why Choose{" "}
                <span className="font-bold text-transparent bg-gradient-to-r from-[#c4836b] to-[#e6a085] bg-clip-text">
                  Mood Tracker?
                </span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Designed with care, built for your emotional journey
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <Card className="bg-gradient-to-br from-orange-50 to-orange-100/50 backdrop-blur-sm border-0 shadow-lg rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300 hover:shadow-xl">
                <CardContent className="p-8 text-center space-y-6">
                  <div className="w-16 h-16 bg-[#c4836b] rounded-full flex items-center justify-center mx-auto">
                    <span className="text-2xl text-white">📊</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Smart Analytics</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Discover patterns in your emotional journey with beautiful visualizations and meaningful insights
                    that help you understand your mental health trends.
                  </p>
                </CardContent>
              </Card>

              {/* Feature 2 */}
              <Card className="bg-gradient-to-br from-orange-50 to-orange-100/50 backdrop-blur-sm border-0 shadow-lg rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300 hover:shadow-xl">
                <CardContent className="p-8 text-center space-y-6">
                  <div className="w-16 h-16 bg-[#c4836b] rounded-full flex items-center justify-center mx-auto">
                    <span className="text-2xl text-white">🔒</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Privacy First</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Your emotional data is sacred. We use end-to-end encryption and never share your personal
                    information. Your feelings, your control.
                  </p>
                </CardContent>
              </Card>

              {/* Feature 3 */}
              <Card className="bg-gradient-to-br from-orange-50 to-orange-100/50 backdrop-blur-sm border-0 shadow-lg rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300 hover:shadow-xl">
                <CardContent className="p-8 text-center space-y-6">
                  <div className="w-16 h-16 bg-[#c4836b] rounded-full flex items-center justify-center mx-auto">
                    <span className="text-2xl text-white">🌱</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Personal Growth</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Transform self-awareness into actionable growth with personalized recommendations, mindfulness
                    exercises, and wellness resources.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="px-8 py-16 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-[#c4836b]/10 to-[#e6a085]/10 rounded-3xl p-12">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-light text-gray-800 mb-4">
                  Join Thousands on Their{" "}
                  <span className="font-bold text-transparent bg-gradient-to-r from-[#c4836b] to-[#e6a085] bg-clip-text">
                    Wellness Journey
                  </span>
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="space-y-2">
                  <div className="text-4xl font-black text-transparent bg-gradient-to-r from-[#c4836b] to-[#e6a085] bg-clip-text">
                    50K+
                  </div>
                  <p className="text-gray-600 font-medium">Active Users</p>
                  <p className="text-sm text-gray-500">Tracking their emotional wellness daily</p>
                </div>

                <div className="space-y-2">
                  <div className="text-4xl font-black text-transparent bg-gradient-to-r from-[#c4836b] to-[#e6a085] bg-clip-text">
                    2M+
                  </div>
                  <p className="text-gray-600 font-medium">Mood Entries</p>
                  <p className="text-sm text-gray-500">Feelings captured and understood</p>
                </div>

                <div className="space-y-2">
                  <div className="text-4xl font-black text-transparent bg-gradient-to-r from-[#c4836b] to-[#e6a085] bg-clip-text">
                    95%
                  </div>
                  <p className="text-gray-600 font-medium">Satisfaction Rate</p>
                  <p className="text-sm text-gray-500">Users report improved self-awareness</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="px-8 py-16 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-6">
              <h2 className="text-4xl font-light text-gray-800">
                Ready to Start Your{" "}
                <span className="font-bold text-transparent bg-gradient-to-r from-[#c4836b] to-[#e6a085] bg-clip-text">
                  Emotional Journey?
                </span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Take the first step toward better emotional wellness. Your feelings matter, and your journey starts
                today.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/auth">
                <Button className="bg-[#c4836b] hover:bg-[#b5745a] text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/">
                <Button
                  variant="outline"
                  className="border-[#c4836b] text-[#c4836b] hover:bg-[#c4836b] hover:text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 bg-transparent"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
