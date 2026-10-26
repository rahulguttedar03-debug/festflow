import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, QrCode, ShieldCheck, Calendar, MapPin, Download } from 'lucide-react';
import { CampusEvent, Registration } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { formatDate, formatTimeOnly } from '../../lib/utils';

interface EventQrModalProps {
  registration: Registration;
  event: CampusEvent;
  onClose: () => void;
}

export const EventQrModal: React.FC<EventQrModalProps> = ({ registration, event, onClose }) => {
  const { user } = useAuth();
  const token = registration.qr_code_token || `CF-${registration.id}`;

  const qrData = JSON.stringify({
    tokenId: token,
    eventId: event.id,
    eventTitle: event.title,
    studentId: user?.id,
    studentName: user?.full_name,
    studentRoll: user?.student_id,
    timestamp: registration.registered_at,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 text-center space-y-5 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="inline-flex p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
          <QrCode className="w-6 h-6" />
        </div>

        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-600 dark:text-indigo-400">
            Official Check-in Pass
          </span>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
            {event.title}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Present this QR token at the entry desk
          </p>
        </div>

        {/* QR Code Container */}
        <div className="p-4 bg-white rounded-2xl border-2 border-dashed border-indigo-200 dark:border-indigo-900 shadow-inner flex flex-col items-center justify-center">
          <QRCodeSVG
            value={qrData}
            size={180}
            level="H"
            includeMargin={true}
          />
          <div className="mt-2 text-xs font-mono font-bold text-slate-700 tracking-wider">
            {token}
          </div>
        </div>

        {/* Student details snapshot */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-left text-xs space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-400">Attendee:</span>
            <span className="font-bold text-slate-800 dark:text-slate-100">{user?.full_name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Student ID:</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">{user?.student_id || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Venue:</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[170px]">{event.venue}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Status:</span>
            <span className="font-bold text-emerald-600 capitalize">{registration.registration_status}</span>
          </div>
        </div>

        <button
          onClick={() => window.print()}
          className="w-full py-2.5 px-4 text-xs font-bold text-indigo-600 dark:text-indigo-300 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 rounded-xl flex items-center justify-center gap-2 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Save / Print Ticket</span>
        </button>
      </div>
    </div>
  );
};
