import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Users, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const RoleSelectPage: React.FC = () => {
  const { switchRole } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-4xl w-full space-y-10">
        <div className="text-center space-y-3">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Public Homepage</span>
          </Link>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Select Your Campus Portal
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Choose your role to access customized dashboards, events, or administrative controls.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Student Card */}
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <GraduationCap className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Student Login
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Discover events and manage your campus experience.
              </p>
            </div>

            <div className="pt-8 space-y-3">
              <Link
                to="/login/student"
                className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 transition-all"
              >
                <span>Continue as Student</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={async () => {
                  await switchRole('student');
                  navigate('/student/dashboard');
                }}
                className="w-full py-2 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                ⚡ Instant Demo: Enter as Alex Chen
              </button>
            </div>
          </div>

          {/* Parent Card */}
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-violet-500 dark:hover:border-violet-500 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-violet-50 dark:bg-violet-950/70 text-violet-600 dark:text-violet-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Parent Login
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Stay informed about your child's campus activities.
              </p>
            </div>

            <div className="pt-8 space-y-3">
              <Link
                to="/login/parent"
                className="w-full py-3 px-4 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-violet-600/20 transition-all"
              >
                <span>Continue as Parent</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={async () => {
                  await switchRole('parent');
                  navigate('/parent/dashboard');
                }}
                className="w-full py-2 text-[11px] font-semibold text-violet-600 dark:text-violet-400 hover:underline"
              >
                ⚡ Instant Demo: Enter as David Chen
              </button>
            </div>
          </div>

          {/* Admin Card */}
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-slate-700 dark:hover:border-slate-600 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Admin Login
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Manage events, registrations, and campus activities.
              </p>
            </div>

            <div className="pt-8 space-y-3">
              <Link
                to="/login/admin"
                className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <span>Continue as Admin</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={async () => {
                  await switchRole('admin');
                  navigate('/admin/dashboard');
                }}
                className="w-full py-2 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:underline"
              >
                ⚡ Instant Demo: Enter as Dr. Vance
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
