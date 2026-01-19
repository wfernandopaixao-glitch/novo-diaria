
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input: React.FC<InputProps> = ({ label, className, ...props }) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <input
        className={`px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-800 ${className}`}
        {...props}
      />
    </div>
  );
};

export const TextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }> = ({ label, className, ...props }) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <textarea
        className={`px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-800 min-h-[100px] ${className}`}
        {...props}
      />
    </div>
  );
};

export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label: string }> = ({ label, children, className, ...props }) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <select
        className={`px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-800 bg-white ${className}`}
        {...props}
      >
        {children}
      </select>
    </div>
  );
};
