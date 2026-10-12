import { AUTH_TIMEOUT_MS } from './session-store';

// Error boundaries cannot catch resource events or unhandled asynchronous SDK failures.
export function watchAuthFailures(options: {
  getAttempt: () => number;
  fail: (error: unknown, attempt: number) => void;
}) {
  const browserWindow = window;
  const pending = new Map<HTMLScriptElement, ReturnType<typeof setTimeout>>();
  const finishScript = (script: HTMLScriptElement) => {
    clearTimeout(pending.get(script));
    pending.delete(script);
  };
  const watchScript = (script: HTMLScriptElement) => {
    if (!/clerk/i.test(script.src) || pending.has(script)) return;
    const attempt = options.getAttempt();
    pending.set(script, setTimeout(() => {
      finishScript(script);
      script.setAttribute('data-app-auth-failed', 'true');
      options.fail(new Error('Authentication script timed out'), attempt);
    }, AUTH_TIMEOUT_MS));
  };
  const observer = new MutationObserver(records => {
    records.forEach(record => {
      if (record.type === 'attributes' && record.target instanceof HTMLScriptElement) watchScript(record.target);
      record.addedNodes.forEach(node => {
        if (node instanceof HTMLScriptElement) watchScript(node);
        else if (node instanceof Element) node.querySelectorAll('script').forEach(watchScript);
      });
    });
  });
  observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['src'] });
  const onLoad = (event: Event) => { if (event.target instanceof HTMLScriptElement) finishScript(event.target); };
  const onError = (event: ErrorEvent | Event) => {
    const target = event.target;
    if (target instanceof HTMLScriptElement) {
      finishScript(target);
      if (/clerk/i.test(target.src)) target.setAttribute('data-app-auth-failed', 'true');
    }
    const source = target instanceof HTMLScriptElement ? target.src : event instanceof ErrorEvent ? `${event.filename} ${event.message}` : '';
    if (/clerk/i.test(source)) options.fail(new Error('Authentication script failed'), options.getAttempt());
  };
  const onRejection = (event: PromiseRejectionEvent) => {
    const reason = event.reason;
    if (reason?.clerkError === true || /clerk/i.test(String(reason?.stack || reason?.message || reason))) {
      options.fail(reason, options.getAttempt());
    }
  };
  browserWindow.addEventListener('error', onError, true);
  browserWindow.addEventListener('load', onLoad, true);
  browserWindow.addEventListener('unhandledrejection', onRejection);

  const reset = () => {
    pending.forEach((timer, script) => { clearTimeout(timer); script.remove(); });
    pending.clear();
  };
  return {
    reset,
    dispose: () => {
      observer.disconnect();
      browserWindow.removeEventListener('error', onError, true);
      browserWindow.removeEventListener('load', onLoad, true);
      browserWindow.removeEventListener('unhandledrejection', onRejection);
      reset();
    },
  };
}
