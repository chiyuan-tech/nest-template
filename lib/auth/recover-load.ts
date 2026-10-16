import type { AuthSessionStore } from './session-store';

// One automatic recovery per provider lifetime; never retry backend or identity errors.
export function recoverAuthLoad(store: AuthSessionStore, retry: () => void) {
  let used = false;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const unsubscribe = store.subscribe(() => {
    if (!store.canRetryLoad()) {
      clearTimeout(timer);
      timer = undefined;
    } else if (!used && timer === undefined) {
      timer = setTimeout(() => {
        timer = undefined;
        if (!store.canRetryLoad()) return;
        used = true;
        retry();
      }, 1000);
    }
  });
  return () => { unsubscribe(); clearTimeout(timer); };
}
