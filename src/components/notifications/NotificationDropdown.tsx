import React from 'react';
import { useEvents } from '../../contexts/EventContext';
import { Bell, CheckCheck, ShieldAlert, Sparkles, AlertCircle, Info, Calendar } from 'lucide-react';
import { formatDateTime } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';

interface NotificationDropdownProps {
  onClose: () => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ onClose }) => {
  const { notifications, markNotificationRead } = useEvents();
  const navigate = useNavigate();

  const getIcon = (type: string) => {
    switch (type) {
      case 'permission':
        return <ShieldAlert className="w-4 h-4 text-amber-500" />;
      case 'urgent':
        return <AlertCircle className="w-4 h-4 text-rose-500" />;
      case 'event':
        return <Sparkles className="w-4 h-4 text-indigo-500" />;
      case 'attendance':
        return <Calendar className="w-4 h-4 text-emerald-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const handleNotificationClick = (id: string, link?: string) => {
    markNotificationRead(id);
    if (link) {
      navigate(link);
    }
    onClose();
  };

  return (
    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-white">Notifications</h3>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-semibold">
            {notifications.filter((n) => !n.read_at).length} new
          </span>
        </div>
      </div>

      <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No notifications yet
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => handleNotificationClick(notif.id, notif.link_to)}
              className={`p-3.5 flex items-start gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer ${
                !notif.read_at ? 'bg-indigo-50/30 dark:bg-indigo-950/20' : ''
              }`}
            >
              <div className="mt-0.5 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0">
                {getIcon(notif.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                    {notif.title}
                  </p>
                  <span className="text-[10px] text-slate-400 shrink-0">
                    {formatDateTime(notif.created_at)}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 line-clamp-2">
                  {notif.message}
                </p>
              </div>
              {!notif.read_at && (
                <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0 mt-1.5" />
              )}
            </div>
          ))
        )}
      </div>

      <div className="p-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 text-center">
        <button
          onClick={onClose}
          className="text-xs font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
        >
          Close
        </button>
      </div>
    </div>
  );
};
