import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Award,
  CheckCircle2,
  AlertCircle,
  QrCode,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  CalendarDays,
  FileCheck2,
  Bell,
  Search,
  ExternalLink,
  ChevronRight,
  Filter
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useEvents } from '../../contexts/EventContext';
import { formatDate, formatDateTime, formatTimeOnly, getCategoryBadgeClass, getStatusBadgeClass } from '../../lib/utils';
import { CampusEvent, Registration, CertificateRecord } from '../../types';
import { Sidebar } from '../../components/layout/Sidebar';
import { EventCard } from '../../components/events/EventCard';
import { EventDetailModal } from '../../components/events/EventDetailModal';
import { EventQrModal } from '../../components/events/EventQrModal';
import { CertificateModal } from '../../components/events/CertificateModal';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const { events, registrations, attendance, certificates, cancelRegistration, registerForEvent } = useEvents();

  const [activeTab, setActiveTab] = useState<string>('overview');
  const [selectedEvent, setSelectedEvent] = useState<CampusEvent | null>(null);
  const [selectedRegForQr, setSelectedRegForQr] = useState<{ reg: Registration; event: CampusEvent } | null>(null);
  const [selectedCertificate, setSelectedCertificate] = useState<CertificateRecord | null>(null);
  const [scheduleView, setScheduleView] = useState<'calendar' | 'list'>('list');
  const [eventFilterCategory, setEventFilterCategory] = useState<string>('All');
  const [searchFilter, setSearchFilter] = useState('');

  // User's registrations
  const studentRegistrations = registrations.filter(
    (r) => r.student_id === user?.id && r.registration_status !== 'Cancelled'
  );

  const registeredEventIds = studentRegistrations.map((r) => r.event_id);
  const myRegisteredEvents = events.filter((e) => registeredEventIds.includes(e.id));

  // Attended events
  const attendedCount = attendance.filter(
    (a) => a.student_id === user?.id && a.status === 'Attended'
  ).length;

  // Certificates earned
  const myCertificates = certificates.filter((c) => c.student_id === user?.id);

  // Recommended events (department matching or popular)
  const recommendedEvents = events.filter(
    (e) =>
      e.status === 'published' &&
      !registeredEventIds.includes(e.id) &&
      (e.eligible_departments.includes('All') || (user?.department && e.eligible_departments.includes(user.department)))
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] flex">
      {/* Sidebar */}
      <Sidebar currentTab={activeTab} onSelectTab={(tab) => setActiveTab(tab)} />

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-8 overflow-y-auto">
        {/* Header Greeting */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-violet-900 text-white shadow-xl">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
                Student Experience Hub
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.full_name || 'Alex Chen'}!
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200">
              Your next campus experience is waiting for you.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('events')}
              className="py-2.5 px-4 text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Explore All Events</span>
            </button>
          </div>
        </div>

        {/* Tab Content: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-subtle hover:shadow-card transition-all">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-400">Registered Events</p>
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center">
                    <Calendar className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
                  {studentRegistrations.length}
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">Active registrations</p>
              </div>

              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-subtle hover:shadow-card transition-all">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-400">Upcoming Events</p>
                  <div className="w-8 h-8 rounded-xl bg-violet-50 dark:bg-violet-950 text-violet-600 flex items-center justify-center">
                    <CalendarDays className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
                  {myRegisteredEvents.filter((e) => new Date(e.start_at) > new Date()).length}
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">Scheduled on calendar</p>
              </div>

              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-subtle hover:shadow-card transition-all">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-400">Events Attended</p>
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                    <FileCheck2 className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
                  {attendedCount}
                </p>
                <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">Verified check-ins</p>
              </div>

              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-subtle hover:shadow-card transition-all">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-400">Certificates Earned</p>
                  <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
                    <Award className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
                  {myCertificates.length}
                </p>
                <p className="text-[10px] text-amber-600 font-semibold mt-0.5">Ready for download</p>
              </div>
            </div>

            {/* Next Registered Events */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    My Upcoming Registered Events
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Events you are attending. View check-in passes or schedule details.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('registrations')}
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                >
                  <span>View All Registrations</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {myRegisteredEvents.length === 0 ? (
                <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-3">
                  <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    No active event registrations
                  </p>
                  <button
                    onClick={() => setActiveTab('events')}
                    className="py-2 px-4 text-xs font-bold text-white bg-indigo-600 rounded-xl"
                  >
                    Browse Events
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myRegisteredEvents.map((evt) => {
                    const reg = studentRegistrations.find((r) => r.event_id === evt.id);
                    return (
                      <div
                        key={evt.id}
                        className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-subtle hover:shadow-card transition-all space-y-4 flex flex-col justify-between"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between gap-2">
                            <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full ${getCategoryBadgeClass(evt.category)}`}>
                              {evt.category}
                            </span>
                            <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full ${getStatusBadgeClass(reg?.registration_status || 'Confirmed')}`}>
                              {reg?.registration_status}
                            </span>
                          </div>

                          <h3 className="font-bold text-slate-900 dark:text-white text-base line-clamp-1">
                            {evt.title}
                          </h3>

                          <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                              <span>{formatDateTime(evt.start_at)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" />
                              <span className="truncate">{evt.venue}</span>
                            </div>
                          </div>

                          {evt.parent_permission_required && (
                            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-[11px] text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                              <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                              <span>Requires parental consent</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                          {reg && (
                            <button
                              onClick={() => setSelectedRegForQr({ reg, event: evt })}
                              className="flex-1 py-2 px-3 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                            >
                              <QrCode className="w-3.5 h-3.5" />
                              <span>Pass</span>
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedEvent(evt)}
                            className="py-2 px-3 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                          >
                            Details
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Recommended for You */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Recommended For You
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Handpicked based on {user?.department || 'Computer Science'} curriculum and year {user?.study_year || 3}.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('events')}
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                >
                  <span>Explore Catalog</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendedEvents.slice(0, 3).map((evt) => (
                  <EventCard
                    key={evt.id}
                    event={evt}
                    onViewDetails={(e) => setSelectedEvent(e)}
                    onQuickRegister={(id) => registerForEvent(id)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: EXPLORE EVENTS */}
        {activeTab === 'events' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  Event Catalog
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Filter by category or search campus events
                </p>
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap gap-1.5">
                {['All', 'Technical', 'Cultural', 'Competitions', 'Workshops', 'Seminars'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setEventFilterCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      eventFilterCategory === cat
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Input */}
            <div className="relative max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search event name, organizer, venue..."
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {events
                .filter((e) => e.status === 'published')
                .filter((e) => eventFilterCategory === 'All' || e.category === eventFilterCategory)
                .filter((e) => e.title.toLowerCase().includes(searchFilter.toLowerCase()))
                .map((evt) => (
                  <EventCard
                    key={evt.id}
                    event={evt}
                    onViewDetails={(e) => setSelectedEvent(e)}
                    onQuickRegister={(id) => registerForEvent(id)}
                  />
                ))}
            </div>
          </div>
        )}

        {/* Tab Content: MY REGISTRATIONS */}
        {activeTab === 'registrations' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                My Registrations & Tickets
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Track approval status, cancel when permitted, and access entry QR passes.
              </p>
            </div>

            {studentRegistrations.length === 0 ? (
              <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
                <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                  No Event Registrations Yet
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Browse our lineup of technical fests, cultural concerts, and design competitions to register.
                </p>
                <button
                  onClick={() => setActiveTab('events')}
                  className="py-2.5 px-5 text-xs font-bold text-white bg-indigo-600 rounded-xl"
                >
                  Explore Events
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-subtle">
                {studentRegistrations.map((reg) => {
                  const evt = events.find((e) => e.id === reg.event_id);
                  if (!evt) return null;

                  return (
                    <div key={reg.id} className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <img
                          src={evt.banner_url}
                          alt={evt.title}
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover shrink-0"
                        />
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${getCategoryBadgeClass(evt.category)}`}>
                              {evt.category}
                            </span>
                            <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full ${getStatusBadgeClass(reg.registration_status)}`}>
                              Status: {reg.registration_status}
                            </span>
                          </div>

                          <h3 className="font-bold text-slate-900 dark:text-white text-base">
                            {evt.title}
                          </h3>

                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                              {formatDateTime(evt.start_at)}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" />
                              {evt.venue}
                            </span>
                          </div>

                          {evt.parent_permission_required && (
                            <p className="text-[11px] text-amber-700 dark:text-amber-400 font-semibold flex items-center gap-1 pt-1">
                              <ShieldAlert className="w-3.5 h-3.5" />
                              Parent consent: {reg.registration_status === 'Confirmed' ? 'Approved by Parent' : 'Pending Parent Approval'}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end md:self-center">
                        <button
                          onClick={() => setSelectedRegForQr({ reg, event: evt })}
                          className="py-2 px-3 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 rounded-xl flex items-center gap-1.5 transition-colors"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          <span>QR Ticket</span>
                        </button>
                        <button
                          onClick={() => setSelectedEvent(evt)}
                          className="py-2 px-3 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Cancel registration for ${evt.title}?`)) {
                              cancelRegistration(reg.id);
                            }
                          }}
                          className="py-2 px-3 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab Content: SCHEDULE */}
        {activeTab === 'schedule' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  Student Campus Schedule
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Track dates, venue shifts, and avoid scheduling conflicts.
                </p>
              </div>

              <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold">
                <button
                  onClick={() => setScheduleView('list')}
                  className={`py-1.5 px-3 rounded-lg ${
                    scheduleView === 'list'
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm'
                      : 'text-slate-500'
                  }`}
                >
                  Timeline View
                </button>
                <button
                  onClick={() => setScheduleView('calendar')}
                  className={`py-1.5 px-3 rounded-lg ${
                    scheduleView === 'calendar'
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm'
                      : 'text-slate-500'
                  }`}
                >
                  Calendar Month
                </button>
              </div>
            </div>

            {myRegisteredEvents.length === 0 ? (
              <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                <p className="text-sm font-semibold text-slate-600">No events on your schedule yet.</p>
              </div>
            ) : scheduleView === 'list' ? (
              <div className="space-y-4">
                {myRegisteredEvents
                  .sort((a, b) => new Date(a.start_at).getTime() - new Date(b.start_at).getTime())
                  .map((evt, idx) => (
                    <div
                      key={evt.id}
                      className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-start gap-4"
                    >
                      <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 text-center min-w-[70px]">
                        <p className="text-[10px] font-bold uppercase tracking-wider">
                          {new Date(evt.start_at).toLocaleDateString('en-US', { month: 'short' })}
                        </p>
                        <p className="text-xl font-black">
                          {new Date(evt.start_at).getDate()}
                        </p>
                      </div>

                      <div className="flex-1 space-y-1">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${getCategoryBadgeClass(evt.category)}`}>
                          {evt.category}
                        </span>
                        <h3 className="font-bold text-slate-900 dark:text-white text-base">
                          {evt.title}
                        </h3>
                        <p className="text-xs text-slate-500 flex items-center gap-3">
                          <span>{formatTimeOnly(evt.start_at)} - {formatTimeOnly(evt.end_at)}</span>
                          <span>•</span>
                          <span>{evt.venue}</span>
                        </p>
                      </div>

                      <button
                        onClick={() => setSelectedEvent(evt)}
                        className="py-2 px-3 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-xl"
                      >
                        View Details
                      </button>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
                <h3 className="font-bold text-sm text-slate-800 dark:text-white">November 2026</h3>
                <div className="grid grid-cols-7 gap-2 text-center text-xs">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                    <div key={d} className="font-bold text-slate-400 py-2">{d}</div>
                  ))}
                  {Array.from({ length: 30 }).map((_, i) => {
                    const dayNum = i + 1;
                    const hasEvent = myRegisteredEvents.some((e) => new Date(e.start_at).getDate() === dayNum);
                    return (
                      <div
                        key={i}
                        className={`h-16 p-1 rounded-xl border flex flex-col justify-between ${
                          hasEvent
                            ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-800'
                            : 'border-slate-100 dark:border-slate-800 text-slate-400'
                        }`}
                      >
                        <span className="font-bold text-xs">{dayNum}</span>
                        {hasEvent && (
                          <span className="w-2 h-2 rounded-full bg-indigo-600 mx-auto" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab Content: ATTENDANCE & CERTIFICATES */}
        {(activeTab === 'attendance' || activeTab === 'certificates') && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Attendance & Official Certificates
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Participation history and university-issued credentials.
              </p>
            </div>

            {/* Issued Certificates */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-500" />
                <span>Issued Certificates</span>
              </h3>

              {myCertificates.length === 0 ? (
                <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400">
                  Certificates are automatically issued once the admin verifies your venue check-in.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {myCertificates.map((cert) => (
                    <div
                      key={cert.id}
                      className="p-5 rounded-2xl bg-gradient-to-br from-amber-50/40 via-white to-amber-50/20 dark:from-slate-900 dark:to-slate-800 border-2 border-amber-200 dark:border-amber-900 shadow-sm flex items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">
                          Verified Credential
                        </span>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                          {cert.event?.title || 'FutureMinds — AI Workshop'}
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          Code: {cert.certificate_code} • Issued {formatDate(cert.issued_at)}
                        </p>
                      </div>

                      <button
                        onClick={() => setSelectedCertificate(cert)}
                        className="py-2.5 px-4 text-xs font-bold text-amber-900 dark:text-amber-200 bg-amber-100 hover:bg-amber-200 dark:bg-amber-950 rounded-xl flex items-center gap-1.5 transition-colors shrink-0"
                      >
                        <Award className="w-3.5 h-3.5 text-amber-600" />
                        <span>View / Print</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Attendance Records */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <FileCheck2 className="w-4 h-4 text-emerald-500" />
                <span>Attendance Log</span>
              </h3>

              <div className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                {attendance
                  .filter((a) => a.student_id === user?.id)
                  .map((rec) => (
                    <div key={rec.id} className="p-4 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">
                          {rec.event?.title || 'Campus Event'}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {rec.checked_in_at ? `Checked in: ${formatDateTime(rec.checked_in_at)}` : 'Awaiting check-in at event venue'}
                        </p>
                      </div>
                      <span className={`px-2.5 py-1 text-[11px] font-bold rounded-full ${getStatusBadgeClass(rec.status)}`}>
                        {rec.status}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: PROFILE */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Student Profile Information
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Verified university identity and linked parent details.
              </p>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
              <img
                src={user?.avatar_url || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'}
                alt={user?.full_name}
                className="w-16 h-16 rounded-full object-cover ring-2 ring-indigo-500/30"
              />
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  {user?.full_name}
                </h3>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                  Student ID: {user?.student_id || 'CS2024-089'}
                </p>
                <p className="text-xs text-slate-400">
                  Department of {user?.department || 'Computer Science'} • Year {user?.study_year || 3}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                <p className="text-slate-400 font-medium">College Email</p>
                <p className="font-bold text-slate-800 dark:text-slate-100 mt-1">{user?.email}</p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                <p className="text-slate-400 font-medium">Contact Phone</p>
                <p className="font-bold text-slate-800 dark:text-slate-100 mt-1">{user?.phone || '+1 (555) 876-5432'}</p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 sm:col-span-2">
                <p className="text-slate-400 font-medium">Linked Parent Email for Permissions</p>
                <p className="font-bold text-slate-800 dark:text-slate-100 mt-1">
                  {user?.parent_email || 'chen.family@gmail.com'} (David Chen)
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}

      {selectedRegForQr && (
        <EventQrModal
          registration={selectedRegForQr.reg}
          event={selectedRegForQr.event}
          onClose={() => setSelectedRegForQr(null)}
        />
      )}

      {selectedCertificate && (
        <CertificateModal
          certificate={selectedCertificate}
          onClose={() => setSelectedCertificate(null)}
        />
      )}
    </div>
  );
};
