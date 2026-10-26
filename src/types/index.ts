export type UserRole = 'admin' | 'student' | 'parent';

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  department?: string;
  student_id?: string;
  study_year?: number;
  phone?: string;
  avatar_url?: string;
  parent_email?: string; // used when linking
  created_at: string;
}

export interface ParentStudentLink {
  id: string;
  parent_id: string;
  student_id: string;
  student_name?: string;
  student_roll?: string;
  department?: string;
  study_year?: number;
  verification_status: 'verified' | 'pending' | 'rejected';
  verified_at?: string;
  created_at: string;
}

export type EventCategory = 
  | 'Technical' 
  | 'Cultural' 
  | 'Sports' 
  | 'Workshops' 
  | 'Seminars' 
  | 'Competitions';

export type EventVisibility = 'Public' | 'College-only' | 'Restricted';
export type EventStatus = 'draft' | 'published' | 'cancelled';

export interface CampusEvent {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  banner_url: string;
  start_at: string; // ISO string
  end_at: string;   // ISO string
  venue: string;
  organizer_id?: string;
  organizer_name: string;
  capacity: number;
  registered_count: number;
  registration_opens_at: string;
  registration_deadline: string;
  parent_permission_required: boolean;
  attendance_enabled: boolean;
  certificate_enabled: boolean;
  visibility: EventVisibility;
  status: EventStatus;
  eligible_departments: string[]; // e.g. ['All'] or ['Computer Science', 'Electronics']
  eligible_years: number[]; // [1, 2, 3, 4]
  rules?: string[];
  contact_email?: string;
  departure_time?: string;
  return_time?: string;
  created_at: string;
}

export type RegistrationStatus = 'Pending' | 'Confirmed' | 'Waitlisted' | 'Cancelled' | 'Rejected';

export interface Registration {
  id: string;
  event_id: string;
  student_id: string;
  registration_status: RegistrationStatus;
  registered_at: string;
  updated_at: string;
  qr_code_token?: string;
  // Denormalized / joined for ease of UI
  event?: CampusEvent;
  student?: UserProfile;
}

export type PermissionStatus = 'Not Required' | 'Pending' | 'Approved' | 'Declined';

export interface PermissionRequest {
  id: string;
  registration_id: string;
  event_id: string;
  student_id: string;
  parent_id: string;
  status: PermissionStatus;
  decision_at?: string;
  decision_notes?: string;
  created_at: string;
  // Joined for display
  event?: CampusEvent;
  student?: UserProfile;
}

export type AttendanceStatus = 'Registered' | 'Attended' | 'Absent' | 'Cancelled';

export interface AttendanceRecord {
  id: string;
  event_id: string;
  student_id: string;
  status: AttendanceStatus;
  checked_in_at?: string;
  checked_in_by?: string;
  // Joined
  event?: CampusEvent;
  student?: UserProfile;
}

export type NotificationType = 'info' | 'urgent' | 'permission' | 'event' | 'attendance';

export interface CampusNotification {
  id: string;
  recipient_id: string;
  title: string;
  message: string;
  type: NotificationType;
  read_at?: string | null;
  link_to?: string;
  created_at: string;
}

export type AnnouncementAudience = 'all' | 'students' | 'parents' | 'departments';

export interface Announcement {
  id: string;
  title: string;
  message: string;
  audience: AnnouncementAudience;
  department?: string;
  event_id?: string;
  published_at: string;
  expires_at?: string;
  created_by: string;
  creator_name?: string;
  is_urgent?: boolean;
}

export interface CertificateRecord {
  id: string;
  event_id: string;
  student_id: string;
  certificate_url?: string;
  certificate_code: string;
  issued_at: string;
  event?: CampusEvent;
  student?: UserProfile;
}
