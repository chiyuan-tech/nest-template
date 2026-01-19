'use client';

import React, { createContext, useCallback, useContext, useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

type UpgradeModalContextValue = {
  openUpgradeModal: (options?: { source?: string; productId?: string; reason?: string }) => void;
  closeUpgradeModal: () => void;
};

const UpgradeModalContext = createContext<UpgradeModalContextValue>({
  openUpgradeModal: () => {},
  closeUpgradeModal: () => {},
});

export function UpgradeModalProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [modalData, setModalData] = useState<{
    source?: string;
    productId?: string;
    reason?: string;
  }>({});

  const openUpgradeModal = useCallback((options?: { source?: string; productId?: string; reason?: string }) => {
    setModalData(options || {});
    setOpen(true);
  }, []);

  const closeUpgradeModal = useCallback(() => {
    setOpen(false);
  }, []);

  const value = useMemo<UpgradeModalContextValue>(
    () => ({ openUpgradeModal, closeUpgradeModal }),
    [openUpgradeModal, closeUpgradeModal]
  );

  return (
    <UpgradeModalContext.Provider value={value}>
      {children}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="text-center">Upgrade Plan</DialogTitle>
            <DialogDescription className="text-center">
              {modalData.reason || 'Upgrade to enjoy more features and parameter options'}
            </DialogDescription>
          </DialogHeader>
          <div className="text-center py-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-primary/20 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Unlock More Features
            </h3>
            <p className="text-muted-foreground mb-6">
              Upgrade to use higher resolutions, longer durations, and other advanced parameters
            </p>
            <div className="flex gap-3 justify-center">
              <Button
                variant="outline"
                onClick={closeUpgradeModal}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  closeUpgradeModal();
                  window.open('/pricing', '_blank');
                }}
              >
                View Plans
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </UpgradeModalContext.Provider>
  );
}

export function useUpgradeModal(): UpgradeModalContextValue {
  const context = useContext(UpgradeModalContext);
  if (context === undefined) {
    throw new Error('useUpgradeModal must be used within an UpgradeModalProvider');
  }
  return context;
}

