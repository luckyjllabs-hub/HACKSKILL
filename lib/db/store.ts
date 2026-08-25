import fs from "fs";
import path from "path";
import { StudentProfile } from "@/types/student";
import { SEEDED_STUDENTS } from "@/data/seed/students";
import { getAdminFirestore } from "./firebase-admin";

const DB_DIR = path.join(process.cwd(), "data", "db");
const STUDENTS_FILE = path.join(DB_DIR, "students.json");
const PROJECTS_FILE = path.join(DB_DIR, "projects.json");

function ensureDbDirectory() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
}

/**
 * Gets all student profiles from Firebase Firestore or local persistent DB store
 */
export async function getAllStudents(): Promise<StudentProfile[]> {
  ensureDbDirectory();

  // 1. Try Firebase Firestore
  try {
    const firestore = getAdminFirestore();
    if (firestore) {
      const snapshot = await firestore.collection("students").get();
      if (!snapshot.empty) {
        const students: StudentProfile[] = [];
        snapshot.forEach((doc) => students.push(doc.data() as StudentProfile));
        return students;
      }
    }
  } catch (err) {
    // Firestore cloud connection fallback
  }

  // 2. Read from persistent local file
  if (fs.existsSync(STUDENTS_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(STUDENTS_FILE, "utf-8"));
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    } catch (e) {}
  }

  // 3. Initialize & persist default seed dataset
  fs.writeFileSync(STUDENTS_FILE, JSON.stringify(SEEDED_STUDENTS, null, 2), "utf-8");
  return SEEDED_STUDENTS;
}

/**
 * Saves a project and its composed team to Firebase Firestore and local persistent store
 */
export async function saveProjectRecord(record: any): Promise<{ id: string; savedToFirebase: boolean }> {
  ensureDbDirectory();
  const id = record.id || `proj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const recordWithId = { ...record, id, updatedAt: new Date().toISOString() };

  let savedToFirebase = false;

  // 1. Save to Firebase Firestore
  try {
    const firestore = getAdminFirestore();
    if (firestore) {
      await firestore.collection("projects").doc(id).set(recordWithId);
      savedToFirebase = true;
    }
  } catch (err) {
    // Continue to local save
  }

  // 2. Save to local persistent store
  try {
    let projects: any[] = [];
    if (fs.existsSync(PROJECTS_FILE)) {
      try {
        const raw = fs.readFileSync(PROJECTS_FILE, "utf-8").trim();
        if (raw) {
          projects = JSON.parse(raw);
        }
      } catch (parseErr) {
        projects = [];
      }
    }
    projects = [recordWithId, ...projects.filter((p: any) => p.id !== id)];
    fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2), "utf-8");
  } catch (err) {
    console.error("[DB Store] Failed to save project locally:", err);
  }

  return { id, savedToFirebase };
}

/**
 * Gets all saved projects
 */
export async function getAllProjects(): Promise<any[]> {
  ensureDbDirectory();

  // Try Firestore
  try {
    const firestore = getAdminFirestore();
    if (firestore) {
      const snapshot = await firestore.collection("projects").orderBy("createdAt", "desc").get();
      if (!snapshot.empty) {
        const projects: any[] = [];
        snapshot.forEach((doc) => projects.push(doc.data()));
        return projects;
      }
    }
  } catch (err) {}

  if (fs.existsSync(PROJECTS_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(PROJECTS_FILE, "utf-8"));
    } catch (e) {}
  }

  return [];
}
