import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Compass,
  CalendarDays,
  CalendarCheck2,
  Award,
  Bell,
  User,
  Settings,
  LogOut,
  Users,
  ShieldAlert,
  FileCheck2,
  Megaphone,
  BarChart3,
  PlusCircle,
  QrCode,
  HeartHandshake
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useEvents } from '../../contexts/EventContext';

interface SidebarProps {
  currentTab?: string;
  onSelectTab?: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab }) => {
  const { user, role, logout } = useAuth();
  const { unreadCount, permissions } = useEvents();
  const navigate = useNavigate();

  const pendingPermissionsCount = permissions.filter((p) => p.status === 'Pending').length;

  const studentLinks = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, path: '/student/dashboard' },
    { id: 'events', label: 'Explore Events', icon: Compass, path: '/student/dashboard/events' },
    { id: 'registrations', label: 'My Registrations', icon: CalendarCheck2, path: '/student/dashboard/registrations' },
    { id: 'schedule', label: 'My Schedule', icon: CalendarDays, path: '/student/dashboard/schedule' },
    { id: 'attendance', label: 'Attendance', icon: QrCode, path: '/student/dashboard/attendance' },
    { id: 'certificates', label: 'Certificates', icon: Award, path: '/student/dashboard/certificates' },
    { id: 'notifications', label: 'Notifications', icon: Bell, path: '/student/dashboard/notifications', badge: unreadCount },
    { id: 'profile', label: 'Profile', icon: User, path: '/student/dashboard/profile' },
  ];

  const parentLinks = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, path: '/parent/dashboard' },
    { id: 'child', label: 'My Child', icon: HeartHandshake, path: '/parent/dashboard/child' },
    { id: 'events', label: 'Upcoming Events', icon: Compass, path: '/parent/dashboard/events' },
    { id: 'schedule', label: 'Event Schedule', icon: CalendarDays, path: '/parent/dashboard/schedule' },
    { id: 'permissions', label: 'Permission Requests', icon: ShieldAlert, path: '/parent/dashboard/permissions', badge: pendingPermissionsCount },
    { id: 'attendance', label: 'Attendance History', icon: FileCheck2, path: '/parent/dashboard/attendance' },
    { id: 'announcements', label: 'Announcements', icon: Megaphone, path: '/parent/dashboard/announcements' },
    { id: 'notifications', label: 'Notifications', icon: Bell, path: '/parent/dashboard/notifications', badge: unreadCount },
    { id: 'profile', label: 'Profile', icon: User, path: '/parent/dashboard/profile' },
  ];

  const adminLinks = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, path: '/admin/dashboard' },
    { id: 'events', label: 'Manage Events', icon: CalendarDays, path: '/admin/dashboard/events' },
    { id: 'create', label: 'Create Event', icon: PlusCircle, path: '/admin/dashboard/create-event' },
    { id: 'registrations', label: 'Registrations', icon: CalendarCheck2, path: '/admin/dashboard/registrations' },
    { id: 'attendance', label: 'Attendance Check-in', icon: QrCode, path: '/admin/dashboard/attendance' },
    { id: 'permissions', label: 'Parent Permissions', icon: ShieldAlert, path: '/admin/dashboard/permissions', badge: pendingPermissionsCount },
    { id: 'users', label: 'Students & Parents', icon: Users, path: '/admin/dashboard/users' },
    { id: 'announcements', label: 'Announcements', icon: Megaphone, path: '/admin/dashboard/announcements' },
    { id: 'analytics', label: 'Reports & Analytics', icon: BarChart3, path: '/admin/dashboard/analytics' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/admin/dashboard/settings' },
  ];

  const links = role === 'admin' ? adminLinks : role === 'parent' ? parentLinks : studentLinks;

  return (
    <aside className="w-64 shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between h-[calc(100vh-4rem)] sm:h-[calc(100vh-5rem)] sticky top-16 sm:top-20 z-30 select-none">
      <div className="p-4 space-y-6 overflow-y-auto">
        {/* User preview banner */}
        <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-50/60 to-violet-50/60 dark:from-indigo-950/20 dark:to-violet-950/20 border border-indigo-100/80 dark:border-indigo-900/40">
          <div className="flex items-center gap-3">
            <img
              src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
              alt={user?.full_name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/30"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                {user?.full_name}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 capitalize">
                  {role} Portal
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1">
          {links.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab ? currentTab === item.id : false;

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (onSelectTab) onSelectTab(item.id);
                  navigate(item.path);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500 group-hover:text-indigo-500'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {Boolean(item.badge && item.badge > 0) && (
                  <span
                    className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
                      isActive
                        ? 'bg-white text-indigo-700'
                        : 'bg-rose-500 text-white animate-pulse'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer controls */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
