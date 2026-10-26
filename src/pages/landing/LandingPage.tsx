import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Users,
  Award,
  CheckCircle2,
  Clock,
  Compass,
  FileCheck2,
  Megaphone,
  BarChart3,
  Search,
  Filter,
  GraduationCap
} from 'lucide-react';
import { useEvents } from '../../contexts/EventContext';
import { EventCard } from '../../components/events/EventCard';
import { EventDetailModal } from '../../components/events/EventDetailModal';
import { CampusEvent, EventCategory } from '../../types';

export const LandingPage: React.FC = () => {
  const { events, registerForEvent } = useEvents();
  const [selectedEvent, setSelectedEvent] = useState<CampusEvent | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'date' | 'popularity'>('date');

  const categories = ['All', 'Technical', 'Cultural', 'Competitions', 'Workshops', 'Seminars'];

  const filteredEvents = events
    .filter((e) => e.status === 'published')
    .filter((e) => {
      const matchesSearch =
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.venue.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || e.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'popularity') {
        return b.registered_count - a.registered_count;
      }
      return new Date(a.start_at).getTime() - new Date(b.start_at).getTime();
    });

  const featuredEvents = events.slice(0, 6);

  const features = [
    {
      title: 'Seamless Event Discovery',
      description: 'Explore tech fests, cultural concerts, and hackathons with real-time seat tracking and batch eligibility.',
      icon: Compass,
      color: 'from-blue-500 to-indigo-600',
    },
    {
      title: 'Parent & Student Connectivity',
      description: 'Transparent parental oversight with instantaneous notifications and one-click digital consent workflows.',
      icon: Users,
      color: 'from-violet-500 to-purple-600',
    },
    {
      title: 'Smart Schedule & Conflict Alerts',
      description: 'Sync campus commitments seamlessly into personalized calendars with zero double-booking collisions.',
      icon: Calendar,
      color: 'from-amber-500 to-orange-600',
    },
    {
      title: 'QR Attendance Verification',
      description: 'Contactless check-in tokens scanned at campus venues to prevent duplicate access and verify participation.',
      icon: FileCheck2,
      color: 'from-emerald-500 to-teal-600',
    },
    {
      title: 'Broadcast Announcements',
      description: 'Targeted emergency notices and event updates sent directly to students, departments, or parents.',
      icon: Megaphone,
      color: 'from-rose-500 to-pink-600',
    },
    {
      title: 'Verified Digital Certificates',
      description: 'Tamper-proof credential issuance upon verified venue check-in, ready to share or print instantly.',
      icon: Award,
      color: 'from-indigo-500 to-violet-600',
    },
    {
      title: 'Administrative Control Suite',
      description: 'Comprehensive publishing controls, capacity limits, department-filtering, and CSV exports.',
      icon: ShieldCheck,
      color: 'from-slate-700 to-slate-900',
    },
    {
      title: 'Real-Time Campus Analytics',
      description: 'Monitor university-wide engagement velocity, departmental participation metrics, and attendance ratios.',
      icon: BarChart3,
      color: 'from-cyan-500 to-blue-600',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] transition-colors duration-200">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32">
        {/* Soft background ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-indigo-500/10 via-violet-500/5 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Next-Generation University Event Operating System</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              Every Campus Event.{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 dark:from-indigo-400 dark:via-violet-400 dark:to-indigo-300">
                One Connected Platform.
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal max-w-2xl mx-auto">
              Discover campus experiences, simplify event management, and keep students and parents connected. Everything happening on campus, organized in one place.
            </p>

            {/* CTA Buttons */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <a
                href="#events"
                className="px-7 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/35 hover:scale-[1.02] transition-all flex items-center gap-2"
              >
                <span>Explore Events</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <Link
                to="/login"
                className="px-7 py-3.5 rounded-2xl bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-bold text-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60 shadow-sm transition-all"
              >
                Get Started
              </Link>
            </div>

            {/* Micro stats banner */}
            <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto text-left">
              <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-800 backdrop-blur-sm">
                <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">12,400+</p>
                <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Active Students</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-800 backdrop-blur-sm">
                <p className="text-2xl font-black text-violet-600 dark:text-violet-400">250+</p>
                <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Annual Events</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-800 backdrop-blur-sm">
                <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">99.4%</p>
                <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Parent Consent Rate</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-800 backdrop-blur-sm">
                <p className="text-2xl font-black text-amber-600 dark:text-amber-400">100%</p>
                <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Verified QR Tickets</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section id="events" className="py-16 bg-white dark:bg-slate-900/50 border-y border-slate-200/60 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-bold tracking-wider uppercase text-indigo-600 dark:text-indigo-400">
                Curated Highlights
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Featured Campus Experiences
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Discover flagship intercollege fests, cultural nights, and hackathons.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Search & Sort Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/70 dark:border-slate-700/60">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search event, venue, keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
              <span className="text-slate-400 flex items-center gap-1 font-medium">
                <Filter className="w-3.5 h-3.5" />
                Sort:
              </span>
              <button
                onClick={() => setSortBy('date')}
                className={`px-2.5 py-1 rounded-lg font-semibold ${
                  sortBy === 'date'
                    ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Earliest
              </button>
              <button
                onClick={() => setSortBy('popularity')}
                className={`px-2.5 py-1 rounded-lg font-semibold ${
                  sortBy === 'popularity'
                    ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Most Popular
              </button>
            </div>
          </div>

          {/* Event Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredEvents.map((evt) => (
              <EventCard
                key={evt.id}
                event={evt}
                onViewDetails={(e) => setSelectedEvent(e)}
                onQuickRegister={(id) => registerForEvent(id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Platform Features Grid */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold tracking-wider uppercase text-indigo-600 dark:text-indigo-400">
            Engineered for Higher Education
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Everything your campus needs to thrive
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            A cohesive three-way platform giving administrators, students, and parents a delightful, reliable experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <div
                key={index}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-subtle hover:shadow-card-hover transition-all duration-300 group hover:-translate-y-1"
              >
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${feat.color} text-white flex items-center justify-center shadow-md mb-4 group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2">
                  {feat.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Role Personas Quick Showcase */}
      <section id="about" className="py-16 bg-gradient-to-b from-indigo-50/50 via-white to-slate-50 dark:from-slate-900/60 dark:via-slate-900 dark:to-slate-950 border-t border-slate-200/60 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Three Dedicated Portals. Infinite Possibilities.
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Each stakeholder gets an interface tailored to their exact responsibilities and privacy boundaries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Student Role Card */}
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-950/60 shadow-lg shadow-indigo-500/5 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Student Hub</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Discover fests, register in seconds, monitor seat limits, avoid calendar clashes, and download official certificates.
              </p>
              <Link
                to="/login/student"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:gap-2 transition-all"
              >
                <span>Enter Student Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Parent Role Card */}
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-violet-100 dark:border-violet-950/60 shadow-lg shadow-violet-500/5 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-violet-50 dark:bg-violet-950 text-violet-600 dark:text-violet-400 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Parent Portal</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Stay updated on your child's schedule, review overnight excursion consent requests with full itinerary, and see attendance records.
              </p>
              <Link
                to="/login/parent"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-600 dark:text-violet-400 hover:gap-2 transition-all"
              >
                <span>Enter Parent Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Admin Role Card */}
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Admin Command</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Publish events with eligibility rules, monitor registrations, scan QR passes at check-in, broadcast alerts, and inspect analytics.
              </p>
              <Link
                to="/login/admin"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 hover:gap-2 transition-all"
              >
                <span>Enter Admin Console</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Selected Event Details Modal */}
      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
};
