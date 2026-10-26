import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Users,
  ShieldAlert,
  Award,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Mail,
  Send,
  Sparkles,
  QrCode
} from 'lucide-react';
import { CampusEvent } from '../../types';
import { formatDateTime, formatDate, getCategoryBadgeClass } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';
import { useEvents } from '../../contexts/EventContext';
import { EventQrModal } from './EventQrModal';

interface EventDetailModalProps {
  event: CampusEvent | null;
  onClose: () => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({ event, onClose }) => {
  const { user, role } = useAuth();
  const { registrations, registerForEvent, cancelRegistration } = useEvents();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  if (!event) return null;

  const currentRegistration = user
    ? registrations.find(
        (r) => r.event_id === event.id && r.student_id === user.id && r.registration_status !== 'Cancelled'
      )
    : null;

  const isRegistered = Boolean(currentRegistration);
  const isPastDeadline = new Date(event.registration_deadline) < new Date();
  const isCapacityReached = event.registered_count >= event.capacity;

  const handleRegister = async () => {
    if (!user) {
      alert('Please log in as a student to register.');
      return;
    }
    setIsSubmitting(true);
    await registerForEvent(event.id);
    setIsSubmitting(false);
  };

  const handleCancel = async () => {
    if (!currentRegistration) return;
    if (confirm('Are you sure you want to cancel your registration for this event?')) {
      setIsSubmitting(true);
      await cancelRegistration(currentRegistration.id);
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
        <div
          className="relative w-full max-w-3xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header image banner */}
          <div className="relative h-60 sm:h-72 w-full shrink-0 bg-slate-800">
            <img
              src={event.banner_url}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-black/30" />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Banner floating elements */}
            <div className="absolute bottom-4 left-6 right-6 text-white space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${getCategoryBadgeClass(event.category)}`}>
                  {event.category}
                </span>
                {event.parent_permission_required && (
                  <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-amber-500 text-white flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    Parental Consent Required
                  </span>
                )}
                {event.certificate_enabled && (
                  <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/90 text-white flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" />
                    Certificate Included
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold leading-tight text-white drop-shadow-md">
                {event.title}
              </h2>
            </div>
          </div>

          {/* Modal scrollable content */}
          <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
            {/* Quick info grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-slate-400">Start Time</p>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-100">
                    {formatDateTime(event.start_at)}
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-slate-400">Venue</p>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                    {event.venue}
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-slate-400">Seats</p>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-100">
                    {event.registered_count} / {event.capacity}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                About The Event
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {event.description}
              </p>
            </div>

            {/* Departure/Arrival info if overnight or excursion */}
            {(event.departure_time || event.return_time) && (
              <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 space-y-2">
                <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-xs">
                  <Clock className="w-4 h-4" />
                  <span>Transit Schedule & Overnight Itinerary</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-amber-900/80 dark:text-amber-200/80">
                  {event.departure_time && <div><strong>Departure:</strong> {event.departure_time}</div>}
                  {event.return_time && <div><strong>Expected Return:</strong> {event.return_time}</div>}
                </div>
              </div>
            )}

            {/* Eligibility & Organizer */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Organizer
                </h4>
                <div className="flex items-center gap-2 text-xs text-slate-800 dark:text-slate-200 font-medium">
                  <Building2 className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{event.organizer_name}</span>
                </div>
                {event.contact_email && (
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                    <Mail className="w-3.5 h-3.5" />
                    <span>{event.contact_email}</span>
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Eligible Batches & Departments
                </h4>
                <div className="flex flex-wrap gap-1">
                  {event.eligible_departments.map((dep, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 text-[10px] font-semibold rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    >
                      {dep}
                    </span>
                  ))}
                  <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                    Years: {event.eligible_years.join(', ')}
                  </span>
                </div>
              </div>
            </div>

            {/* Rules */}
            {event.rules && event.rules.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Rules & Guidelines
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  {event.rules.map((rule, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Registration Deadline:{' '}
              <strong className="text-slate-700 dark:text-slate-200">
                {formatDate(event.registration_deadline)}
              </strong>
            </div>

            <div className="flex items-center gap-3">
              {role === 'student' && (
                <>
                  {isRegistered ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowQrModal(true)}
                        className="py-2.5 px-4 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 rounded-xl flex items-center gap-1.5 transition-colors"
                      >
                        <QrCode className="w-4 h-4" />
                        View Check-in Pass
                      </button>
                      <button
                        onClick={handleCancel}
                        disabled={isSubmitting}
                        className="py-2.5 px-4 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors"
                      >
                        Cancel Registration
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleRegister}
                      disabled={isSubmitting || isPastDeadline || isCapacityReached}
                      className={`py-2.5 px-6 text-xs font-bold text-white rounded-xl shadow-md transition-all flex items-center gap-2 ${
                        isPastDeadline || isCapacityReached
                          ? 'bg-slate-400 cursor-not-allowed'
                          : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20 hover:scale-[1.02]'
                      }`}
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>
                        {isPastDeadline
                          ? 'Registration Closed'
                          : isCapacityReached
                          ? 'Event Full'
                          : isSubmitting
                          ? 'Registering...'
                          : 'Register for Event'}
                      </span>
                    </button>
                  )}
                </>
              )}

              {role === 'parent' && (
                <div className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Logged in as Parent — Check permission status in portal</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showQrModal && currentRegistration && (
        <EventQrModal
          registration={currentRegistration}
          event={event}
          onClose={() => setShowQrModal(false)}
        />
      )}
    </>
  );
};
