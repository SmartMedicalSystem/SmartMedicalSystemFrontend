export interface IAddLabTechnician {
  // Personal Information
  firstName: string;
  lastName: string;
  gender: number;
  dateOfBirth: string;
  nationality: string;
  nationalId: string;

  // Employment
  laboratoryId: number;
  jobTitle: string;
  employmentStatus: number;
  workShift: number;
  joiningDate: string;
  yearsOfExperience: number;

  // Contact Information
  phoneNumber: string;
  alternativePhone?: string | null;
  email: string;
  address: string;
  city: string;
  country: string;
  postalCode?: string | null;

  // Account Information
  username: string;
  password: string;
  allowLogin: boolean;
  accountActive: boolean;
  receiveNotifications: boolean;
  sendWelcomeEmail: boolean;
  sendLoginCredentials: boolean;

  // Photo
  photoUrl?: File | null;
}