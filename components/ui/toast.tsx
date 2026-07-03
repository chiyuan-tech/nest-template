'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

export const Toast = ({ message, type, onClose }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // Auto-close after 5 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-100 border-green-500' :
                 type === 'error' ? 'bg-red-100 border-red-500' :
                 'bg-card border-ring';
  
  const textColor = type === 'success' ? 'text-green-800' :
                   type === 'error' ? 'text-red-800' :
                   'text-foreground';
  
  const iconColor = type === 'success' ? 'text-green-500' :
                   type === 'error' ? 'text-red-500' :
                   'text-ring';

  return (
    <div className={`fixed right-4 top-4 z-50 mb-4 flex items-center rounded-[20px] border-l-4 p-4 shadow-md ${bgColor}`} role="alert">
      <div className={`text-sm font-medium ${textColor}`}>{message}</div>
      <button 
        type="button" 
        className={`ml-auto -mx-1.5 -my-1.5 ${iconColor} rounded-lg p-1.5 hover:opacity-75 inline-flex items-center justify-center h-8 w-8`}
        onClick={onClose}
      >
        <X size={16} />
      </button>
    </div>
  );
}; 
