import { HttpContext, HttpContextToken } from '@angular/common/http';

// علامة نحطها على أي request عايزينه يتنفذ من غير ما يشغّل الـ Global Loading
// Overlay (زي requests بتاعة widgets صغيرة عندها اللودينج الخاص بيها، زي الـ
// AI Chat هنا اللي أصلاً عنده chatLoading() signal بيعرض "AI is thinking...").
export const SKIP_LOADING = new HttpContextToken<boolean>(() => false);

// helper بسيط عشان تستخدمه في أي HttpClient call: { context: skipLoading() }
export function skipLoading(): HttpContext {
  return new HttpContext().set(SKIP_LOADING, true);
}
