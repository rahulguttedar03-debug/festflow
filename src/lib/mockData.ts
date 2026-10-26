import {
  UserProfile,
  CampusEvent,
  Registration,
  PermissionRequest,
  AttendanceRecord,
  CampusNotification,
  Announcement,
  CertificateRecord,
  ParentStudentLink
} from '../types';

export const INITIAL_PROFILES: UserProfile[] = [
  {
    id: 'user-admin-1',
    full_name: 'Dr. Robert Vance',
    email: 'admin@campusflow.edu',
    role: 'admin',
    department: 'Student Affairs',
    phone: '+1 (555) 234-5678',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    created_at: '2026-01-15T08:00:00Z',
  },
  {
    id: 'user-student-1',
    full_name: 'Alex Chen',
    email: 'alex.chen@campusflow.edu',
    role: 'student',
    student_id: 'CS2024-089',
    department: 'Computer Science',
    study_year: 3,
    phone: '+1 (555) 876-5432',
    parent_email: 'chen.family@gmail.com',
    avatar_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    created_at: '2026-02-01T09:30:00Z',
  },
  {
    id: 'user-student-2',
    full_name: 'Sarah Jenkins',
    email: 'sarah.jenkins@campusflow.edu',
    role: 'student',
    student_id: 'EC2023-042',
    department: 'Electronics',
    study_year: 2,
    phone: '+1 (555) 765-4321',
    parent_email: 'm.jenkins@outlook.com',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    created_at: '2026-02-05T11:00:00Z',
  },
  {
    id: 'user-parent-1',
    full_name: 'David Chen',
    email: 'chen.family@gmail.com',
    role: 'parent',
    phone: '+1 (555) 987-6543',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    created_at: '2026-02-10T14:20:00Z',
  },
];

export const INITIAL_PARENT_LINKS: ParentStudentLink[] = [
  {
    id: 'link-1',
    parent_id: 'user-parent-1',
    student_id: 'user-student-1',
    student_name: 'Alex Chen',
    student_roll: 'CS2024-089',
    department: 'Computer Science',
    study_year: 3,
    verification_status: 'verified',
    verified_at: '2026-02-10T15:00:00Z',
    created_at: '2026-02-10T14:25:00Z',
  },
];

export const INITIAL_EVENTS: CampusEvent[] = [
  {
    id: 'evt-1',
    title: 'TechNova 2026 — Annual Technology Fest',
    description: 'The premier university-wide technology festival featuring guest keynotes from industry titans, drone racing, robotics showcases, and competitive programming tracks.',
    category: 'Technical',
    banner_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
    start_at: '2026-11-15T09:00:00Z',
    end_at: '2026-11-16T18:00:00Z',
    venue: 'Main University Auditorium & CS Complex',
    organizer_id: 'user-admin-1',
    organizer_name: 'Dept of Computer Science & ACM Student Chapter',
    capacity: 350,
    registered_count: 218,
    registration_opens_at: '2026-10-01T00:00:00Z',
    registration_deadline: '2026-11-10T23:59:00Z',
    parent_permission_required: false,
    attendance_enabled: true,
    certificate_enabled: true,
    visibility: 'Public',
    status: 'published',
    eligible_departments: ['All'],
    eligible_years: [1, 2, 3, 4],
    rules: [
      'College ID card is strictly mandatory at the entrance',
      'Participants must bring their own laptops for coding tracks',
      'Certificates will only be issued upon verified attendance'
    ],
    contact_email: 'technova@campusflow.edu',
    created_at: '2026-09-15T10:00:00Z',
  },
  {
    id: 'evt-2',
    title: 'CodeSprint — Intercollege 24h Hackathon',
    description: 'An intense 24-hour hackathon where student innovators build solutions for AI, climate tech, and smart campus challenges. Includes overnight stay on campus with dedicated mentorship and food stations.',
    category: 'Competitions',
    banner_url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&auto=format&fit=crop&q=80',
    start_at: '2026-11-20T10:00:00Z',
    end_at: '2026-11-21T12:00:00Z',
    venue: 'Innovation Hub, East Wing Floor 3',
    organizer_id: 'user-admin-1',
    organizer_name: 'Developer Student Club & Incubator Cell',
    capacity: 120,
    registered_count: 95,
    registration_opens_at: '2026-10-15T00:00:00Z',
    registration_deadline: '2026-11-18T20:00:00Z',
    parent_permission_required: true,
    departure_time: 'Nov 20, 10:00 AM',
    return_time: 'Nov 21, 01:00 PM',
    attendance_enabled: true,
    certificate_enabled: true,
    visibility: 'College-only',
    status: 'published',
    eligible_departments: ['Computer Science', 'Electronics', 'Information Technology', 'Data Science'],
    eligible_years: [2, 3, 4],
    rules: [
      'Parental consent is strictly mandatory due to the 24-hour overnight stay requirement',
      'Teams must consist of 3-4 members',
      'All code must be written during the competition window'
    ],
    contact_email: 'hackathon@campusflow.edu',
    created_at: '2026-09-20T11:00:00Z',
  },
  {
    id: 'evt-3',
    title: 'Crescendo — Annual Cultural Festival',
    description: 'A vibrant celebration of music, dance, theatrical arts, and photography. Features live musical concerts, battle of the bands, and culinary street stalls.',
    category: 'Cultural',
    banner_url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&auto=format&fit=crop&q=80',
    start_at: '2026-12-05T14:00:00Z',
    end_at: '2026-12-07T22:00:00Z',
    venue: 'Open Air Amphitheater & Campus Grounds',
    organizer_id: 'user-admin-1',
    organizer_name: 'Cultural Affairs Committee',
    capacity: 600,
    registered_count: 485,
    registration_opens_at: '2026-10-20T00:00:00Z',
    registration_deadline: '2026-12-01T23:59:00Z',
    parent_permission_required: false,
    attendance_enabled: true,
    certificate_enabled: false,
    visibility: 'Public',
    status: 'published',
    eligible_departments: ['All'],
    eligible_years: [1, 2, 3, 4],
    rules: [
      'Open to all university students and faculty',
      'Follow campus security guidelines at concert entry gates',
      'Wristbands must be worn at all times'
    ],
    contact_email: 'crescendo@campusflow.edu',
    created_at: '2026-10-01T09:00:00Z',
  },
  {
    id: 'evt-4',
    title: 'DesignVerse — UI/UX Design Competition',
    description: 'Put your design thinking, user research, and prototyping skills to the test. Redesign complex campus workflows in a 6-hour interactive design showdown evaluated by industry leads.',
    category: 'Competitions',
    banner_url: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=1200&auto=format&fit=crop&q=80',
    start_at: '2026-11-28T10:00:00Z',
    end_at: '2026-11-28T17:00:00Z',
    venue: 'Media & Design Lab, Block C',
    organizer_id: 'user-admin-1',
    organizer_name: 'Design Guild & Interaction Lab',
    capacity: 80,
    registered_count: 64,
    registration_opens_at: '2026-10-10T00:00:00Z',
    registration_deadline: '2026-11-25T18:00:00Z',
    parent_permission_required: false,
    attendance_enabled: true,
    certificate_enabled: true,
    visibility: 'College-only',
    status: 'published',
    eligible_departments: ['All'],
    eligible_years: [1, 2, 3, 4],
    rules: [
      'Figma or Penpot must be used for submissions',
      'Individual or pair participation allowed',
      'Presentation of 5 minutes per submission'
    ],
    contact_email: 'designverse@campusflow.edu',
    created_at: '2026-10-05T12:00:00Z',
  },
  {
    id: 'evt-5',
    title: 'FutureMinds — AI & Generative Agents Workshop',
    description: 'Hands-on masterclass on building LLM agents, RAG architectures, and autonomous workflows. Conducted by visiting AI research scientists.',
    category: 'Workshops',
    banner_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&auto=format&fit=crop&q=80',
    start_at: '2026-11-12T13:30:00Z',
    end_at: '2026-11-12T17:30:00Z',
    venue: 'Seminar Hall 2, Science Complex',
    organizer_id: 'user-admin-1',
    organizer_name: 'AI Research Group',
    capacity: 150,
    registered_count: 142,
    registration_opens_at: '2026-10-05T00:00:00Z',
    registration_deadline: '2026-11-11T12:00:00Z',
    parent_permission_required: false,
    attendance_enabled: true,
    certificate_enabled: true,
    visibility: 'Public',
    status: 'published',
    eligible_departments: ['Computer Science', 'Electronics', 'Mathematics', 'Data Science'],
    eligible_years: [2, 3, 4],
    rules: [
      'Pre-requisite: Basic Python proficiency',
      'Bring your laptop with Python 3.10+ installed',
      'Hands-on lab exercises are graded for certificate eligibility'
    ],
    contact_email: 'futureminds@campusflow.edu',
    created_at: '2026-10-02T14:00:00Z',
  },
  {
    id: 'evt-6',
    title: 'Campus Connect — Alumni & Industry Networking',
    description: 'Connect with distinguished alumni working across Fortune 500 tech companies, venture firms, and research laboratories. Fast-track your career and find mentors.',
    category: 'Seminars',
    banner_url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&auto=format&fit=crop&q=80',
    start_at: '2026-12-10T16:00:00Z',
    end_at: '2026-12-10T20:00:00Z',
    venue: 'Executive Convention Hall',
    organizer_id: 'user-admin-1',
    organizer_name: 'Placement & Alumni Cell',
    capacity: 200,
    registered_count: 165,
    registration_opens_at: '2026-10-25T00:00:00Z',
    registration_deadline: '2026-12-08T18:00:00Z',
    parent_permission_required: false,
    attendance_enabled: true,
    certificate_enabled: true,
    visibility: 'College-only',
    status: 'published',
    eligible_departments: ['All'],
    eligible_years: [3, 4],
    rules: [
      'Business formal or smart casual attire recommended',
      'Digital resumes can be shared via QR code on badge'
    ],
    contact_email: 'alumni@campusflow.edu',
    created_at: '2026-10-12T09:00:00Z',
  },
  {
    id: 'evt-7',
    title: 'National Robotics Expo & Outstation Visit',
    description: 'An educational field visit and competition trip to the National Science & Aerospace Centre in Metro City. Includes transportation, lab visits, and demonstration exhibits.',
    category: 'Technical',
    banner_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&auto=format&fit=crop&q=80',
    start_at: '2026-12-18T07:00:00Z',
    end_at: '2026-12-19T21:00:00Z',
    venue: 'National Aerospace Centre (Off-campus transit)',
    organizer_id: 'user-admin-1',
    organizer_name: 'Robotics & Mechanical Society',
    capacity: 50,
    registered_count: 38,
    registration_opens_at: '2026-10-20T00:00:00Z',
    registration_deadline: '2026-12-10T18:00:00Z',
    parent_permission_required: true,
    departure_time: 'Dec 18, 07:00 AM (Campus Gate 1)',
    return_time: 'Dec 19, 09:00 PM (Campus Gate 1)',
    attendance_enabled: true,
    certificate_enabled: true,
    visibility: 'Restricted',
    status: 'published',
    eligible_departments: ['Mechanical', 'Electronics', 'Computer Science'],
    eligible_years: [2, 3, 4],
    rules: [
      'Formal parental signed permission is mandatory for outstation travel',
      'All meals and chartered transport provided by college',
      'Strict adherence to security curfew'
    ],
    contact_email: 'robotics@campusflow.edu',
    created_at: '2026-10-15T15:00:00Z',
  }
];

export const INITIAL_REGISTRATIONS: Registration[] = [
  {
    id: 'reg-1',
    event_id: 'evt-1',
    student_id: 'user-student-1',
    registration_status: 'Confirmed',
    registered_at: '2026-10-18T14:30:00Z',
    updated_at: '2026-10-18T14:30:00Z',
    qr_code_token: 'CF-TNOV26-ALX901',
  },
  {
    id: 'reg-2',
    event_id: 'evt-2',
    student_id: 'user-student-1',
    registration_status: 'Pending',
    registered_at: '2026-10-24T16:00:00Z',
    updated_at: '2026-10-24T16:00:00Z',
    qr_code_token: 'CF-CSPR26-ALX902',
  },
  {
    id: 'reg-3',
    event_id: 'evt-5',
    student_id: 'user-student-1',
    registration_status: 'Confirmed',
    registered_at: '2026-10-20T10:15:00Z',
    updated_at: '2026-10-20T10:15:00Z',
    qr_code_token: 'CF-FMND26-ALX903',
  },
  {
    id: 'reg-4',
    event_id: 'evt-1',
    student_id: 'user-student-2',
    registration_status: 'Confirmed',
    registered_at: '2026-10-19T11:00:00Z',
    updated_at: '2026-10-19T11:00:00Z',
    qr_code_token: 'CF-TNOV26-SRH904',
  }
];

export const INITIAL_PERMISSION_REQUESTS: PermissionRequest[] = [
  {
    id: 'perm-1',
    registration_id: 'reg-2',
    event_id: 'evt-2',
    student_id: 'user-student-1',
    parent_id: 'user-parent-1',
    status: 'Pending',
    created_at: '2026-10-24T16:00:00Z',
  }
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  {
    id: 'att-1',
    event_id: 'evt-1',
    student_id: 'user-student-1',
    status: 'Registered',
    checked_in_at: undefined,
  },
  {
    id: 'att-2',
    event_id: 'evt-5',
    student_id: 'user-student-1',
    status: 'Attended',
    checked_in_at: '2026-10-22T13:45:00Z',
    checked_in_by: 'user-admin-1',
  }
];

export const INITIAL_NOTIFICATIONS: CampusNotification[] = [
  {
    id: 'notif-1',
    recipient_id: 'user-parent-1',
    title: 'Parent Permission Required',
    message: 'Your child Alex Chen registered for CodeSprint — 24h Hackathon. An overnight stay is involved. Please review and provide consent.',
    type: 'permission',
    read_at: null,
    link_to: '/parent/dashboard',
    created_at: '2026-10-24T16:05:00Z',
  },
  {
    id: 'notif-2',
    recipient_id: 'user-student-1',
    title: 'Registration Pending Consent',
    message: 'Your registration for CodeSprint is waiting for David Chen\'s parental permission.',
    type: 'permission',
    read_at: '2026-10-24T16:10:00Z',
    link_to: '/student/dashboard',
    created_at: '2026-10-24T16:02:00Z',
  },
  {
    id: 'notif-3',
    recipient_id: 'user-student-1',
    title: 'Certificate Issued!',
    message: 'Your official certificate of participation for "FutureMinds — AI Workshop" is now available for download.',
    type: 'event',
    read_at: null,
    link_to: '/student/dashboard',
    created_at: '2026-10-23T18:00:00Z',
  },
  {
    id: 'notif-4',
    recipient_id: 'user-admin-1',
    title: 'New Event Registration Milestone',
    message: 'TechNova 2026 has crossed 200 registered students!',
    type: 'info',
    read_at: null,
    link_to: '/admin/dashboard',
    created_at: '2026-10-25T09:30:00Z',
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Annual Festival Season Guidelines & Security Rules',
    message: 'All students are reminded to wear valid university RFID identity cards. Visitors and parents are warmly invited to Crescendo cultural evenings upon registration.',
    audience: 'all',
    published_at: '2026-10-22T08:00:00Z',
    created_by: 'user-admin-1',
    creator_name: 'Dr. Robert Vance (Dean of Student Affairs)',
    is_urgent: true,
  },
  {
    id: 'ann-2',
    title: 'Shuttle Bus Timings for Off-Campus Excursions',
    message: 'Designated campus buses will depart promptly at 07:00 AM from Gate 1 for approved field trips and expos. Parents can track arrival updates via the parent portal.',
    audience: 'parents',
    published_at: '2026-10-23T10:00:00Z',
    created_by: 'user-admin-1',
    creator_name: 'Dr. Robert Vance',
    is_urgent: false,
  },
  {
    id: 'ann-3',
    title: 'Hackathon Server Infrastructure Provisioning',
    message: 'High-speed gigabit Wi-Fi and GPU cluster compute instances have been allocated for CodeSprint teams. Ensure your GitHub handle is updated.',
    audience: 'students',
    department: 'Computer Science',
    published_at: '2026-10-25T11:30:00Z',
    created_by: 'user-admin-1',
    creator_name: 'CS Department HOD',
    is_urgent: false,
  }
];

export const INITIAL_CERTIFICATES: CertificateRecord[] = [
  {
    id: 'cert-1',
    event_id: 'evt-5',
    student_id: 'user-student-1',
    certificate_code: 'CF-CERT-2026-FM8941',
    issued_at: '2026-10-23T17:30:00Z',
  }
];

// LocalStorage Persistence Engine
const STORAGE_KEYS = {
  PROFILES: 'campusflow_profiles',
  LINKS: 'campusflow_parent_links',
  EVENTS: 'campusflow_events',
  REGISTRATIONS: 'campusflow_registrations',
  PERMISSIONS: 'campusflow_permissions',
  ATTENDANCE: 'campusflow_attendance',
  NOTIFICATIONS: 'campusflow_notifications',
  ANNOUNCEMENTS: 'campusflow_announcements',
  CERTIFICATES: 'campusflow_certificates',
};

export function getStoredData<T>(key: string, defaultData: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(defaultData));
      return defaultData;
    }
    return JSON.parse(raw);
  } catch {
    return defaultData;
  }
}

export function saveStoredData<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Failed to save to localStorage for ${key}`, err);
  }
}

export function resetToDefaults(): void {
  localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(INITIAL_PROFILES));
  localStorage.setItem(STORAGE_KEYS.LINKS, JSON.stringify(INITIAL_PARENT_LINKS));
  localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(INITIAL_EVENTS));
  localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(INITIAL_REGISTRATIONS));
  localStorage.setItem(STORAGE_KEYS.PERMISSIONS, JSON.stringify(INITIAL_PERMISSION_REQUESTS));
  localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(INITIAL_ATTENDANCE));
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
  localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(INITIAL_ANNOUNCEMENTS));
  localStorage.setItem(STORAGE_KEYS.CERTIFICATES, JSON.stringify(INITIAL_CERTIFICATES));
}

export { STORAGE_KEYS };
