import React from 'react';

export default function MetricCard({ title, value, changeText, isPositive = true }) {
  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-850 border border-slate-800 p-6 rounded-2xl relative overflow-hidden shadow-xl">
      <p className="text-sm font-medium text-slate-400 tracking-wide uppercase">{title}</p>
      <h2 className="text-3xl font-extrabold text-white mt-2">{value}</h2>
      {changeText && (
        <div className={`flex items-center gap-2 mt-4 text-sm font-medium ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
          <span>{isPositive ? '↑' : '↓'} {changeText}</span>
        </div>
      )}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
}