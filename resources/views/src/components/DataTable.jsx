import React from 'react';

export default function DataTable({ headers, children }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-medium">
              {headers.map((header, index) => (
                <th key={index} className={`pb-3 ${index === headers.length - 1 ? 'text-right' : ''}`}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {children}
          </tbody>
        </table>
      </div>
    </div>
  );
}