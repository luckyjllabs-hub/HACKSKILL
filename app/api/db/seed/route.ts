import { NextResponse } from "next/server";
import { seedFirebaseDatabase } from "@/lib/db/students";

export async function POST() {
  try {
    const result = await seedFirebaseDatabase();
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json({
      message: `Successfully seeded ${result.count} student profiles into Firebase Firestore.`,
      count: result.count,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to seed database" },
      { status: 500 }
    );
  }
}
