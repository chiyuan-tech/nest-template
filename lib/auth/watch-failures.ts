import { AUTH_LOAD_TIMEOUT_MS, AuthLoadError } from './session-store';

// Webpack's local clerk-runtime chunk is not a Clerk SDK resource. Matching every
// URL containing "clerk" also arms false deadlines during development/HMR.
function isClerkScript(src: string) {
  return !/\/_next\//i.test(src) && /\/npm\/@clerk\/|\/clerk(?:\.browser|-ui)?(?:[.-][\w-]+)*\.js(?:[?#]|$)/i.test(src);
}

function scriptLabel(src: string) {
  try { const url = new URL(src, window.location?.href); return `${url.host}${url.pathname}`; }
  catch { return 'Clerk SDK'; }
}

// Error boundaries cannot catch resource events or unhandled asynchronous SDK failures.
export function watchAuthFailures(options: {
  getAttempt: () => number;
  fail: (error: unknown, attempt: number) => void;
}) {
  const browserWindow = window;
  const pending = new Map<HTMLScriptElement, ReturnType<typeof setTimeout>>();
  const completed = new WeakMap<HTMLScriptElement, string>();
  const sdkReady = (script: HTMLScriptElement) =>
    /\/clerk\.browser(?:[.-][\w-]+)*\.js(?:[?#]|$)/i.test(script.src) &&
    (browserWindow as Window & { Clerk?: { loaded?: boolean } }).Clerk?.loaded === true;
  const finishScript = (script: HTMLScriptElement) => {
    clearTimeout(pending.get(script));
    pending.delete(script);
    completed.set(script, script.src);
  };
  const watchScript = (script: HTMLScriptElement) => {
    if (!isClerkScript(script.src) || pending.has(script) || completed.get(script) === script.src) return;
    if (sdkReady(script)) { finishScript(script); return; }
    const attempt = options.getAttempt();
    pending.set(script, setTimeout(() => {
      finishScript(script);
      // SDK readiness is authoritative even if a cached script's load event was missed.
      if (sdkReady(script)) return;
      script.setAttribute('data-app-auth-failed', 'true');
      options.fail(new AuthLoadError(`Authentication script timed out: ${scriptLabel(script.src)}`), attempt);
    }, AUTH_LOAD_TIMEOUT_MS));
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
      if (isClerkScript(target.src)) target.setAttribute('data-app-auth-failed', 'true');
    }
    const source = target instanceof HTMLScriptElement ? target.src : event instanceof ErrorEvent ? `${event.filename} ${event.message}` : '';
    if (target instanceof HTMLScriptElement ? isClerkScript(source) : /clerk/i.test(source)) {
      const Failure = target instanceof HTMLScriptElement ? AuthLoadError : Error;
      options.fail(new Failure(`Authentication script failed: ${target instanceof HTMLScriptElement ? scriptLabel(source) : 'Clerk runtime'}`), options.getAttempt());
    }
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
