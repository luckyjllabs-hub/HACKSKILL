import { getApps, initializeApp, cert, getApp, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";

export function getFirebaseAdmin(): App | null {
  if (getApps().length > 0) {
    return getApp();
  }

  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!serviceAccountKey || serviceAccountKey.trim().length === 0) {
    return null;
  }

  try {
    const credentials = JSON.parse(serviceAccountKey);
    const projectId =
      credentials.project_id ||
      process.env.FIREBASE_PROJECT_ID ||
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

    return initializeApp({
      credential: cert(credentials),
      projectId,
    });
  } catch (err) {
    console.warn("[Firebase Admin] Initialization skipped (service account key not valid):", err);
    return null;
  }
}

export function getAdminFirestore(): Firestore | null {
  try {
    const adminApp = getFirebaseAdmin();
    if (!adminApp) return null;
    return getFirestore(adminApp);
  } catch (e) {
    return null;
  }
}
