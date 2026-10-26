import React from 'react';
import { Calendar, MapPin, Users, ShieldAlert, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { CampusEvent } from '../../types';
import { formatDate, formatTimeOnly, getCategoryBadgeClass } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';
import { useEvents } from '../../contexts/EventContext';

interface EventCardProps {
  event: CampusEvent;
  onViewDetails: (event: CampusEvent) => void;
  onQuickRegister?: (eventId: string) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onViewDetails, onQuickRegister }) => {
  const { user, role } = useAuth();
  const { registrations } = useEvents();

  const isRegistered = user
    ? registrations.some(
        (r) => r.event_id === event.id && r.student_id === user.id && r.registration_status !== 'Cancelled'
      )
    : false;

  const isFull = event.registered_count >= event.capacity;
  const percentFilled = Math.min(100, Math.round((event.registered_count / event.capacity) * 100));

  return (
    <div className="group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700/60 shadow-subtle hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Cover Image */}
        <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
          <img
            src={event.banner_url}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

          {/* Badges on image */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            <span
              className={`px-2.5 py-1 text-[11px] font-bold rounded-full border backdrop-blur-md shadow-sm ${getCategoryBadgeClass(
                event.category
              )}`}
            >
              {event.category}
            </span>
            {event.parent_permission_required && (
              <span className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-amber-500/90 text-white backdrop-blur-md flex items-center gap-1 shadow-sm">
                <ShieldAlert className="w-3 h-3" />
                Consent Req.
              </span>
            )}
          </div>

          <div className="absolute bottom-3 left-3 right-3 text-white flex items-center justify-between text-xs font-medium">
            <span className="flex items-center gap-1.5 drop-shadow">
              <Calendar className="w-3.5 h-3.5 text-indigo-300" />
              {formatDate(event.start_at)}
            </span>
            <span className="drop-shadow">
              {formatTimeOnly(event.start_at)}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 space-y-3">
          <h3 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg leading-snug line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {event.title}
          </h3>

          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {event.description}
          </p>

          <div className="pt-1 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{event.venue}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">Deadline: {formatDate(event.registration_deadline)}</span>
            </div>
          </div>

          {/* Capacity bar */}
          <div className="pt-2">
            <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3 text-slate-400" />
                Capacity
              </span>
              <span>
                {event.registered_count} / {event.capacity} seats ({percentFilled}%)
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isFull
                    ? 'bg-rose-500'
                    : percentFilled > 80
                    ? 'bg-amber-500'
                    : 'bg-indigo-600'
                }`}
                style={{ width: `${percentFilled}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Card Actions */}
      <div className="p-5 pt-0 flex items-center gap-2">
        <button
          onClick={() => onViewDetails(event)}
          className="flex-1 py-2 px-3 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-colors text-center"
        >
          View Details
        </button>

        {role === 'student' && (
          isRegistered ? (
            <div className="py-2 px-3 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl flex items-center gap-1 shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Registered
            </div>
          ) : (
            <button
              disabled={isFull}
              onClick={() => onQuickRegister && onQuickRegister(event.id)}
              className={`py-2 px-3.5 text-xs font-semibold text-white rounded-xl transition-all shadow-sm shrink-0 flex items-center gap-1 ${
                isFull
                  ? 'bg-slate-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20 hover:scale-[1.02]'
              }`}
            >
              <span>{isFull ? 'Full' : 'Register'}</span>
              {!isFull && <ArrowRight className="w-3 h-3" />}
            </button>
          )
        )}
      </div>
    </div>
  );
};
