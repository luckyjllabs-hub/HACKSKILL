import { StudentProfile } from "@/types/student";
import { getAllStudents, saveProjectRecord } from "./store";
import { SEEDED_STUDENTS } from "@/data/seed/students";
import { getAdminFirestore } from "./firebase-admin";

/**
 * Retrieves student profiles from Firebase Firestore with auto-seed and local fallback
 */
export async function getStudentProfiles(): Promise<StudentProfile[]> {
  return await getAllStudents();
}

/**
 * Seeds or re-syncs the student dataset directly into Firebase Firestore
 */
export async function seedFirebaseDatabase(): Promise<{ count: number; success: boolean; error?: string }> {
  try {
    const firestore = getAdminFirestore();
    if (!firestore) {
      return {
        count: 0,
        success: false,
        error: "Firebase project is not configured in environment variables.",
      };
    }

    const batch = firestore.batch();
    for (const student of SEEDED_STUDENTS) {
      const docRef = firestore.collection("students").doc(student.id);
      batch.set(docRef, student, { merge: true });
    }

    await batch.commit();
    return { count: SEEDED_STUDENTS.length, success: true };
  } catch (err: any) {
    return { count: 0, success: false, error: err.message || "Failed to seed Firestore" };
  }
}
