'use client';

import { Component, type ErrorInfo, type ReactNode } from 'react';

interface AuthErrorBoundaryProps {
  children: ReactNode;
  /** Optional label for console diagnostics */
  name?: string;
}

interface AuthErrorBoundaryState {
  hasError: boolean;
}

/**
 * Isolates non-critical auth UI (e.g. Google One Tap) so a render/runtime
 * failure cannot take down the rest of the page.
 */
export default class AuthErrorBoundary extends Component<
  AuthErrorBoundaryProps,
  AuthErrorBoundaryState
> {
  state: AuthErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): AuthErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    const label = this.props.name ?? 'AuthErrorBoundary';
    console.error(`[${label}] swallowed error:`, error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}
