import React, { useState } from 'react';
import {
  Calendar,
  Users,
  Award,
  CheckCircle2,
  XCircle,
  PlusCircle,
  Search,
  Filter,
  Download,
  QrCode,
  ShieldAlert,
  Megaphone,
  BarChart3,
  Edit,
  Trash2,
  Eye,
  FileSpreadsheet,
  Building2,
  Sparkles,
  ExternalLink,
  Copy
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useEvents } from '../../contexts/EventContext';
import { formatDate, formatDateTime, getCategoryBadgeClass, getStatusBadgeClass } from '../../lib/utils';
import { CampusEvent, Registration, AttendanceStatus, EventCategory, EventVisibility, UserProfile } from '../../types';
import { Sidebar } from '../../components/layout/Sidebar';
import { RegistrationTrendChart, CategoryPieChart, DepartmentBarChart } from '../../components/charts/DashboardCharts';
import { EventDetailModal } from '../../components/events/EventDetailModal';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const {
    events,
    registrations,
    attendance,
    announcements,
    permissions,
    createEvent,
    updateEvent,
    deleteEvent,
    markAttendance,
    updateRegistrationStatus,
    createAnnouncement,
  } = useEvents();

  const [activeTab, setActiveTab] = useState<string>('overview');
  const [selectedEvent, setSelectedEvent] = useState<CampusEvent | null>(null);
  const [searchEventQuery, setSearchEventQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');

  // Create Event Form state
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    category: 'Technical' as EventCategory,
    banner_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
    start_at: '2026-11-25T10:00',
    end_at: '2026-11-25T17:00',
    venue: 'Campus Innovation Center',
    organizer_name: 'Director of Student Activities',
    capacity: 150,
    registration_opens_at: new Date().toISOString(),
    registration_deadline: '2026-11-24T23:59',
    parent_permission_required: false,
    attendance_enabled: true,
    certificate_enabled: true,
    visibility: 'Public' as EventVisibility,
    status: 'published' as 'published' | 'draft',
    eligible_departments: ['All'],
    eligible_years: [1, 2, 3, 4],
    departure_time: '',
    return_time: '',
  });

  // Announcement Form state
  const [annTitle, setAnnTitle] = useState('');
  const [annMessage, setAnnMessage] = useState('');
  const [annAudience, setAnnAudience] = useState<'all' | 'students' | 'parents'>('all');
  const [annUrgent, setAnnUrgent] = useState(false);

  // Check-in / QR Scanner input
  const [scannerInput, setScannerInput] = useState('');
  const [scanMessage, setScanMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Calculations
  const totalRegistrations = registrations.filter((r) => r.registration_status !== 'Cancelled').length;
  const activeEvents = events.filter((e) => e.status === 'published').length;
  const pendingApprovals = permissions.filter((p) => p.status === 'Pending').length;

  const handleCreateEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventForm.title || !eventForm.venue) {
      alert('Please fill out required fields');
      return;
    }

    await createEvent({
      ...eventForm,
      start_at: new Date(eventForm.start_at).toISOString(),
      end_at: new Date(eventForm.end_at).toISOString(),
      registration_deadline: new Date(eventForm.registration_deadline).toISOString(),
    });

    alert('Event published successfully!');
    setActiveTab('events');
  };

  const handleAnnouncementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle || !annMessage) return;

    await createAnnouncement({
      title: annTitle,
      message: annMessage,
      audience: annAudience,
      created_by: user?.id || 'admin',
      creator_name: user?.full_name || 'Dr. Vance',
      is_urgent: annUrgent,
    });

    setAnnTitle('');
    setAnnMessage('');
    alert('Announcement broadcasted successfully to targeted campus portals!');
  };

  // QR Code / Token Manual Check-in Handler
  const handleCheckInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setScanMessage(null);
    if (!scannerInput.trim()) return;

    // Search registration by QR token or ID
    const reg = registrations.find(
      (r) =>
        r.qr_code_token?.toLowerCase() === scannerInput.trim().toLowerCase() ||
        r.id.toLowerCase() === scannerInput.trim().toLowerCase()
    );

    if (reg) {
      await markAttendance(reg.event_id, reg.student_id, 'Attended');
      setScanMessage({
        text: `Verified & Checked in: ${reg.student?.full_name || 'Student'} for event "${reg.event?.title || 'Event'}"!`,
        type: 'success',
      });
      setScannerInput('');
    } else {
      setScanMessage({
        text: `Invalid or unrecognized check-in token: "${scannerInput}".`,
        type: 'error',
      });
    }
  };

  // CSV Export helper
  const exportRegistrationsCsv = () => {
    const headers = ['Registration ID', 'Event Title', 'Student Name', 'Student ID', 'Department', 'Status', 'Registered At'];
    const rows = registrations.map((r) => [
      r.id,
      `"${r.event?.title || ''}"`,
      `"${r.student?.full_name || ''}"`,
      r.student?.student_id || '',
      r.student?.department || '',
      r.registration_status,
      r.registered_at,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `campusflow_registrations_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] flex">
      {/* Sidebar */}
      <Sidebar currentTab={activeTab} onSelectTab={(tab) => setActiveTab(tab)} />

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-8 overflow-y-auto">
        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 text-white shadow-xl">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-indigo-400 text-[10px] font-bold uppercase tracking-wider">
                University Administration Suite
              </span>
              <span className="text-xs text-slate-400 font-medium">
                Campus Director: {user?.full_name || 'Dr. Robert Vance'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Event Management & Oversight Command
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Publish university fests, approve registrations, verify parent consent, and track attendance.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('create')}
              className="py-2.5 px-4 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create New Event</span>
            </button>
          </div>
        </div>

        {/* Tab Content: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Overview Metric Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-subtle">
                <p className="text-[11px] font-bold text-slate-400">Total Events</p>
                <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{events.length}</p>
                <p className="text-[10px] text-slate-500">Catalog size</p>
              </div>

              <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-subtle">
                <p className="text-[11px] font-bold text-slate-400">Active Published</p>
                <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">{activeEvents}</p>
                <p className="text-[10px] text-indigo-500 font-semibold">Live for students</p>
              </div>

              <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-subtle">
                <p className="text-[11px] font-bold text-slate-400">Registrations</p>
                <p className="text-2xl font-black text-violet-600 dark:text-violet-400 mt-1">{totalRegistrations}</p>
                <p className="text-[10px] text-violet-500 font-semibold">Total seats filled</p>
              </div>

              <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-subtle">
                <p className="text-[11px] font-bold text-slate-400">Enrolled Students</p>
                <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">340+</p>
                <p className="text-[10px] text-slate-500">Active profiles</p>
              </div>

              <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-subtle">
                <p className="text-[11px] font-bold text-slate-400">Pending Consent</p>
                <p className="text-2xl font-black text-amber-600 mt-1">{pendingApprovals}</p>
                <p className="text-[10px] text-amber-600 font-semibold">Parent approvals</p>
              </div>

              <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-subtle">
                <p className="text-[11px] font-bold text-slate-400">Attended Total</p>
                <p className="text-2xl font-black text-blue-600 mt-1">
                  {attendance.filter((a) => a.status === 'Attended').length}
                </p>
                <p className="text-[10px] text-blue-500 font-semibold">Verified check-ins</p>
              </div>
            </div>

            {/* Analytics Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-subtle space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">
                      Registration & Attendance Trends
                    </h3>
                    <p className="text-xs text-slate-500">Daily velocity over the active academic month</p>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                    Velocity
                  </span>
                </div>
                <RegistrationTrendChart />
              </div>

              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-subtle space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">
                      Registrations by Category
                    </h3>
                    <p className="text-xs text-slate-500">Distribution across fest and workshop domains</p>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300">
                    Distribution
                  </span>
                </div>
                <CategoryPieChart />
              </div>

              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-subtle space-y-4 lg:col-span-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">
                      Department-wise Student Participation
                    </h3>
                    <p className="text-xs text-slate-500">Active participation vs total enrolled strength per department</p>
                  </div>
                  <button
                    onClick={exportRegistrationsCsv}
                    className="py-1.5 px-3 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 rounded-xl flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export Analytics CSV</span>
                  </button>
                </div>
                <DepartmentBarChart />
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: MANAGE EVENTS */}
        {activeTab === 'events' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  University Events Catalog
                </h2>
                <p className="text-xs text-slate-500">
                  Search, filter, publish, duplicate, or edit college events.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('create')}
                className="py-2.5 px-4 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl flex items-center gap-2 self-start sm:self-auto"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create Event</span>
              </button>
            </div>

            {/* Table Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by event title, venue, organizer..."
                  value={searchEventQuery}
                  onChange={(e) => setSearchEventQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl"
                />
              </div>

              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="px-3 py-2.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl"
              >
                <option value="All">All Categories</option>
                <option value="Technical">Technical</option>
                <option value="Cultural">Cultural</option>
                <option value="Competitions">Competitions</option>
                <option value="Workshops">Workshops</option>
                <option value="Seminars">Seminars</option>
              </select>
            </div>

            {/* Events Data Table */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-x-auto shadow-subtle">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200/60 dark:border-slate-800">
                  <tr>
                    <th className="p-4">Event Details</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Date & Venue</th>
                    <th className="p-4">Capacity</th>
                    <th className="p-4">Consent Req.</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {events
                    .filter((e) => selectedCategoryFilter === 'All' || e.category === selectedCategoryFilter)
                    .filter((e) => e.title.toLowerCase().includes(searchEventQuery.toLowerCase()))
                    .map((evt) => (
                      <tr key={evt.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="p-4 font-bold text-slate-900 dark:text-white max-w-[220px]">
                          <div className="truncate">{evt.title}</div>
                          <div className="text-[11px] font-normal text-slate-400 truncate">{evt.organizer_name}</div>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${getCategoryBadgeClass(evt.category)}`}>
                            {evt.category}
                          </span>
                        </td>
                        <td className="p-4 text-slate-600 dark:text-slate-300">
                          <div>{formatDate(evt.start_at)}</div>
                          <div className="text-[10px] text-slate-400 truncate max-w-[140px]">{evt.venue}</div>
                        </td>
                        <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">
                          {evt.registered_count} / {evt.capacity}
                        </td>
                        <td className="p-4">
                          {evt.parent_permission_required ? (
                            <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                              Yes
                            </span>
                          ) : (
                            <span className="text-slate-400">No</span>
                          )}
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full ${getStatusBadgeClass(evt.status)}`}>
                            {evt.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedEvent(evt)}
                              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                              title="Preview"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={async () => {
                                const newStatus = evt.status === 'published' ? 'draft' : 'published';
                                await updateEvent(evt.id, { status: newStatus });
                              }}
                              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 hover:text-indigo-600"
                              title={evt.status === 'published' ? 'Unpublish' : 'Publish'}
                            >
                              {evt.status === 'published' ? 'Hide' : 'Publish'}
                            </button>
                            <button
                              onClick={async () => {
                                if (confirm(`Delete event "${evt.title}"?`)) {
                                  await deleteEvent(evt.id);
                                }
                              }}
                              className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg text-slate-400 hover:text-rose-600"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab Content: CREATE EVENT */}
        {activeTab === 'create' && (
          <div className="max-w-4xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Create & Publish Campus Event
              </h2>
              <p className="text-xs text-slate-500">
                Configure eligibility rules, seat capacities, and parental consent requirements.
              </p>
            </div>

            <form onSubmit={handleCreateEventSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={eventForm.title}
                    onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                    placeholder="e.g. InnovateX — Annual Entrepreneurship Summit"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Detailed Description *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={eventForm.description}
                    onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                    placeholder="Provide overview, speaker info, and competition tracks..."
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Event Category
                  </label>
                  <select
                    value={eventForm.category}
                    onChange={(e) => setEventForm({ ...eventForm, category: e.target.value as EventCategory })}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl"
                  >
                    <option value="Technical">Technical</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Competitions">Competitions</option>
                    <option value="Workshops">Workshops</option>
                    <option value="Seminars">Seminars</option>
                    <option value="Sports">Sports</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Venue / Campus Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={eventForm.venue}
                    onChange={(e) => setEventForm({ ...eventForm, venue: e.target.value })}
                    placeholder="Main Auditorium, Block C"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Start Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={eventForm.start_at}
                    onChange={(e) => setEventForm({ ...eventForm, start_at: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    End Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={eventForm.end_at}
                    onChange={(e) => setEventForm({ ...eventForm, end_at: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Registration Deadline
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={eventForm.registration_deadline}
                    onChange={(e) => setEventForm({ ...eventForm, registration_deadline: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Participant Capacity Limit
                  </label>
                  <input
                    type="number"
                    min={10}
                    max={2000}
                    value={eventForm.capacity}
                    onChange={(e) => setEventForm({ ...eventForm, capacity: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Cover Banner Image URL
                  </label>
                  <input
                    type="url"
                    value={eventForm.banner_url}
                    onChange={(e) => setEventForm({ ...eventForm, banner_url: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
              </div>

              {/* Toggles & Permissions */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Policy & Governance Options
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={eventForm.parent_permission_required}
                      onChange={(e) =>
                        setEventForm({ ...eventForm, parent_permission_required: e.target.checked })
                      }
                      className="rounded text-indigo-600"
                    />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      Parent Consent Required
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={eventForm.attendance_enabled}
                      onChange={(e) => setEventForm({ ...eventForm, attendance_enabled: e.target.checked })}
                      className="rounded text-indigo-600"
                    />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      QR Attendance Tracking
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={eventForm.certificate_enabled}
                      onChange={(e) => setEventForm({ ...eventForm, certificate_enabled: e.target.checked })}
                      className="rounded text-indigo-600"
                    />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      Digital Certificate Issuance
                    </span>
                  </label>
                </div>

                {eventForm.parent_permission_required && (
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                        Departure Time (For Trips/Overnight)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 08:00 AM Gate 1"
                        value={eventForm.departure_time}
                        onChange={(e) => setEventForm({ ...eventForm, departure_time: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                        Expected Return Time
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Next day 12:00 PM"
                        value={eventForm.return_time}
                        onChange={(e) => setEventForm({ ...eventForm, return_time: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveTab('events')}
                  className="py-2.5 px-4 text-xs font-semibold text-slate-600 dark:text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-6 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/20"
                >
                  Publish Event Immediately
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab Content: REGISTRATIONS */}
        {activeTab === 'registrations' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  Student Event Registrations
                </h2>
                <p className="text-xs text-slate-500">
                  Review applicant statuses, approve/reject entries, and export verified records.
                </p>
              </div>

              <button
                onClick={exportRegistrationsCsv}
                className="py-2.5 px-4 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 flex items-center gap-2 shadow-sm"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span>Export as CSV</span>
              </button>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-x-auto shadow-subtle">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200/60 dark:border-slate-800">
                  <tr>
                    <th className="p-4">Student</th>
                    <th className="p-4">Event</th>
                    <th className="p-4">Department & Year</th>
                    <th className="p-4">Registered Date</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {registrations.map((reg) => (
                    <tr key={reg.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="p-4 font-bold text-slate-900 dark:text-white">
                        <div>{reg.student?.full_name || 'Student'}</div>
                        <div className="text-[11px] font-normal text-slate-400">{reg.student?.student_id || 'ID N/A'}</div>
                      </td>
                      <td className="p-4 font-semibold text-slate-700 dark:text-slate-300 max-w-[200px] truncate">
                        {reg.event?.title || 'Campus Event'}
                      </td>
                      <td className="p-4 text-slate-500">
                        {reg.student?.department || 'CS'} • Yr {reg.student?.study_year || 3}
                      </td>
                      <td className="p-4 text-slate-400">
                        {formatDateTime(reg.registered_at)}
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full ${getStatusBadgeClass(reg.registration_status)}`}>
                          {reg.registration_status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {reg.registration_status === 'Pending' && (
                            <button
                              onClick={() => updateRegistrationStatus(reg.id, 'Confirmed')}
                              className="px-2.5 py-1 text-[11px] font-bold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700"
                            >
                              Approve
                            </button>
                          )}
                          <button
                            onClick={() => updateRegistrationStatus(reg.id, 'Rejected')}
                            className="px-2 py-1 text-[11px] font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab Content: ATTENDANCE CHECK-IN */}
        {activeTab === 'attendance' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Live Attendance & QR Check-in Desk
              </h2>
              <p className="text-xs text-slate-500">
                Scan attendee QR tokens or manually search ticket tokens to record on-venue attendance.
              </p>
            </div>

            {/* Fast Scanner Input */}
            <div className="p-6 rounded-3xl bg-indigo-900 text-white space-y-4 shadow-xl">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-indigo-300" />
                <h3 className="font-bold text-base">QR Token Entry Check-In</h3>
              </div>

              <form onSubmit={handleCheckInSubmit} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Scan or type pass code (e.g. CF-TNOV26-ALX901 or reg ID)..."
                  value={scannerInput}
                  onChange={(e) => setScannerInput(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-2xl bg-white/10 text-white placeholder-indigo-200 border border-white/20 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-white"
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-2xl bg-white text-indigo-950 font-bold text-xs hover:bg-indigo-50 shadow-md transition-all shrink-0"
                >
                  Verify Check-in
                </button>
              </form>

              {scanMessage && (
                <div
                  className={`p-3 rounded-xl text-xs font-semibold ${
                    scanMessage.type === 'success'
                      ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/40'
                      : 'bg-rose-500/20 text-rose-200 border border-rose-400/40'
                  }`}
                >
                  {scanMessage.text}
                </div>
              )}
            </div>

            {/* Attendance List */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-x-auto shadow-subtle">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200/60 dark:border-slate-800">
                  <tr>
                    <th className="p-4">Student</th>
                    <th className="p-4">Event</th>
                    <th className="p-4">Check-in Status</th>
                    <th className="p-4">Checked-In Timestamp</th>
                    <th className="p-4 text-right">Quick Mark</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {attendance.map((att) => (
                    <tr key={att.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="p-4 font-bold text-slate-900 dark:text-white">
                        {att.student?.full_name || 'Alex Chen'}
                      </td>
                      <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">
                        {att.event?.title || 'Campus Event'}
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full ${getStatusBadgeClass(att.status)}`}>
                          {att.status}
                        </span>
                      </td>
                      <td className="p-4 text-slate-400">
                        {att.checked_in_at ? formatDateTime(att.checked_in_at) : 'Not yet scanned'}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => markAttendance(att.event_id, att.student_id, 'Attended')}
                            className="px-2.5 py-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 rounded-lg"
                          >
                            Mark Attended
                          </button>
                          <button
                            onClick={() => markAttendance(att.event_id, att.student_id, 'Absent')}
                            className="px-2.5 py-1 text-[11px] font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                          >
                            Absent
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab Content: ANNOUNCEMENTS COMPOSER */}
        {activeTab === 'announcements' && (
          <div className="max-w-3xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Broadcast Campus Announcement
              </h2>
              <p className="text-xs text-slate-500">
                Send official notices to students, parents, or specific campus departments.
              </p>
            </div>

            <form onSubmit={handleAnnouncementSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Announcement Title *
                </label>
                <input
                  type="text"
                  required
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  placeholder="e.g. Schedule Update for Annual Fest Opening Ceremony"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Message Content *
                </label>
                <textarea
                  rows={4}
                  required
                  value={annMessage}
                  onChange={(e) => setAnnMessage(e.target.value)}
                  placeholder="Type clear instructions, venue shifts, or security notices..."
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Target Audience
                  </label>
                  <select
                    value={annAudience}
                    onChange={(e) => setAnnAudience(e.target.value as any)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl"
                  >
                    <option value="all">Broadcast to All (Students & Parents)</option>
                    <option value="students">Students Only</option>
                    <option value="parents">Parents Only</option>
                  </select>
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={annUrgent}
                      onChange={(e) => setAnnUrgent(e.target.checked)}
                      className="rounded text-rose-600 focus:ring-rose-500"
                    />
                    <span className="font-bold text-rose-600">
                      Mark as High-Priority / Urgent Alert
                    </span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="py-3 px-6 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-all"
              >
                Publish & Dispatch Announcement
              </button>
            </form>
          </div>
        )}
      </main>

      {/* Details Modal */}
      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
};
