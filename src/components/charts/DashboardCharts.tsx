import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from 'recharts';

const trendData = [
  { day: 'Oct 1', registrations: 12, attendance: 10 },
  { day: 'Oct 5', registrations: 28, attendance: 25 },
  { day: 'Oct 10', registrations: 54, attendance: 48 },
  { day: 'Oct 15', registrations: 89, attendance: 78 },
  { day: 'Oct 20', registrations: 164, attendance: 142 },
  { day: 'Oct 25', registrations: 248, attendance: 210 },
  { day: 'Oct 26', registrations: 312, attendance: 280 },
];

const categoryData = [
  { name: 'Technical', value: 38, color: '#6366F1' },
  { name: 'Cultural', value: 27, color: '#8B5CF6' },
  { name: 'Competitions', value: 18, color: '#EC4899' },
  { name: 'Workshops', value: 12, color: '#F59E0B' },
  { name: 'Seminars', value: 5, color: '#10B981' },
];

const departmentData = [
  { department: 'Computer Science', students: 340, registered: 290 },
  { department: 'Electronics', students: 280, registered: 210 },
  { department: 'Information Tech', students: 240, registered: 195 },
  { department: 'Mechanical', students: 210, registered: 140 },
  { department: 'Data Science', students: 160, registered: 152 },
];

export const RegistrationTrendChart: React.FC = () => {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="regGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="attGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} tickLine={false} />
          <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0F172A',
              border: 'none',
              borderRadius: '12px',
              fontSize: '12px',
              color: '#FFFFFF',
            }}
          />
          <Area
            type="monotone"
            dataKey="registrations"
            stroke="#6366F1"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#regGrad)"
            name="Registrations"
          />
          <Area
            type="monotone"
            dataKey="attendance"
            stroke="#10B981"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#attGrad)"
            name="Attendance"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export const CategoryPieChart: React.FC = () => {
  return (
    <div className="w-full h-64 flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={categoryData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={85}
            paddingAngle={4}
            dataKey="value"
          >
            {categoryData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#0F172A',
              border: 'none',
              borderRadius: '12px',
              fontSize: '12px',
              color: '#FFFFFF',
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            formatter={(value) => <span className="text-xs text-slate-600 dark:text-slate-300">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export const DepartmentBarChart: React.FC = () => {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={departmentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <XAxis dataKey="department" stroke="#94A3B8" fontSize={10} tickLine={false} />
          <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0F172A',
              border: 'none',
              borderRadius: '12px',
              fontSize: '12px',
              color: '#FFFFFF',
            }}
          />
          <Legend
            verticalAlign="top"
            height={30}
            iconType="circle"
            formatter={(value) => <span className="text-xs text-slate-600 dark:text-slate-300">{value}</span>}
          />
          <Bar dataKey="students" fill="#E2E8F0" radius={[6, 6, 0, 0]} name="Total Enrolled" />
          <Bar dataKey="registered" fill="#6366F1" radius={[6, 6, 0, 0]} name="Active Participants" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
