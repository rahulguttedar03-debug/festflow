import {
  CampusEvent,
  Registration,
  PermissionRequest,
  AttendanceRecord,
  CampusNotification,
  Announcement,
  CertificateRecord,
  ParentStudentLink,
  UserProfile,
  RegistrationStatus,
  PermissionStatus,
  AttendanceStatus,
} from '../types';
import {
  STORAGE_KEYS,
  getStoredData,
  saveStoredData,
  INITIAL_PROFILES,
  INITIAL_PARENT_LINKS,
  INITIAL_EVENTS,
  INITIAL_REGISTRATIONS,
  INITIAL_PERMISSION_REQUESTS,
  INITIAL_ATTENDANCE,
  INITIAL_NOTIFICATIONS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_CERTIFICATES,
} from '../lib/mockData';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

// Helper to simulate slight async latency for realistic SaaS feel
const delay = (ms = 180) => new Promise((resolve) => setTimeout(resolve, ms));

export const dataService = {
  // =================== PROFILES & USERS ===================
  async getProfiles(): Promise<UserProfile[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('profiles').select('*');
      if (!error && data) return data as UserProfile[];
    }
    await delay();
    return getStoredData<UserProfile[]>(STORAGE_KEYS.PROFILES, INITIAL_PROFILES);
  },

  async getProfileById(id: string): Promise<UserProfile | null> {
    const profiles = await this.getProfiles();
    return profiles.find((p) => p.id === id) || null;
  },

  async updateProfile(id: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    if (isSupabaseConfigured && supabase) {
      const { data } = await supabase.from('profiles').update(updates).eq('id', id).select().single();
      if (data) return data as UserProfile;
    }
    await delay();
    const profiles = getStoredData<UserProfile[]>(STORAGE_KEYS.PROFILES, INITIAL_PROFILES);
    const index = profiles.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('Profile not found');
    const updated = { ...profiles[index], ...updates };
    profiles[index] = updated;
    saveStoredData(STORAGE_KEYS.PROFILES, profiles);
    return updated;
  },

  // =================== PARENT-STUDENT LINKS ===================
  async getParentStudentLinks(): Promise<ParentStudentLink[]> {
    if (isSupabaseConfigured && supabase) {
      const { data } = await supabase.from('parent_student_links').select('*');
      if (data) return data as ParentStudentLink[];
    }
    await delay();
    return getStoredData<ParentStudentLink[]>(STORAGE_KEYS.LINKS, INITIAL_PARENT_LINKS);
  },

  async getLinkedStudentsForParent(parentId: string): Promise<UserProfile[]> {
    const links = await this.getParentStudentLinks();
    const profiles = await this.getProfiles();
    const verifiedStudentIds = links
      .filter((l) => l.parent_id === parentId && l.verification_status === 'verified')
      .map((l) => l.student_id);
    return profiles.filter((p) => verifiedStudentIds.includes(p.id));
  },

  async linkParentToStudent(parentId: string, studentIdentifier: string): Promise<ParentStudentLink> {
    await delay();
    const profiles = await this.getProfiles();
    const student = profiles.find(
      (p) => p.student_id?.toLowerCase() === studentIdentifier.toLowerCase() || p.email.toLowerCase() === studentIdentifier.toLowerCase()
    );
    if (!student) {
      throw new Error('No student found matching that Student ID or College Email.');
    }

    const links = getStoredData<ParentStudentLink[]>(STORAGE_KEYS.LINKS, INITIAL_PARENT_LINKS);
    const existing = links.find((l) => l.parent_id === parentId && l.student_id === student.id);
    if (existing) {
      return existing;
    }

    const newLink: ParentStudentLink = {
      id: `link-${Date.now()}`,
      parent_id: parentId,
      student_id: student.id,
      student_name: student.full_name,
      student_roll: student.student_id,
      department: student.department,
      study_year: student.study_year,
      verification_status: 'verified',
      verified_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };
    links.push(newLink);
    saveStoredData(STORAGE_KEYS.LINKS, links);

    // Notify student
    await this.createNotification({
      recipient_id: student.id,
      title: 'Parent Linked Account',
      message: 'A parent account has linked to your profile to track events and permissions.',
      type: 'info',
    });

    return newLink;
  },

  // =================== EVENTS ===================
  async getEvents(): Promise<CampusEvent[]> {
    if (isSupabaseConfigured && supabase) {
      const { data } = await supabase.from('events').select('*').order('start_at', { ascending: true });
      if (data) return data as CampusEvent[];
    }
    await delay();
    return getStoredData<CampusEvent[]>(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
  },

  async getEventById(id: string): Promise<CampusEvent | null> {
    const events = await this.getEvents();
    return events.find((e) => e.id === id) || null;
  },

  async createEvent(eventData: Omit<CampusEvent, 'id' | 'registered_count' | 'created_at'>): Promise<CampusEvent> {
    await delay();
    const newEvent: CampusEvent = {
      ...eventData,
      id: `evt-${Date.now()}`,
      registered_count: 0,
      created_at: new Date().toISOString(),
    };
    const events = getStoredData<CampusEvent[]>(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
    events.unshift(newEvent);
    saveStoredData(STORAGE_KEYS.EVENTS, events);

    // Create an announcement automatically if published
    if (newEvent.status === 'published') {
      await this.createAnnouncement({
        title: `New Event Announced: ${newEvent.title}`,
        message: `${newEvent.description.slice(0, 160)}... Happening on ${new Date(newEvent.start_at).toLocaleDateString()}. Registrations are now open!`,
        audience: 'all',
        created_by: eventData.organizer_id || 'user-admin-1',
        creator_name: eventData.organizer_name,
      });
    }

    return newEvent;
  },

  async updateEvent(id: string, updates: Partial<CampusEvent>): Promise<CampusEvent> {
    await delay();
    const events = getStoredData<CampusEvent[]>(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
    const index = events.findIndex((e) => e.id === id);
    if (index === -1) throw new Error('Event not found');
    const updated = { ...events[index], ...updates };
    events[index] = updated;
    saveStoredData(STORAGE_KEYS.EVENTS, events);
    return updated;
  },

  async deleteEvent(id: string): Promise<void> {
    await delay();
    let events = getStoredData<CampusEvent[]>(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
    events = events.filter((e) => e.id !== id);
    saveStoredData(STORAGE_KEYS.EVENTS, events);
  },

  // =================== REGISTRATIONS ===================
  async getRegistrations(): Promise<Registration[]> {
    await delay();
    const regs = getStoredData<Registration[]>(STORAGE_KEYS.REGISTRATIONS, INITIAL_REGISTRATIONS);
    const events = await this.getEvents();
    const profiles = await this.getProfiles();

    // Attach joined objects
    return regs.map((r) => ({
      ...r,
      event: events.find((e) => e.id === r.event_id),
      student: profiles.find((p) => p.id === r.student_id),
    }));
  },

  async getRegistrationsForStudent(studentId: string): Promise<Registration[]> {
    const all = await this.getRegistrations();
    return all.filter((r) => r.student_id === studentId);
  },

  async registerStudentForEvent(studentId: string, eventId: string): Promise<Registration> {
    await delay();
    const events = getStoredData<CampusEvent[]>(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
    const event = events.find((e) => e.id === eventId);
    if (!event) throw new Error('Event does not exist');

    // Deadline check
    const now = new Date();
    if (new Date(event.registration_deadline) < now) {
      throw new Error('Registration deadline for this event has passed.');
    }

    // Capacity check
    if (event.registered_count >= event.capacity) {
      throw new Error('This event has reached full capacity.');
    }

    const regs = getStoredData<Registration[]>(STORAGE_KEYS.REGISTRATIONS, INITIAL_REGISTRATIONS);
    const existing = regs.find((r) => r.event_id === eventId && r.student_id === studentId);
    if (existing && existing.registration_status !== 'Cancelled') {
      throw new Error('You are already registered for this event.');
    }

    const profiles = await this.getProfiles();
    const student = profiles.find((p) => p.id === studentId);
    const initialStatus: RegistrationStatus = event.parent_permission_required ? 'Pending' : 'Confirmed';

    const newReg: Registration = {
      id: `reg-${Date.now()}`,
      event_id: eventId,
      student_id: studentId,
      registration_status: initialStatus,
      registered_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      qr_code_token: `CF-${event.title.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
    };

    regs.push(newReg);
    saveStoredData(STORAGE_KEYS.REGISTRATIONS, regs);

    // Update event registered_count
    event.registered_count += 1;
    saveStoredData(STORAGE_KEYS.EVENTS, events);

    // Add initial Attendance record
    const attList = getStoredData<AttendanceRecord[]>(STORAGE_KEYS.ATTENDANCE, INITIAL_ATTENDANCE);
    attList.push({
      id: `att-${Date.now()}`,
      event_id: eventId,
      student_id: studentId,
      status: 'Registered',
    });
    saveStoredData(STORAGE_KEYS.ATTENDANCE, attList);

    // If parent permission required, find linked parent & create PermissionRequest
    if (event.parent_permission_required) {
      const links = await this.getParentStudentLinks();
      const parentLink = links.find((l) => l.student_id === studentId && l.verification_status === 'verified');
      const parentId = parentLink ? parentLink.parent_id : 'user-parent-1'; // fallback to demo parent if not set

      const permRequests = getStoredData<PermissionRequest[]>(STORAGE_KEYS.PERMISSIONS, INITIAL_PERMISSION_REQUESTS);
      const permReq: PermissionRequest = {
        id: `perm-${Date.now()}`,
        registration_id: newReg.id,
        event_id: eventId,
        student_id: studentId,
        parent_id: parentId,
        status: 'Pending',
        created_at: new Date().toISOString(),
      };
      permRequests.push(permReq);
      saveStoredData(STORAGE_KEYS.PERMISSIONS, permRequests);

      // Notify parent
      await this.createNotification({
        recipient_id: parentId,
        title: 'Parental Consent Required',
        message: `${student?.full_name || 'Your child'} registered for "${event.title}". Please approve or decline permission.`,
        type: 'permission',
        link_to: '/parent/dashboard',
      });
    }

    // Student notification
    await this.createNotification({
      recipient_id: studentId,
      title: event.parent_permission_required ? 'Registration Pending Parent Consent' : 'Registration Confirmed!',
      message: event.parent_permission_required
        ? `You have registered for ${event.title}. Confirmation is awaiting parent consent.`
        : `Your registration for ${event.title} is confirmed. Your check-in pass has been generated!`,
      type: 'event',
      link_to: '/student/dashboard',
    });

    return newReg;
  },

  async cancelRegistration(registrationId: string, studentId: string): Promise<void> {
    await delay();
    const regs = getStoredData<Registration[]>(STORAGE_KEYS.REGISTRATIONS, INITIAL_REGISTRATIONS);
    const reg = regs.find((r) => r.id === registrationId && r.student_id === studentId);
    if (!reg) throw new Error('Registration not found or unauthorized');

    reg.registration_status = 'Cancelled';
    reg.updated_at = new Date().toISOString();
    saveStoredData(STORAGE_KEYS.REGISTRATIONS, regs);

    // Decrement capacity
    const events = getStoredData<CampusEvent[]>(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
    const ev = events.find((e) => e.id === reg.event_id);
    if (ev && ev.registered_count > 0) {
      ev.registered_count -= 1;
      saveStoredData(STORAGE_KEYS.EVENTS, events);
    }
  },

  async updateRegistrationStatus(registrationId: string, newStatus: RegistrationStatus): Promise<Registration> {
    await delay();
    const regs = getStoredData<Registration[]>(STORAGE_KEYS.REGISTRATIONS, INITIAL_REGISTRATIONS);
    const reg = regs.find((r) => r.id === registrationId);
    if (!reg) throw new Error('Registration not found');
    reg.registration_status = newStatus;
    reg.updated_at = new Date().toISOString();
    saveStoredData(STORAGE_KEYS.REGISTRATIONS, regs);

    // Notify student
    await this.createNotification({
      recipient_id: reg.student_id,
      title: `Registration Status Updated: ${newStatus}`,
      message: `Your registration status has been updated to "${newStatus}".`,
      type: 'event',
    });

    return reg;
  },

  // =================== PERMISSIONS ===================
  async getPermissionRequests(): Promise<PermissionRequest[]> {
    await delay();
    const perms = getStoredData<PermissionRequest[]>(STORAGE_KEYS.PERMISSIONS, INITIAL_PERMISSION_REQUESTS);
    const events = await this.getEvents();
    const profiles = await this.getProfiles();

    return perms.map((p) => ({
      ...p,
      event: events.find((e) => e.id === p.event_id),
      student: profiles.find((st) => st.id === p.student_id),
    }));
  },

  async getPermissionRequestsForParent(parentId: string): Promise<PermissionRequest[]> {
    const all = await this.getPermissionRequests();
    return all.filter((p) => p.parent_id === parentId);
  },

  async handlePermissionDecision(
    permissionId: string,
    decision: 'Approved' | 'Declined',
    parentId: string,
    notes?: string
  ): Promise<PermissionRequest> {
    await delay();
    const perms = getStoredData<PermissionRequest[]>(STORAGE_KEYS.PERMISSIONS, INITIAL_PERMISSION_REQUESTS);
    const perm = perms.find((p) => p.id === permissionId && p.parent_id === parentId);
    if (!perm) throw new Error('Permission request not found or not authorized for this parent.');

    perm.status = decision;
    perm.decision_at = new Date().toISOString();
    perm.decision_notes = notes || '';
    saveStoredData(STORAGE_KEYS.PERMISSIONS, perms);

    // Update the registration status accordingly
    const regs = getStoredData<Registration[]>(STORAGE_KEYS.REGISTRATIONS, INITIAL_REGISTRATIONS);
    const reg = regs.find((r) => r.id === perm.registration_id);
    if (reg) {
      reg.registration_status = decision === 'Approved' ? 'Confirmed' : 'Rejected';
      reg.updated_at = new Date().toISOString();
      saveStoredData(STORAGE_KEYS.REGISTRATIONS, regs);
    }

    const events = await this.getEvents();
    const event = events.find((e) => e.id === perm.event_id);

    // Notify student
    await this.createNotification({
      recipient_id: perm.student_id,
      title: decision === 'Approved' ? 'Parent Consent Approved!' : 'Parent Consent Declined',
      message: decision === 'Approved'
        ? `Your parent approved permission for "${event?.title || 'the event'}". Your registration is now Confirmed!`
        : `Your parent declined permission for "${event?.title || 'the event'}". Registration has been cancelled.`,
      type: decision === 'Approved' ? 'event' : 'urgent',
      link_to: '/student/dashboard',
    });

    return perm;
  },

  // =================== ATTENDANCE ===================
  async getAttendanceRecords(): Promise<AttendanceRecord[]> {
    await delay();
    const atts = getStoredData<AttendanceRecord[]>(STORAGE_KEYS.ATTENDANCE, INITIAL_ATTENDANCE);
    const events = await this.getEvents();
    const profiles = await this.getProfiles();

    return atts.map((a) => ({
      ...a,
      event: events.find((e) => e.id === a.event_id),
      student: profiles.find((p) => p.id === a.student_id),
    }));
  },

  async markAttendance(
    eventId: string,
    studentId: string,
    status: AttendanceStatus,
    adminId: string
  ): Promise<AttendanceRecord> {
    await delay();
    const attList = getStoredData<AttendanceRecord[]>(STORAGE_KEYS.ATTENDANCE, INITIAL_ATTENDANCE);
    let record = attList.find((a) => a.event_id === eventId && a.student_id === studentId);

    if (record) {
      record.status = status;
      record.checked_in_at = status === 'Attended' ? new Date().toISOString() : undefined;
      record.checked_in_by = adminId;
    } else {
      record = {
        id: `att-${Date.now()}`,
        event_id: eventId,
        student_id: studentId,
        status,
        checked_in_at: status === 'Attended' ? new Date().toISOString() : undefined,
        checked_in_by: adminId,
      };
      attList.push(record);
    }
    saveStoredData(STORAGE_KEYS.ATTENDANCE, attList);

    const event = await this.getEventById(eventId);

    // Issue certificate if attended and certificate_enabled
    if (status === 'Attended' && event?.certificate_enabled) {
      await this.issueCertificate(eventId, studentId);
    }

    // Notify student
    await this.createNotification({
      recipient_id: studentId,
      title: `Attendance Marked: ${status}`,
      message: `Your attendance for "${event?.title || 'event'}" has been marked as ${status}.`,
      type: 'attendance',
      link_to: '/student/dashboard',
    });

    // Notify linked parent
    const links = await this.getParentStudentLinks();
    const parentLink = links.find((l) => l.student_id === studentId && l.verification_status === 'verified');
    if (parentLink) {
      const student = await this.getProfileById(studentId);
      await this.createNotification({
        recipient_id: parentLink.parent_id,
        title: `Child Attendance Update: ${status}`,
        message: `${student?.full_name || 'Your child'}'s attendance was recorded as ${status} for "${event?.title}".`,
        type: 'attendance',
        link_to: '/parent/dashboard',
      });
    }

    return record;
  },

  // =================== CERTIFICATES ===================
  async getCertificates(): Promise<CertificateRecord[]> {
    await delay();
    const certs = getStoredData<CertificateRecord[]>(STORAGE_KEYS.CERTIFICATES, INITIAL_CERTIFICATES);
    const events = await this.getEvents();
    const profiles = await this.getProfiles();
    return certs.map((c) => ({
      ...c,
      event: events.find((e) => e.id === c.event_id),
      student: profiles.find((p) => p.id === c.student_id),
    }));
  },

  async issueCertificate(eventId: string, studentId: string): Promise<CertificateRecord> {
    const certs = getStoredData<CertificateRecord[]>(STORAGE_KEYS.CERTIFICATES, INITIAL_CERTIFICATES);
    const existing = certs.find((c) => c.event_id === eventId && c.student_id === studentId);
    if (existing) return existing;

    const newCert: CertificateRecord = {
      id: `cert-${Date.now()}`,
      event_id: eventId,
      student_id: studentId,
      certificate_code: `CF-CERT-2026-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      issued_at: new Date().toISOString(),
    };
    certs.push(newCert);
    saveStoredData(STORAGE_KEYS.CERTIFICATES, certs);

    const event = await this.getEventById(eventId);
    await this.createNotification({
      recipient_id: studentId,
      title: 'Official Certificate Issued!',
      message: `Congratulations! Your certificate of completion for "${event?.title}" is ready to view and download.`,
      type: 'event',
      link_to: '/student/dashboard',
    });

    return newCert;
  },

  // =================== NOTIFICATIONS ===================
  async getNotifications(recipientId: string): Promise<CampusNotification[]> {
    await delay();
    const notifs = getStoredData<CampusNotification[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    return notifs
      .filter((n) => n.recipient_id === recipientId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  async markNotificationAsRead(id: string): Promise<void> {
    const notifs = getStoredData<CampusNotification[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    const notif = notifs.find((n) => n.id === id);
    if (notif) {
      notif.read_at = new Date().toISOString();
      saveStoredData(STORAGE_KEYS.NOTIFICATIONS, notifs);
    }
  },

  async createNotification(data: Omit<CampusNotification, 'id' | 'created_at'>): Promise<CampusNotification> {
    const notifs = getStoredData<CampusNotification[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    const newNotif: CampusNotification = {
      ...data,
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      created_at: new Date().toISOString(),
    };
    notifs.unshift(newNotif);
    saveStoredData(STORAGE_KEYS.NOTIFICATIONS, notifs);
    return newNotif;
  },

  // =================== ANNOUNCEMENTS ===================
  async getAnnouncements(): Promise<Announcement[]> {
    await delay();
    const anns = getStoredData<Announcement[]>(STORAGE_KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS);
    return anns.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
  },

  async createAnnouncement(data: Omit<Announcement, 'id' | 'published_at'>): Promise<Announcement> {
    await delay();
    const anns = getStoredData<Announcement[]>(STORAGE_KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS);
    const newAnn: Announcement = {
      ...data,
      id: `ann-${Date.now()}`,
      published_at: new Date().toISOString(),
    };
    anns.unshift(newAnn);
    saveStoredData(STORAGE_KEYS.ANNOUNCEMENTS, anns);
    return newAnn;
  },
};
