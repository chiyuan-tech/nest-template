'use client';

import { X } from 'lucide-react';
import { Button } from './button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./dialog";

interface InsufficientCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
  requiredCredits: number;
  currentCredits?: number;
}

export function InsufficientCreditsModal({
  isOpen,
  onClose,
  requiredCredits,
  currentCredits = 0,
}: InsufficientCreditsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-center">Insufficient Credits</DialogTitle>
        </DialogHeader>
        <div className="text-center py-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Not enough credits
          </h3>
          <p className="text-muted-foreground mb-6">
            You need at least {requiredCredits} credit{requiredCredits > 1 ? 's' : ''} to generate. You currently have {currentCredits} credit{currentCredits !== 1 ? 's' : ''}. Please purchase more credits to continue.
          </p>
          <div className="flex gap-3 justify-center">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                onClose();
                window.open('/pricing', '_blank');
              }}
            >
              Buy Credits
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

