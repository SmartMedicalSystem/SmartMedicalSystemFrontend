export interface ILabTechnician {
  id: number;

  // Personal Information
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  nationality: string;
  nationalId: string;

  // Employment
  assignedLaboratory: string;
  laboratoryId: number;
  jobTitle: string;
  employmentStatus: string;
  workShift: string;
  joiningDate: string;
  yearsOfExperience: number;

  // Contact Information
  phoneNumber: string;
  alternativePhone: string | null;
  email: string;
  address: string;
  city: string;
  country: string;
  postalCode: string | null;

  // Account Information
  username: string;
  allowLogin: boolean;
  accountActive: boolean;
  receiveNotifications: boolean;
  sendWelcomeEmail: boolean;
  sendLoginCredentials: boolean;

  // Photo
  photoUrl: string | null;
}