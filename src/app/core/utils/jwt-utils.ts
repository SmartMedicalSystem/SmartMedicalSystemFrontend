/**
 * يفك تشفير الـ payload بتاع أي JWT (base64url) من غير التحقق من الـ signature
 * (التحقق مسؤولية الباك اند؛ إحنا بس محتاجين نقرا الـ claims في الفرونت).
 */
export function decodeJwt<T = Record<string, unknown>>(token: string): T | null {
  try {
    const payload = token.split('.')[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join('')
    );
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

// أسماء الـ claims المحتملة لمعرّف اليوزر الحالي (nameidentifier/sub القياسي)
const ID_CLAIM_KEYS = [
  'sub',
  'nameid',
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier',
  'base_person_id',
];

/**
 * يستخرج id الدكتور الحالي (كرقم) من التوكن.
 * بيرجع null لو التوكن مش موجود/مش قابل للفك/مفيهوش أي claim من دول.
 */
export function getCurrentDoctorIdFromToken(token: string | null): number | null {
  if (!token) return null;

  const payload = decodeJwt<Record<string, unknown>>(token);
  if (!payload) return null;

  for (const key of ID_CLAIM_KEYS) {
    const value = payload[key];
    if (value !== undefined && value !== null) {
      const id = Number(value);
      if (!Number.isNaN(id)) return id;
    }
  }

  return null;
}

// ملحوظة: استخراج صورة اليوزر من claim الـ photo_url اتشال من هنا عشان منكررش
// نفس المنطق اللي موجود أصلاً في AuthenticationService.setToken() (اللي بيحسب
// userImage من نفس الـ claim + بيحط base URL قدامه). استخدم
// authService.getUserImage() أو authService.userImageSignal() بدل ما تفك
// التوكن تاني هنا.
