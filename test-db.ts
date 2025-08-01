import { config } from "dotenv";

// Load environment variables first
config({ path: ".env.local" });

async function testConnection() {
  // Delay import until after env is loaded
  const { sql } = await import("./lib/db");

  try {
    console.log("Testing database connection...");
    console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);

    const result = await sql`SELECT NOW() as current_time`;
    console.log("✅ Database connected successfully!");
    console.log("Current time from database:", result[0].current_time);

    // Check if 'users' table exists
    try {
      const tableCheck = await sql`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      `;

      if (tableCheck.length > 0) {
        console.log("✅ Users table exists");

        const userCount = await sql`SELECT COUNT(*) as count FROM users`;
        console.log(`📊 Total users in database: ${userCount[0].count}`);
      } else {
        console.log("⚠️  Users table does not exist. Run the setup script to create it.");
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("⚠️  Failed to query users table:", error.message);
      } else {
        console.error("⚠️  Unknown error while checking users table:", error);
      }
    }
  } catch (error) {
    console.error("❌ Database connection failed:", error);

    if (error instanceof Error && error.message.includes("DATABASE_URL")) {
      console.log("\n📝 To fix this:");
      console.log("1. Create a .env.local file in your project root");
      console.log("2. Add your Neon database connection string:");
      console.log('   DATABASE_URL="postgresql://username:password@host/database?sslmode=require"');
      console.log("3. Add a JWT secret:");
      console.log('   JWT_SECRET="your-super-secret-jwt-key"');
    }

    process.exit(1);
  }
}

testConnection();
