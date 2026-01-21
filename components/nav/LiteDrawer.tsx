'use client';

import React, { useEffect, useCallback, useRef } from 'react';

interface LiteDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

export const LiteDrawer: React.FC<LiteDrawerProps> = ({
  open,
  onOpenChange,
  children,
  className = '',
}) => {
  const drawerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const scrollYRef = useRef<number>(0);

  // 使用 rAF 批量更新样式，避免多次重排
  const updateStyles = useCallback(() => {
    if (open) {
      const isMobile = window.innerWidth < 768;
      
      requestAnimationFrame(() => {
        // 保存当前滚动位置
        scrollYRef.current = window.scrollY;
        
        // 禁用所有滚动，防止横向滚动
        document.body.style.overflow = 'hidden';
        document.body.style.overflowX = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollYRef.current}px`;
        document.body.style.width = '100%';
        document.body.style.left = '0';
        document.body.style.right = '0';
        document.documentElement.style.overflowX = 'hidden';
        
        if (!isMobile) {
          const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
          document.body.style.paddingRight = `${scrollbarWidth}px`;
        } else {
          document.body.style.paddingRight = '0px';
        }
      });
    } else {
      requestAnimationFrame(() => {
        // 恢复滚动
        document.body.style.overflow = '';
        document.body.style.overflowX = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.paddingRight = '';
        document.documentElement.style.overflowX = '';
        
        // 恢复滚动位置
        window.scrollTo(0, scrollYRef.current);
      });
    }
  }, [open]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onOpenChange(false);
      }
    };
    
    if (open) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [open, onOpenChange]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    updateStyles();
  }, [updateStyles]);

  const handleOverlayClick = useCallback(() => {
    requestAnimationFrame(() => {
      onOpenChange(false);
    });
  }, [onOpenChange]);

  return (
    <>
      {/* Overlay - always in DOM */}
      <div
        ref={overlayRef}
        onClick={handleOverlayClick}
        className={`fixed inset-0 bg-slate-950/80 transition-opacity duration-200 ease-out ${
          open ? 'opacity-100 pointer-events-auto z-40' : 'opacity-0 pointer-events-none -z-10'
        }`}
        aria-hidden={!open}
      />

      {/* Drawer Panel - always in DOM */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
        className={`fixed top-0 right-0 bottom-0 h-dvh max-h-dvh w-[85vw] sm:w-[340px] bg-slate-900 shadow-2xl transition-transform duration-200 ease-out z-50 overflow-y-auto overflow-x-hidden overscroll-contain touch-pan-y ${
          open ? 'translate-x-0' : 'translate-x-full'
        } [will-change:transform] ${className}`}
      >
        {children}
      </div>
    </>
  );
};

interface LiteDrawerCloseProps {
  onClose: () => void;
  children: React.ReactNode;
}

export const LiteDrawerClose: React.FC<LiteDrawerCloseProps> = ({ onClose, children }) => {
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    requestAnimationFrame(() => {
      onClose();
    });
  }, [onClose]);

  return (
    <div onClick={handleClick}>
      {children}
    </div>
  );
};

