import React from 'react';

export default function Button({ children, onClick, variant = 'primary', type = 'button' }) {
  const baseStyles = "w-full py-3 px-4 font-bold rounded-xl transition text-center text-sm tracking-wide";
  
  const variants = {
    primary: "bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/10",
    secondary: "bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200"
  };

  return (
    <button type={type} onClick={onClick} className={`${baseStyles} ${variants[variant]}`}>
      {children}
    </button>
  );
}