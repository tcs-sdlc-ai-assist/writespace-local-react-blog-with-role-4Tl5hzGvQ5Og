import React from 'react';

interface StatCardProps {
  title: string;
  value: number;
  icon: string;
}

export function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-white to-gray-50 shadow-md p-6 flex items-center gap-4 transition hover:shadow-lg">
      <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 text-3xl shrink-0">
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-500">{title}</span>
        <span className="text-2xl font-bold text-gray-900">{value}</span>
      </div>
    </div>
  );
}