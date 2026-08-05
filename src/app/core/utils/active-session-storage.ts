/**
 * بيتتبع الـ Session "النشطة" الحالية لكل مريض في الفرونت بس (sessionStorage)،
 * عشان الدكتور مايحتاجش يعمل Session جديدة كل مرة عايز يطلب فيها تحليل
 * أو يعمل أي حاجة تانية جوه نفس زيارة المريض.
 *
 * ده حل مؤقت في الفرونت لحد ما الباك يضيف مفهوم حقيقي لحالة الـ Session
 * (IsClosed / Status) وendpoint لقفلها فعليًا في الداتابيز.
 */

const STORAGE_PREFIX = 'active-session:';

export function getActiveSessionId(patientId: number): number | null {
  try {
    const raw = sessionStorage.getItem(`${STORAGE_PREFIX}${patientId}`);
    return raw ? Number(raw) : null;
  } catch {
    return null;
  }
}

export function setActiveSessionId(patientId: number, sessionId: number): void {
  try {
    sessionStorage.setItem(`${STORAGE_PREFIX}${patientId}`, String(sessionId));
  } catch {
    // sessionStorage مش متاح (مثلاً private mode) - تجاهل بهدوء
  }
}

export function clearActiveSessionId(patientId: number): void {
  try {
    sessionStorage.removeItem(`${STORAGE_PREFIX}${patientId}`);
  } catch {
    // تجاهل
  }
}
