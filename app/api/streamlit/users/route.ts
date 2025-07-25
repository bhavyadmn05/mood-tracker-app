import { type NextRequest, NextResponse } from "next/server"
import { getUserByEmail, getUserById } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")
    const id = searchParams.get("id")

    if (!email && !id) {
      return NextResponse.json({ error: "Email or ID parameter is required" }, { status: 400 })
    }

    let user = null
    if (email) {
      user = await getUserByEmail(email)
    } else if (id) {
      user = await getUserById(Number.parseInt(id))
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Return user data without password
    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at,
      },
    })
  } catch (error) {
    console.error("User fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const user = await getUserByEmail(email)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    console.error("User validation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
