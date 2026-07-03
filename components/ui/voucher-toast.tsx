'use client';

import React, { useEffect } from 'react';
import { X, Gift } from 'lucide-react';

interface VoucherToastProps {
  count: number;
  onClose: () => void;
}

export const VoucherToast: React.FC<VoucherToastProps> = ({ count, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 10000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 z-[80]">
      <div className="relative flex min-w-[280px] max-w-[360px] items-start gap-3 rounded-[20px] border border-border bg-card px-4 py-3 shadow-md">
        <div className="absolute inset-x-6 -top-[1px] h-[2px] rounded-full bg-ring" />

        <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-ring">
          <Gift className="h-5 w-5" />
        </div>

        <div className="flex-1">
          <div className="text-sm font-semibold text-foreground">
            {count} trial vouchers for you.
          </div>
          <div className="mt-1 text-xs leading-snug text-muted-foreground">
            You can use these vouchers to try out any model you wish.
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close voucher toast"
          className="mt-1 ml-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

