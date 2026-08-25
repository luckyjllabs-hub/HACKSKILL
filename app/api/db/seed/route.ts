import { NextResponse } from "next/server";
import { seedFirebaseDatabase } from "@/lib/db/students";
import { getAllStudents } from "@/lib/db/store";

export async function GET() {
  try {
    const students = await getAllStudents();
    return NextResponse.json({
      success: true,
      count: students.length,
      message: `Database contains ${students.length} student profiles.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to inspect database" },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const result = await seedFirebaseDatabase();
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }
    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${result.count} student profiles into Firebase Firestore.`,
      count: result.count,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to seed database" },
      { status: 500 }
    );
  }
}
