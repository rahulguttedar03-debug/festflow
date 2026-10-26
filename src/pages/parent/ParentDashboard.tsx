import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Megaphone,
  Bell,
  HeartHandshake,
  ArrowRight,
  FileCheck2,
  AlertTriangle,
  Info
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useEvents } from '../../contexts/EventContext';
import { formatDate, formatDateTime, formatTimeOnly, getCategoryBadgeClass, getStatusBadgeClass } from '../../lib/utils';
import { CampusEvent, PermissionRequest } from '../../types';
import { Sidebar } from '../../components/layout/Sidebar';
import { EventDetailModal } from '../../components/events/EventDetailModal';

export const ParentDashboard: React.FC = () => {
  const { user } = useAuth();
  const { events, permissions, attendance, announcements, handlePermission } = useEvents();

  const [activeTab, setActiveTab] = useState<string>('overview');
  const [selectedEvent, setSelectedEvent] = useState<CampusEvent | null>(null);
  const [declineReason, setDeclineReason] = useState<string>('');
  const [decliningPermId, setDecliningPermId] = useState<string | null>(null);

  // Parent's permission requests
  const parentPermissions = permissions.filter((p) => p.parent_id === user?.id || p.parent_id === 'user-parent-1');
  const pendingPermissions = parentPermissions.filter((p) => p.status === 'Pending');

  // Linked child info
  const linkedChild = {
    name: 'Alex Chen',
    student_id: 'CS2024-089',
    department: 'Computer Science',
    study_year: 3,
    avatar_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    verification_status: 'verified',
  };

  // Child attendance records
  const childAttendance = attendance.filter(
    (a) => a.student_id === 'user-student-1' || a.student?.student_id === 'CS2024-089'
  );

  const attendedCount = childAttendance.filter((a) => a.status === 'Attended').length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] flex">
      {/* Sidebar */}
      <Sidebar currentTab={activeTab} onSelectTab={(tab) => setActiveTab(tab)} />

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-8 overflow-y-auto">
        {/* Header Greeting */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-violet-950 via-indigo-900 to-slate-900 text-white shadow-xl">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-violet-400/20 text-violet-200 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
                Parent Oversight Portal
              </span>
              <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                Linked to {linkedChild.name}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome, {user?.full_name || 'David Chen'}
            </h1>
            <p className="text-xs sm:text-sm text-violet-200">
              Stay connected with your child's campus journey.
            </p>
          </div>

          {pendingPermissions.length > 0 && (
            <button
              onClick={() => setActiveTab('permissions')}
              className="py-2.5 px-4 text-xs font-bold text-amber-900 bg-amber-300 hover:bg-amber-200 rounded-xl shadow-md transition-all flex items-center gap-2 shrink-0 animate-pulse"
            >
              <ShieldAlert className="w-4 h-4 text-amber-900" />
              <span>{pendingPermissions.length} Action Needed</span>
            </button>
          )}
        </div>

        {/* Tab Content: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Child Information Card */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={linkedChild.avatar_url}
                  alt={linkedChild.name}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-violet-500/20 shadow-md"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {linkedChild.name}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      Verified Child
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Roll No: <strong className="text-slate-700 dark:text-slate-300">{linkedChild.student_id}</strong> • Department of {linkedChild.department}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Year of Study: {linkedChild.study_year}rd Year B.Tech • Full University Access
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:self-center">
                <button
                  onClick={() => setActiveTab('child')}
                  className="py-2 px-3 text-xs font-semibold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/50 hover:bg-violet-100 rounded-xl transition-colors"
                >
                  Manage Linking
                </button>
              </div>
            </div>

            {/* Overview Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-subtle">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-400">Registered Events</p>
                  <div className="w-8 h-8 rounded-xl bg-violet-50 dark:bg-violet-950 text-violet-600 flex items-center justify-center">
                    <Calendar className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
                  3
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">Campus activities</p>
              </div>

              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-subtle">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-400">Pending Permissions</p>
                  <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-black text-amber-600 mt-2">
                  {pendingPermissions.length}
                </p>
                <p className="text-[10px] text-amber-700 font-semibold mt-0.5">Consent required</p>
              </div>

              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-subtle">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-400">Events Attended</p>
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                    <FileCheck2 className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-black text-emerald-600 mt-2">
                  {attendedCount}
                </p>
                <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">Recorded check-ins</p>
              </div>

              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-subtle">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-400">Announcements</p>
                  <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
                    <Megaphone className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
                  {announcements.length}
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">University bulletins</p>
              </div>
            </div>

            {/* Pending Permission Alerts Callout */}
            {pendingPermissions.length > 0 && (
              <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-2 border-amber-300 dark:border-amber-800 space-y-4">
                <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-sm">
                  <ShieldAlert className="w-5 h-5 text-amber-600 animate-bounce" />
                  <span>Immediate Action Required: Parental Consent for Overnight / Outstation Event</span>
                </div>

                <div className="divide-y divide-amber-200/60 dark:divide-amber-800/40">
                  {pendingPermissions.map((perm) => (
                    <div key={perm.id} className="pt-3 pb-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <h4 className="font-extrabold text-slate-900 dark:text-white text-base">
                          {perm.event?.title || 'CodeSprint — Intercollege 24h Hackathon'}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-300">
                          {perm.event?.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-amber-900 dark:text-amber-300 pt-1 font-medium">
                          <span>Venue: {perm.event?.venue}</span>
                          {perm.event?.departure_time && <span>• Departs: {perm.event.departure_time}</span>}
                          {perm.event?.return_time && <span>• Returns: {perm.event.return_time}</span>}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handlePermission(perm.id, 'Approved')}
                          className="py-2.5 px-4 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition-all flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Approve Permission</span>
                        </button>
                        <button
                          onClick={() => handlePermission(perm.id, 'Declined')}
                          className="py-2.5 px-4 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-all flex items-center gap-1.5"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Decline</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Child's Registered Events */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Upcoming Registered Events for Alex Chen
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.slice(0, 3).map((evt) => (
                  <div
                    key={evt.id}
                    className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-subtle flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full ${getCategoryBadgeClass(evt.category)}`}>
                          {evt.category}
                        </span>
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                          Registered
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-base">
                        {evt.title}
                      </h4>
                      <p className="text-xs text-slate-500 flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-violet-500" />
                        <span>{formatDateTime(evt.start_at)}</span>
                      </p>
                      <p className="text-xs text-slate-500 flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate">{evt.venue}</span>
                      </p>
                    </div>

                    <button
                      onClick={() => setSelectedEvent(evt)}
                      className="w-full py-2 px-3 text-xs font-semibold text-violet-700 dark:text-violet-300 bg-violet-50 hover:bg-violet-100 dark:bg-violet-950/60 rounded-xl transition-colors text-center"
                    >
                      View Full Details
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: PERMISSION REQUESTS */}
        {activeTab === 'permissions' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Parental Permission Management
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Events requiring explicit consent due to overnight stay, travel, or off-campus excursions.
              </p>
            </div>

            {parentPermissions.length === 0 ? (
              <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  All permission requests are up to date!
                </p>
                <p className="text-xs text-slate-400">No pending approvals at this time.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {parentPermissions.map((perm) => (
                  <div
                    key={perm.id}
                    className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-subtle space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                            {perm.event?.title || 'Campus Event'}
                          </h3>
                          <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${getStatusBadgeClass(perm.status)}`}>
                            {perm.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Student: {perm.student?.full_name || 'Alex Chen'} ({perm.student?.student_id || 'CS2024-089'})
                        </p>
                      </div>

                      <div className="text-xs text-slate-500">
                        {perm.decision_at ? (
                          <span>Decided on {formatDateTime(perm.decision_at)}</span>
                        ) : (
                          <span className="text-amber-600 font-bold">Awaiting your response</span>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {perm.event?.description}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 text-xs">
                      <div>
                        <p className="text-slate-400">Venue</p>
                        <p className="font-bold text-slate-800 dark:text-slate-200">{perm.event?.venue}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Departure Time</p>
                        <p className="font-bold text-slate-800 dark:text-slate-200">{perm.event?.departure_time || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Return Time</p>
                        <p className="font-bold text-slate-800 dark:text-slate-200">{perm.event?.return_time || 'N/A'}</p>
                      </div>
                    </div>

                    {perm.status === 'Pending' ? (
                      <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                          onClick={() => perm.event && setSelectedEvent(perm.event)}
                          className="py-2.5 px-4 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                        >
                          View Event Itinerary
                        </button>
                        <button
                          onClick={() => handlePermission(perm.id, 'Declined')}
                          className="py-2.5 px-5 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl flex items-center gap-1.5"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Decline Consent</span>
                        </button>
                        <button
                          onClick={() => handlePermission(perm.id, 'Approved')}
                          className="py-2.5 px-6 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Grant Official Permission</span>
                        </button>
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs flex items-center gap-2 text-slate-600 dark:text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span>Decision finalized: <strong>{perm.status}</strong> by {user?.full_name || 'David Chen'}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab Content: ATTENDANCE */}
        {activeTab === 'attendance' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Child Attendance History
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Official records logged by event organizers and campus security check-in scanners.
              </p>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-subtle">
              {childAttendance.map((rec) => (
                <div key={rec.id} className="p-5 flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-900 dark:text-white text-sm">
                      {rec.event?.title || 'FutureMinds — AI Workshop'}
                    </p>
                    <p className="text-slate-400">
                      Attendee: {linkedChild.name} • {rec.checked_in_at ? `Verified at ${formatDateTime(rec.checked_in_at)}` : 'Entry registered'}
                    </p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-bold rounded-full ${getStatusBadgeClass(rec.status)}`}>
                    {rec.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content: ANNOUNCEMENTS */}
        {activeTab === 'announcements' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Campus Announcements for Parents
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Official notices from the Dean of Student Affairs and Department Heads.
              </p>
            </div>

            <div className="space-y-4">
              {announcements.map((ann) => (
                <div
                  key={ann.id}
                  className={`p-6 rounded-3xl bg-white dark:bg-slate-900 border ${
                    ann.is_urgent
                      ? 'border-rose-300 dark:border-rose-900/60 shadow-md shadow-rose-500/5'
                      : 'border-slate-200/80 dark:border-slate-800'
                  } space-y-2`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 dark:text-white text-base">
                        {ann.title}
                      </h3>
                      {ann.is_urgent && (
                        <span className="px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950 text-rose-600 text-[10px] font-bold">
                          Urgent Notice
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {formatDate(ann.published_at)}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {ann.message}
                  </p>

                  <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Published by: {ann.creator_name || 'Dr. Robert Vance'}</span>
                    <span className="capitalize">Target: {ann.audience}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Event Details Modal */}
      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
};
