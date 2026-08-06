import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { skipLoading } from '../tokens/skip-loading.token';
// كل الانترفيسات اتشالت من هنا وبقت كل واحدة في ملفها الخاص جوه shared/interfaces
import { Patient } from '../../shared/interfaces/Doctor/patient.interface';
import { PaginatedResponse } from  '../../shared/interfaces/Doctor/paginated-response.interface';
import {
  RequestLabsCreateDto,
  RequestLabsUpdateStatusDto,
  RequestLabsReadDto,
} from '../../shared/interfaces/Doctor/request-labs.interface';
import { LabTestReadDto } from '../../shared/interfaces/Doctor/lab-test.interface';
import {
  DoctorReadDto,
  DoctorCreateDto,
  DoctorUpdateDto,
  Doctor,
} from '../../shared/interfaces/Doctor/doctor.interface';
import {
  AIChatRequestDto,
  AIChatResponseDto,
} from '../../shared/interfaces/Doctor/ai-chat.interface';
import {
  SessionCreateDto,
  SessionUpdateDto,
  SessionReadDto,
} from '../../shared/interfaces/Doctor/session.interface';
import {
  PatientResultReadDto,
  PatientResultCreateDto,
  PatientResultUpdateDto,
} from '../../shared/interfaces/Doctor/patient-result.interface';
import {
  PatientResultAIAnalysisDto,
  PatientFullAIReportDto,
} from '../../shared/interfaces/Doctor/patient-ai-report.interface';
import {
  ProfileReadDto,
  ProfileUpdateDto,
  UserUpdateDto,
  ChangePasswordRequestDto,
} from '../../shared/interfaces/Doctor/profile.interface';
import { CreateDoctorDto } from '../../shared/interfaces/Doctor/create-doctor.interface';
import { UpdateDoctorDto } from '../../shared/interfaces/Doctor/update-doctor.interface';
import { DoctorResponse } from '../../shared/interfaces/Doctor/doctor-response.interface';

// إعادة تصدير الأنواع دي عشان أي ملف قديم بيستوردها من doctor-service ما ينكسرش
// (زي ما حصل قبل كده مع Patient). لو كل الأماكن اتظبطت تستورد من shared/interfaces
// مباشرة تقدر تشيل الـ export type block ده لاحقًا.
export type { PaginatedResponse } from '../../shared/interfaces/Doctor/paginated-response.interface';
export type {
  RequestLabsCreateDto,
  RequestLabsUpdateStatusDto,
  RequestLabsReadDto,
} from '../../shared/interfaces/Doctor/request-labs.interface';
export type { LabTestReadDto } from '../../shared/interfaces/Doctor/lab-test.interface';
export type {
  DoctorReadDto,
  DoctorCreateDto,
  DoctorUpdateDto,
} from '../../shared/interfaces/Doctor/doctor.interface';
export type {
  SessionCreateDto,
  SessionUpdateDto,
  SessionReadDto,
} from '../../shared/interfaces/Doctor/session.interface';
export type {
  PatientResultReadDto,
  PatientResultCreateDto,
  PatientResultUpdateDto,
} from '../../shared/interfaces/Doctor/patient-result.interface';
export type {
  PatientResultElementSummaryDto,
  PatientResultAIAnalysisDto,
  PatientFullAIReportDto,
} from '../../shared/interfaces/Doctor/patient-ai-report.interface';
export type {
  ProfileReadDto,
  ProfileUpdateDto,
  UserUpdateDto,
  ChangePasswordRequestDto,
} from '../../shared/interfaces/Doctor/profile.interface';

@Injectable({
  providedIn: 'root',
})
export class DoctorService {

  private readonly apiUrlP =
    'https://smartmedicalsystem.runasp.net/api/Patients';

  private readonly requestLabsApiUrl =
    'https://smartmedicalsystem.runasp.net/api/RequestLabs';

  private readonly labTestsApiUrl =
    'https://smartmedicalsystem.runasp.net/api/LabTests';

  private readonly doctorsApiUrl =
    'https://smartmedicalsystem.runasp.net/api/Doctors';

  private readonly sessionsApiUrl =
    'https://smartmedicalsystem.runasp.net/api/Sessions';

  private readonly patientResultsApiUrl =
    'https://smartmedicalsystem.runasp.net/api/PatientResults';

  // ⚠️ كان متظبط غلط على https://openrouter.ai/api/v1 (ده الـ base URL بتاع
  // الموديل الخارجي اللي الباك اند بينده بيه من جواه، مش راوت الكونترولر بتاعنا).
  // الصح إن الفرونت ينده على السيرفر بتاعنا نفسه على الكونترولر:
  // [Route("api/[controller]")] public class PatientAIReportsController
  private readonly patientAIReportsApiUrl =
    'https://smartmedicalsystem.runasp.net/api/PatientAIReports';

    private readonly aiChatApiUrl =
    'https://smartmedicalsystem.runasp.net/api/rag/chat';

  private readonly profileApiUrl =
    'https://smartmedicalsystem.runasp.net/api/Profile';

    private readonly GENDER_TO_ENUM: Record<string, number> = {
  Male: 0,
  Female: 1,
};

  constructor(private http: HttpClient) {}

  getAllPatients(
    pageNumber: number = 1,
    pageSize: number = 10,
    search?: string,
    gender?: string,
    minAge?: number,
    maxAge?: number
  ): Observable<PaginatedResponse<Patient>> {

    let params = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize);

    if (search) {
      params = params.set('search', search);
    }

    if (gender) {
      // الباك اند بيستقبل الـ gender كـ string ("Male" / "Female") مش رقم
      params = params.set('gender', gender);
    }

    if (minAge !== undefined) {
      params = params.set('minAge', minAge);
    }

    if (maxAge !== undefined) {
      params = params.set('maxAge', maxAge);
    }

    return this.http.get<PaginatedResponse<Patient>>(this.apiUrlP, {
      params,
    });
  }

  // مطابقة لـ PatientsController.GetById
  getPatientById(id: number): Observable<Patient> {
    return this.http.get<Patient>(`${this.apiUrlP}/by-id/${id}`);
  }

  // ============ Request Labs ============

  getLabRequestsBySession(
    sessionId: number,
    pageNumber: number = 1,
    pageSize: number = 10
  ): Observable<PaginatedResponse<RequestLabsReadDto>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize);

    return this.http.get<PaginatedResponse<RequestLabsReadDto>>(
      `${this.requestLabsApiUrl}/by-session/${sessionId}`,
      { params }
    );
  }

  getLabRequestById(id: number): Observable<RequestLabsReadDto> {
    return this.http.get<RequestLabsReadDto>(`${this.requestLabsApiUrl}/by-id/${id}`);
  }

  createLabRequest(dto: RequestLabsCreateDto): Observable<RequestLabsReadDto> {
    return this.http.post<RequestLabsReadDto>(this.requestLabsApiUrl, dto);
  }

  updateLabRequestStatus(
    id: number,
    dto: RequestLabsUpdateStatusDto
  ): Observable<RequestLabsReadDto> {
    return this.http.put<RequestLabsReadDto>(
      `${this.requestLabsApiUrl}/by-id/${id}/status`,
      dto
    );
  }

  // ============ Lab Tests ============

  // مطابقة لـ LabTestsController.GetAll
  getLabTests(
    pageNumber: number = 1,
    pageSize: number = 100
  ): Observable<PaginatedResponse<LabTestReadDto>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize);

    return this.http.get<PaginatedResponse<LabTestReadDto>>(this.labTestsApiUrl, {
      params,
    });
  }

  // ============ Doctors ============

  // مطابقة لـ DoctorsController.GetAll
  getAllDoctors(
    pageNumber: number = 1,
    pageSize: number = 10
  ): Observable<PaginatedResponse<DoctorReadDto>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize);

    return this.http.get<PaginatedResponse<DoctorReadDto>>(this.doctorsApiUrl, {
      params,
    });
  }

  // مطابقة لـ DoctorsController.GetByDepartment
  getDoctorsByDepartment(
    departmentId: number,
    pageNumber: number = 1,
    pageSize: number = 10
  ): Observable<PaginatedResponse<DoctorReadDto>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize);

    return this.http.get<PaginatedResponse<DoctorReadDto>>(
      `${this.doctorsApiUrl}/by-department/${departmentId}`,
      { params }
    );
  }

  // مطابقة لـ DoctorsController.GetById -> [HttpGet("by-id/{id:int}")]
  // ⚠️ كان بيروح غلط لـ GetBySSN({ssn}) قبل كده لأن المسار مكنش فيه by-id/
  getDoctorById(id: number): Observable<DoctorReadDto> {
    return this.http.get<DoctorReadDto>(`${this.doctorsApiUrl}/by-id/${id}`);
  }

  // // مطابقة لـ DoctorsController.Create -> [HttpPost("create")]
  // createDoctor(dto: DoctorCreateDto): Observable<DoctorReadDto> {
  //   return this.http.post<DoctorReadDto>(`${this.doctorsApiUrl}/create`, dto);
  // }

  // مطابقة لـ DoctorsController.UpdateById -> [HttpPut("by-id/{id:int}")]
  updateDoctor(id: number, dto: DoctorUpdateDto): Observable<DoctorReadDto> {
  const payload = {
    ...dto,
    gender: this.GENDER_TO_ENUM[dto.gender] ?? dto.gender,
  };
  return this.http.put<DoctorReadDto>(`${this.doctorsApiUrl}/by-id/${id}`, payload);
}

  // // مطابقة لـ DoctorsController.DeleteById -> [HttpDelete("by-id/{id:int}")]
  // deleteDoctor(id: number): Observable<void> {
  //   return this.http.delete<void>(`${this.doctorsApiUrl}/by-id/${id}`);
  // }

  // ============ Sessions ============

  // مطابقة لـ SessionsController.GetByPatient
  getSessionsByPatient(
    patientId: number,
    pageNumber: number = 1,
    pageSize: number = 10
  ): Observable<PaginatedResponse<SessionReadDto>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize);

    return this.http.get<PaginatedResponse<SessionReadDto>>(
      `${this.sessionsApiUrl}/by-patient/${patientId}`,
      { params }
    );
  }

  // مطابقة لـ SessionsController.GetById
  getSessionById(id: number): Observable<SessionReadDto> {
    return this.http.get<SessionReadDto>(`${this.sessionsApiUrl}/${id}`);
  }

  // مطابقة لـ SessionsController.Create
  createSession(dto: SessionCreateDto): Observable<SessionReadDto> {
    return this.http.post<SessionReadDto>(this.sessionsApiUrl, dto);
  }

  // مطابقة لـ SessionsController.Update
  updateSession(id: number, dto: SessionUpdateDto): Observable<SessionReadDto> {
    return this.http.put<SessionReadDto>(`${this.sessionsApiUrl}/${id}`, dto);
  }

  // مطابقة لـ SessionsController.Delete
  deleteSession(id: number): Observable<void> {
    return this.http.delete<void>(`${this.sessionsApiUrl}/${id}`);
  }

  // ============ Patient Results ============

  // مطابقة لـ PatientResultsController.GetByPatient
  getPatientResultsByPatient(
    patientId: number,
    pageNumber: number = 1,
    pageSize: number = 10
  ): Observable<PaginatedResponse<PatientResultReadDto>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize);

    return this.http.get<PaginatedResponse<PatientResultReadDto>>(
      `${this.patientResultsApiUrl}/by-patient/${patientId}`,
      { params }
    );
  }

  // مطابقة لـ PatientResultsController.GetById
  getPatientResultById(id: number): Observable<PatientResultReadDto> {
    return this.http.get<PatientResultReadDto>(`${this.patientResultsApiUrl}/${id}`);
  }

  // مطابقة لـ PatientResultsController.Create
  createPatientResult(dto: PatientResultCreateDto): Observable<PatientResultReadDto> {
    return this.http.post<PatientResultReadDto>(this.patientResultsApiUrl, dto);
  }

  // مطابقة لـ PatientResultsController.Update
  updatePatientResult(id: number, dto: PatientResultUpdateDto): Observable<PatientResultReadDto> {
    return this.http.put<PatientResultReadDto>(`${this.patientResultsApiUrl}/${id}`, dto);
  }

  // ============ Patient AI Reports ============

  // مطابقة لـ PatientAIReportsController.GenerateForResult
  // بيولّد (أو يعيد توليد) التحليل بالـ AI لنتيجة تحليل واحدة (PatientResult) ويحفظه
  generateAIAnalysisForResult(patientResultId: number): Observable<PatientResultAIAnalysisDto> {
    return this.http.post<PatientResultAIAnalysisDto>(
      `${this.patientAIReportsApiUrl}/results/${patientResultId}/generate`,
      {}
    );
  }

  // مطابقة لـ PatientAIReportsController.GetFullPatientReport
  // التقرير الموحّد لكل نتائج المريض + ملخص شامل من الـ AI
  getFullPatientAIReport(patientId: number): Observable<PatientFullAIReportDto> {
    return this.http.get<PatientFullAIReportDto>(
      `${this.patientAIReportsApiUrl}/patients/${patientId}/full-report`
    );
  }

  // ============ Profile (self-service) ============

  // مطابقة لـ ProfileController.GetMyProfile -> [HttpGet("me/{id:int}")]
  getMyProfile(id: number): Observable<ProfileReadDto> {
    return this.http.get<ProfileReadDto>(`${this.profileApiUrl}/me/${id}`);
  }

  // مطابقة لـ ProfileController.UpdateMyProfile -> [HttpPut("me/{id:int}")]
  // [FromForm] في الباك يعني لازم نبعت multipart/form-data (FormData) مش JSON،
  // عشان يقدر ياخد ملف الصورة (PhotoUrl: IFormFile) مع باقي الحقول النصية.
  updateMyProfile(id: number, dto: ProfileUpdateDto): Observable<ProfileReadDto> {
    const formData = new FormData();

    if (dto.firstName !== undefined) formData.append('FirstName', dto.firstName);
    if (dto.lastName !== undefined) formData.append('LastName', dto.lastName);
    if (dto.email !== undefined) formData.append('Email', dto.email);
    if (dto.phoneNumber !== undefined) formData.append('PhoneNumber', dto.phoneNumber);
    if (dto.address !== undefined) formData.append('Address', dto.address);
    // اسم الحقل هنا لازم يطابق اسم الخاصية في ProfileUpdateDto بالظبط (PhotoUrl)
    // عشان الـ [FromForm] model binding في الباك يلاقيها.
    if (dto.photo) formData.append('PhotoUrl', dto.photo, dto.photo.name);

    return this.http.put<ProfileReadDto>(`${this.profileApiUrl}/me/${id}`, formData);
  }

  // مطابقة لـ ProfileController.UpdateUserInfo -> [HttpPut("me/user-info/{id:int}")]
  // TODO: شكل UserUpdateDto تخمين (شوف الملاحظة في profile.interface.ts) — عدّل
  // بناء الـ FormData هنا لو الحقول الحقيقية مختلفة.
  updateUserInfo(id: number, dto: UserUpdateDto): Observable<void> {
    const formData = new FormData();
    if (dto.userName !== undefined) formData.append('UserName', dto.userName);
    if (dto.receiveNotifications !== undefined) {
      formData.append('ReceiveNotifications', String(dto.receiveNotifications));
    }
    return this.http.put<void>(`${this.profileApiUrl}/me/user-info/${id}`, formData);
  }

  // مطابقة لـ ProfileController.ChangePassword -> [HttpPost("me/change-password/{id:int}")]
  // ده [FromBody] عادي (مش form)، فبيتبعت JSON زي أي endpoint تاني.
  changePassword(id: number, dto: ChangePasswordRequestDto): Observable<unknown> {
    return this.http.post<unknown>(`${this.profileApiUrl}/me/change-password/${id}`, dto);
  }
  // ============ AI Chat ============

// إرسال سؤال للمساعد الطبي AI الخاص بالمريض
askPatientAI(
  dto: AIChatRequestDto
): Observable<AIChatResponseDto> {

  return this.http.post<AIChatResponseDto>(
    this.aiChatApiUrl,
    dto,
    { context: skipLoading() }
  );

}

private apiUrl = 'https://smartmedicalsystem.runasp.net/api/Doctors';

  // ================= GET BY SSN (nationalId) =================
  getDoctorBySSN(ssn: string): Observable<Doctor> {
    return this.http.get<Doctor>(`${this.apiUrl}/${ssn}`);
  }

  // ================= CREATE =================
  addDoctor(dto: CreateDoctorDto): Observable<Doctor> {
    return this.http.post<Doctor>(`${this.apiUrl}/create`, dto);
  }

  // ================= DELETE (بالـ id) =================
  deleteDoctor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/by-id/${id}`);
  }

  updateDoctorY(id: number, dto: UpdateDoctorDto): Observable<Doctor> {
    return this.http.put<Doctor>(`${this.apiUrl}/by-id/${id}`, dto);
  }
  getAllDoctorsY(pageNumber: number = 1, pageSize: number = 10): Observable<DoctorResponse> {
    return this.http.get<DoctorResponse>(
      `${this.apiUrl}?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
  }

}
