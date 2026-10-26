import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  CampusEvent,
  Registration,
  PermissionRequest,
  AttendanceRecord,
  CampusNotification,
  Announcement,
  CertificateRecord,
  AttendanceStatus,
  RegistrationStatus,
} from '../types';
import { dataService } from '../services/dataService';
import { useAuth } from './AuthContext';

interface EventContextType {
  events: CampusEvent[];
  registrations: Registration[];
  permissions: PermissionRequest[];
  attendance: AttendanceRecord[];
  notifications: CampusNotification[];
  announcements: Announcement[];
  certificates: CertificateRecord[];
  isLoading: boolean;
  refreshAll: () => Promise<void>;
  registerForEvent: (eventId: string) => Promise<boolean>;
  cancelRegistration: (registrationId: string) => Promise<boolean>;
  updateRegistrationStatus: (registrationId: string, status: RegistrationStatus) => Promise<void>;
  handlePermission: (permissionId: string, decision: 'Approved' | 'Declined', notes?: string) => Promise<void>;
  markAttendance: (eventId: string, studentId: string, status: AttendanceStatus) => Promise<void>;
  createEvent: (eventData: Omit<CampusEvent, 'id' | 'registered_count' | 'created_at'>) => Promise<CampusEvent>;
  updateEvent: (id: string, updates: Partial<CampusEvent>) => Promise<CampusEvent>;
  deleteEvent: (id: string) => Promise<void>;
  createAnnouncement: (data: Omit<Announcement, 'id' | 'published_at'>) => Promise<Announcement>;
  markNotificationRead: (id: string) => Promise<void>;
  unreadCount: number;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [events, setEvents] = useState<CampusEvent[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [permissions, setPermissions] = useState<PermissionRequest[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [notifications, setNotifications] = useState<CampusNotification[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [certificates, setCertificates] = useState<CertificateRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshAll = useCallback(async () => {
    try {
      const [evts, regs, perms, atts, anns, certs] = await Promise.all([
        dataService.getEvents(),
        dataService.getRegistrations(),
        dataService.getPermissionRequests(),
        dataService.getAttendanceRecords(),
        dataService.getAnnouncements(),
        dataService.getCertificates(),
      ]);

      setEvents(evts);
      setRegistrations(regs);
      setPermissions(perms);
      setAttendance(atts);
      setAnnouncements(anns);
      setCertificates(certs);

      if (user) {
        const notifs = await dataService.getNotifications(user.id);
        setNotifications(notifs);
      } else {
        setNotifications([]);
      }
    } catch (err) {
      console.error('Failed to load event data', err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  const registerForEvent = async (eventId: string): Promise<boolean> => {
    if (!user || user.role !== 'student') return false;
    try {
      await dataService.registerStudentForEvent(user.id, eventId);
      await refreshAll();
      // Celebration effect!
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#6366F1', '#8B5CF6', '#10B981', '#F59E0B'],
      });
      return true;
    } catch (err: any) {
      alert(err.message || 'Registration failed');
      return false;
    }
  };

  const cancelRegistration = async (registrationId: string): Promise<boolean> => {
    if (!user) return false;
    try {
      await dataService.cancelRegistration(registrationId, user.id);
      await refreshAll();
      return true;
    } catch (err: any) {
      alert(err.message || 'Cancellation failed');
      return false;
    }
  };

  const updateRegistrationStatus = async (registrationId: string, status: RegistrationStatus) => {
    await dataService.updateRegistrationStatus(registrationId, status);
    await refreshAll();
  };

  const handlePermission = async (permissionId: string, decision: 'Approved' | 'Declined', notes?: string) => {
    if (!user || user.role !== 'parent') return;
    try {
      await dataService.handlePermissionDecision(permissionId, decision, user.id, notes);
      await refreshAll();
      if (decision === 'Approved') {
        confetti({
          particleCount: 50,
          spread: 50,
          origin: { y: 0.6 },
          colors: ['#10B981', '#6366F1'],
        });
      }
    } catch (err: any) {
      alert(err.message || 'Permission update failed');
    }
  };

  const markAttendance = async (eventId: string, studentId: string, status: AttendanceStatus) => {
    if (!user) return;
    await dataService.markAttendance(eventId, studentId, status, user.id);
    await refreshAll();
  };

  const createEvent = async (eventData: Omit<CampusEvent, 'id' | 'registered_count' | 'created_at'>) => {
    const created = await dataService.createEvent(eventData);
    await refreshAll();
    return created;
  };

  const updateEvent = async (id: string, updates: Partial<CampusEvent>) => {
    const updated = await dataService.updateEvent(id, updates);
    await refreshAll();
    return updated;
  };

  const deleteEvent = async (id: string) => {
    await dataService.deleteEvent(id);
    await refreshAll();
  };

  const createAnnouncement = async (data: Omit<Announcement, 'id' | 'published_at'>) => {
    const created = await dataService.createAnnouncement(data);
    await refreshAll();
    return created;
  };

  const markNotificationRead = async (id: string) => {
    await dataService.markNotificationAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n))
    );
  };

  const unreadCount = notifications.filter((n) => !n.read_at).length;

  return (
    <EventContext.Provider
      value={{
        events,
        registrations,
        permissions,
        attendance,
        notifications,
        announcements,
        certificates,
        isLoading,
        refreshAll,
        registerForEvent,
        cancelRegistration,
        updateRegistrationStatus,
        handlePermission,
        markAttendance,
        createEvent,
        updateEvent,
        deleteEvent,
        createAnnouncement,
        markNotificationRead,
        unreadCount,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};
