import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { dataService } from '../services/dataService';
import { STORAGE_KEYS, getStoredData, saveStoredData } from '../lib/mockData';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole | null;
  isLoading: boolean;
  login: (email: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  switchRole: (newRole: UserRole) => Promise<void>;
  registerStudent: (data: Partial<UserProfile>) => Promise<UserProfile>;
  registerParent: (data: { full_name: string; email: string; phone: string; student_id: string }) => Promise<UserProfile>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const CURRENT_USER_SESSION_KEY = 'campusflow_current_user_id';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const initAuth = async () => {
    try {
      const storedUserId = localStorage.getItem(CURRENT_USER_SESSION_KEY);
      if (storedUserId) {
        const profile = await dataService.getProfileById(storedUserId);
        if (profile) {
          setUser(profile);
          setIsLoading(false);
          return;
        }
      }
      // Default to student demo user if none set
      const profiles = await dataService.getProfiles();
      const defaultStudent = profiles.find((p) => p.role === 'student');
      if (defaultStudent) {
        setUser(defaultStudent);
        localStorage.setItem(CURRENT_USER_SESSION_KEY, defaultStudent.id);
      }
    } catch (e) {
      console.error('Failed to init auth session', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initAuth();
  }, []);

  const login = async (email: string, expectedRole: UserRole): Promise<boolean> => {
    setIsLoading(true);
    try {
      const profiles = await dataService.getProfiles();
      const match = profiles.find(
        (p) => p.email.toLowerCase() === email.toLowerCase() && p.role === expectedRole
      );
      if (match) {
        setUser(match);
        localStorage.setItem(CURRENT_USER_SESSION_KEY, match.id);
        setIsLoading(false);
        return true;
      }
      // If demo mode and no exact email matched, pick demo user with that role
      const fallback = profiles.find((p) => p.role === expectedRole);
      if (fallback) {
        setUser(fallback);
        localStorage.setItem(CURRENT_USER_SESSION_KEY, fallback.id);
        setIsLoading(false);
        return true;
      }
      setIsLoading(false);
      return false;
    } catch {
      setIsLoading(false);
      return false;
    }
  };

  const switchRole = async (newRole: UserRole) => {
    setIsLoading(true);
    const profiles = await dataService.getProfiles();
    const target = profiles.find((p) => p.role === newRole);
    if (target) {
      setUser(target);
      localStorage.setItem(CURRENT_USER_SESSION_KEY, target.id);
    }
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_SESSION_KEY);
  };

  const registerStudent = async (data: Partial<UserProfile>): Promise<UserProfile> => {
    setIsLoading(true);
    const profiles = getStoredData<UserProfile[]>(STORAGE_KEYS.PROFILES, []);
    const newStudent: UserProfile = {
      id: `user-student-${Date.now()}`,
      full_name: data.full_name || 'New Student',
      email: data.email || `student${Date.now()}@campusflow.edu`,
      role: 'student',
      student_id: data.student_id || `STU-${Math.floor(1000 + Math.random() * 9000)}`,
      department: data.department || 'Computer Science',
      study_year: Number(data.study_year) || 1,
      phone: data.phone || '',
      parent_email: data.parent_email || '',
      avatar_url: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      created_at: new Date().toISOString(),
    };
    profiles.push(newStudent);
    saveStoredData(STORAGE_KEYS.PROFILES, profiles);
    setUser(newStudent);
    localStorage.setItem(CURRENT_USER_SESSION_KEY, newStudent.id);
    setIsLoading(false);
    return newStudent;
  };

  const registerParent = async (data: {
    full_name: string;
    email: string;
    phone: string;
    student_id: string;
  }): Promise<UserProfile> => {
    setIsLoading(true);
    const profiles = getStoredData<UserProfile[]>(STORAGE_KEYS.PROFILES, []);
    const newParent: UserProfile = {
      id: `user-parent-${Date.now()}`,
      full_name: data.full_name,
      email: data.email,
      role: 'parent',
      phone: data.phone,
      avatar_url: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
      created_at: new Date().toISOString(),
    };
    profiles.push(newParent);
    saveStoredData(STORAGE_KEYS.PROFILES, profiles);

    // Link student if ID provided
    if (data.student_id) {
      try {
        await dataService.linkParentToStudent(newParent.id, data.student_id);
      } catch (e) {
        console.warn('Could not auto-link student on parent registration', e);
      }
    }

    setUser(newParent);
    localStorage.setItem(CURRENT_USER_SESSION_KEY, newParent.id);
    setIsLoading(false);
    return newParent;
  };

  const refreshUser = async () => {
    if (user) {
      const refreshed = await dataService.getProfileById(user.id);
      if (refreshed) setUser(refreshed);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isLoading,
        login,
        logout,
        switchRole,
        registerStudent,
        registerParent,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
