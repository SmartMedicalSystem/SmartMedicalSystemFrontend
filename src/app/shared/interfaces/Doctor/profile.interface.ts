// ============ Profile (self-service) DTOs ============
// مطابقة لـ Application.DTOs.Profile في الباك اند (ProfileController)

// TODO: شكل الـ DTO ده تخمين — الباك بعتلنا بس ProfileUpdateDto بالكود الكامل.
// اتأكد من الحقول الفعلية اللي GetMyProfile بيرجعها من Swagger.
export interface ProfileReadDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  photoUrl?: string; // TODO: تأكد لو ده relative path محتاج base URL قدامه ولا absolute URL جاهز
}

// مطابقة تمامًا لـ Application.DTOs.Profile.ProfileUpdateDto
// ملحوظة: كل الحقول nullable في الباك (IFormFile? photo كمان)، وبما إنها
// [FromForm] لازم تتبعت كـ multipart/form-data (FormData) مش JSON عادي.
export interface ProfileUpdateDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  photo?: File; // هيتحط في FormData باسم "PhotoUrl" مطابق لاسم الخاصية في الباك
}

// TODO: شكل الـ DTO ده تخمين بالكامل — مبعتش كوده. الأسماء هنا افتراضية
// (Username + إعدادات حساب بسيطة)، لازم تتأكد من UserUpdateDto الحقيقي.
export interface UserUpdateDto {
  userName?: string;
  receiveNotifications?: boolean;
}

// TODO: شكل الـ DTO ده تخمين بالكامل برضو — مبعتش كوده.
// الأسماء هنا مبنية على نمط شائع لتغيير كلمة السر.
export interface ChangePasswordRequestDto {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
