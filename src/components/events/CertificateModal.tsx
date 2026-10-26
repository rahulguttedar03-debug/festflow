import React from 'react';
import { X, Award, Download, CheckCircle2, ShieldCheck, Printer } from 'lucide-react';
import { CertificateRecord } from '../../types';
import { formatDate } from '../../lib/utils';

interface CertificateModalProps {
  certificate: CertificateRecord;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ certificate, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 overflow-hidden space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Certificate Frame */}
        <div className="relative p-8 sm:p-10 rounded-2xl border-4 border-double border-amber-600/40 bg-gradient-to-b from-amber-50/20 via-white to-amber-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-center space-y-5 shadow-inner">
          {/* Header Seal */}
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-900 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Award className="w-9 h-9" />
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-amber-700 dark:text-amber-400">
              Official University Certification
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 dark:text-white tracking-tight">
              Certificate of Participation
            </h2>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 italic">
            This is proudly presented and verified by the Office of Student Affairs to
          </p>

          {/* Student Name */}
          <div className="py-2 border-b-2 border-slate-200 dark:border-slate-800 max-w-md mx-auto">
            <h3 className="text-xl sm:text-2xl font-extrabold text-indigo-700 dark:text-indigo-400 tracking-wide">
              {certificate.student?.full_name || 'Alex Chen'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Roll No: {certificate.student?.student_id || 'CS2024-089'} — Department of {certificate.student?.department || 'Computer Science'}
            </p>
          </div>

          {/* Body Statement */}
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-lg mx-auto leading-relaxed">
            for successfully completing active participation in the university event{' '}
            <strong className="text-slate-900 dark:text-white font-bold block sm:inline">
              "{certificate.event?.title || 'FutureMinds — AI Workshop'}"
            </strong>{' '}
            held with distinguished commendation and verified attendance.
          </p>

          {/* Footer signatures & verification */}
          <div className="pt-6 grid grid-cols-2 gap-6 items-end text-xs">
            <div className="space-y-1 text-left">
              <div className="w-32 h-0.5 bg-slate-400/50 mb-1" />
              <p className="font-bold text-slate-800 dark:text-slate-200">Dr. Robert Vance</p>
              <p className="text-[10px] text-slate-400">Director, Student Affairs</p>
            </div>

            <div className="text-right space-y-1">
              <div className="flex items-center justify-end gap-1 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Digitally Verified</span>
              </div>
              <p className="font-mono text-[10px] text-slate-500">
                Code: {certificate.certificate_code}
              </p>
              <p className="text-[10px] text-slate-400">
                Issued: {formatDate(certificate.issued_at)}
              </p>
            </div>
          </div>
        </div>

        {/* Modal buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="py-2.5 px-4 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="py-2.5 px-5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-500/20 flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
