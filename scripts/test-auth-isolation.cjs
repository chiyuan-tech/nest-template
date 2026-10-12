// Run with node --test scripts/test-auth-isolation.cjs. No browser or build required.
const { test, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const modules = new Map();

// Execute project TypeScript in memory, using the installed compiler and normal packages.
function loadProject(file) {
  const resolved = [file, `${file}.ts`, `${file}.tsx`, `${file}.js`].find(p => fs.existsSync(p) && fs.statSync(p).isFile());
  assert.ok(resolved, `Missing test module: ${file}`);
  if (modules.has(resolved)) return modules.get(resolved).exports;
  const mod = { exports: {} };
  modules.set(resolved, mod);
  const code = ts.transpileModule(fs.readFileSync(resolved, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
    fileName: resolved,
  }).outputText;
  const localRequire = name => {
    // Public rendering must not even evaluate the SDK module.
    if (name.startsWith('@clerk/')) throw new Error(`Clerk escaped its runtime: ${name}`);
    if (name.startsWith('@/')) return loadProject(path.join(root, name.slice(2)));
    if (name.startsWith('.')) return loadProject(path.resolve(path.dirname(resolved), name));
    return require(name);
  };
  new Function('require', 'module', 'exports', code)(localRequire, mod, mod.exports);
  return mod.exports;
}

const { AuthSessionStore, AUTH_TIMEOUT_MS, withAuthTimeout } = loadProject(path.join(root, 'lib/auth/session-store'));
const guard = loadProject(path.join(root, 'lib/auth/request-guard'));
const { api } = loadProject(path.join(root, 'lib/api'));
const { watchAuthFailures } = loadProject(path.join(root, 'lib/auth/watch-failures'));
const user = id => ({ id, firstName: 'Test', lastName: null, fullName: 'Test', username: null, imageUrl: '', primaryEmailAddress: { emailAddress: `${id}@example.test` } });
const profile = id => ({ uuid: id, free_limit: 1, remaining_limit: 2, level: 0, free_times: 0 });
const tokens = id => ({ access_token: `token-${id}`, refresh_token: 'refresh', expire_at: Math.floor(Date.now() / 1000) + 3600 });
const commands = overrides => ({ openSignIn() {}, openSignUp() {}, closeAuth() {}, async signOut() {}, async refreshUserInfo() {}, ...overrides });
let stores, requests, storage;
const originalFetch = global.fetch;

beforeEach(t => {
  t.mock.method(console, 'log', () => {});
  t.mock.method(console, 'error', () => {});
  stores = [];
  requests = [];
  storage = new Map();
  global.window = {};
  global.localStorage = { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, String(value)), removeItem: key => storage.delete(key) };
  global.fetch = async (url, options) => {
    requests.push({ url, options });
    return { ok: true, json: async () => ({ code: 200, data: {} }) };
  };
  guard.revokeRequestAuthorization();
});
afterEach(() => {
  stores.forEach(({ store, attempt }) => store.stop(attempt));
  guard.revokeRequestAuthorization();
  global.fetch = originalFetch;
  delete global.window;
  delete global.localStorage;
});
function fresh() {
  const store = new AuthSessionStore();
  const entry = { store, attempt: store.start() };
  stores.push(entry);
  return entry;
}
function signIn(store, attempt, id = 'user-a') {
  const operation = store.beginSync(attempt, user(id));
  assert.equal(store.completeSync(operation, profile(id), tokens(id)), true);
  return operation;
}
async function assertPaidActionsBlocked() {
  const file = new File(['image'], 'reference.png', { type: 'image/png' });
  const calls = [
    () => api.payment.createPaypalSession('price-test'),
    () => api.video.textToVideo({ prompt: 'test', resolution: '480p', ratio: '16:9', duration: 5 }),
    () => api.video.imageToVideo({ prompt: 'test', resolution: '480p', duration: 5, image_file: file }),
    () => api.video.seedance15TextToVideo({ prompt: 'test', resolution: '480p', duration: 5, audio: false, camerafixed: false }),
    () => api.video.seedance15ImageToVideo({ prompt: 'test', resolution: '480p', duration: 5, image_file: file, audio: false, camerafixed: false }),
  ];
  const before = requests.length;
  for (const call of calls) await assert.rejects(call, /登录暂时不可用/);
  assert.equal(requests.length, before, 'No checkout or billable task may reach fetch');
}

test('old persisted tokens cannot enable payment or any generation endpoint', async () => {
  localStorage.setItem('access_token', 'old-token');
  localStorage.setItem('token_expire_at', tokens('old').expire_at);
  await assertPaidActionsBlocked();
});

test('only completed live user synchronization enables authenticated requests', async () => {
  const { store, attempt } = fresh();
  const operation = store.beginSync(attempt, user('user-a'));
  await assertPaidActionsBlocked();
  store.completeSync(operation, profile('user-a'), tokens('user-a'));
  await api.payment.createPaypalSession('price-test');
  assert.equal(requests.length, 1);
  assert.equal(requests[0].options.headers.Authorization, 'Bearer token-user-a');
});

test('runtime failure revokes an existing session and rejects a late synchronization result', async () => {
  const { store, attempt } = fresh();
  const operation = signIn(store, attempt);
  store.fail(new Error('render, script or async failure'), attempt);
  assert.equal(store.getSnapshot().status, 'unavailable');
  assert.equal(store.getSnapshot().user, null);
  assert.equal(operation.signal.aborted, true);
  assert.equal(store.completeSync(operation, profile('user-a'), tokens('user-a')), false);
  assert.equal(localStorage.getItem('access_token'), null);
  await assertPaidActionsBlocked();
  await api.website.getConfig();
  await api.cms.getFriendLinkList();
  assert.equal(requests.length, 2, 'Public requests remain available');
});

test('account switch discards user A and rejects mismatched user profiles', () => {
  const { store, attempt } = fresh();
  const old = store.beginSync(attempt, user('user-a'));
  const next = store.beginSync(attempt, user('user-b'));
  assert.equal(store.completeSync(old, profile('user-a'), tokens('user-a')), false);
  assert.throws(() => store.completeSync(next, profile('user-a'), tokens('user-a')), /identity mismatch/);
  assert.throws(guard.requireAuthorizedToken);
  store.completeSync(next, profile('user-b'), tokens('user-b'));
  assert.equal(store.getSnapshot().user.id, 'user-b');
  assert.equal(guard.requireAuthorizedToken(), 'token-user-b');
});

test('loading and user-sync deadlines fail closed', t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const first = fresh();
  t.mock.timers.tick(AUTH_TIMEOUT_MS);
  assert.equal(first.store.getSnapshot().status, 'unavailable');
  const second = fresh();
  const operation = second.store.beginSync(second.attempt, user('user-a'));
  t.mock.timers.tick(AUTH_TIMEOUT_MS);
  assert.equal(second.store.getSnapshot().status, 'unavailable');
  assert.equal(operation.signal.aborted, true);
  assert.throws(guard.requireAuthorizedToken);
});

test('hung asynchronous authentication operations time out or abort', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const controller = new AbortController();
  const pending = withAuthTimeout(new Promise(() => {}), controller.signal);
  const rejection = assert.rejects(pending, /timed out/);
  t.mock.timers.tick(AUTH_TIMEOUT_MS);
  await rejection;
  const aborting = withAuthTimeout(new Promise(() => {}), controller.signal);
  const aborted = assert.rejects(aborting, { name: 'AbortError' });
  controller.abort();
  await aborted;
  await assert.rejects(withAuthTimeout(Promise.reject(new Error('late rejection')), controller.signal), { name: 'AbortError' });
});

// Minimal DOM event doubles exercise the production watcher without opening a browser.
function failureWatcherEnvironment(t, options) {
  const handlers = new Map();
  class FakeElement { querySelectorAll() { return []; } }
  class FakeScript extends FakeElement {
    constructor(src) { super(); this.src = src; this.removed = false; this.attributes = {}; }
    setAttribute(key, value) { this.attributes[key] = value; }
    remove() { this.removed = true; }
  }
  let mutate;
  global.Element = FakeElement;
  global.HTMLScriptElement = FakeScript;
  global.ErrorEvent = class {};
  global.MutationObserver = class {
    constructor(callback) { mutate = callback; }
    observe() {}
    disconnect() {}
  };
  global.document = { documentElement: {} };
  global.window = {
    addEventListener: (type, handler) => handlers.set(type, handler),
    removeEventListener: type => handlers.delete(type),
  };
  const watcher = watchAuthFailures(options);
  t.after(() => {
    watcher.dispose();
    for (const key of ['Element', 'HTMLScriptElement', 'ErrorEvent', 'MutationObserver', 'document']) delete global[key];
  });
  return {
    ...watcher,
    script: url => new FakeScript(url),
    insert: script => mutate([{ type: 'childList', addedNodes: [script] }]),
    emit: (type, event) => handlers.get(type)?.(event),
    handlers,
  };
}

test('script failure and SDK async rejection are handled without intercepting unrelated errors', t => {
  const failures = [];
  const env = failureWatcherEnvironment(t, { getAttempt: () => 7, fail: (error, attempt) => failures.push({ error, attempt }) });
  env.emit('error', { target: env.script('https://example.test/unrelated.js') });
  env.emit('unhandledrejection', { reason: new Error('Unrelated API error') });
  assert.equal(failures.length, 0);
  const script = env.script('https://auth.example.test/npm/@clerk/clerk-js/dist/clerk.browser.js');
  env.insert(script);
  env.emit('error', { target: script });
  assert.equal(failures.length, 1);
  assert.equal(failures[0].attempt, 7);
  assert.equal(script.attributes['data-app-auth-failed'], 'true');
  env.emit('unhandledrejection', { reason: { clerkError: true, message: 'Network failed' } });
  assert.equal(failures.length, 2);
  env.dispose();
  assert.equal(env.handlers.size, 0);
});

test('a hung secondary Clerk script fails closed even after the SDK was ready', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const { store, attempt } = fresh();
  store.signedOut(attempt);
  const env = failureWatcherEnvironment(t, { getAttempt: () => attempt, fail: store.fail });
  const script = env.script('https://auth.example.test/npm/@clerk/clerk-js/dist/clerk.browser.js');
  env.insert(script);
  t.mock.timers.tick(AUTH_TIMEOUT_MS);
  assert.equal(store.getSnapshot().status, 'unavailable');
  assert.equal(script.attributes['data-app-auth-failed'], 'true');
  await assertPaidActionsBlocked();
});

test('successful script load and retry cleanup cancel script deadlines', t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const failures = [];
  const env = failureWatcherEnvironment(t, { getAttempt: () => 1, fail: error => failures.push(error) });
  const loaded = env.script('https://auth.example.test/clerk.browser.js');
  env.insert(loaded);
  env.emit('load', { target: loaded });
  const pending = env.script('https://auth.example.test/clerk-ui.js');
  env.insert(pending);
  env.reset();
  assert.equal(pending.removed, true);
  assert.equal(loaded.removed, false);
  t.mock.timers.tick(AUTH_TIMEOUT_MS);
  assert.equal(failures.length, 0);
});

test('retry cannot restore a stale session or receive errors from an older attempt', async () => {
  const entry = fresh();
  const old = signIn(entry.store, entry.attempt);
  const previousAttempt = entry.attempt;
  entry.store.fail(new Error('failed'), previousAttempt);
  entry.attempt = entry.store.start();
  entry.store.fail(new Error('late old error'), previousAttempt);
  assert.equal(entry.store.getSnapshot().status, 'loading');
  assert.equal(entry.store.completeSync(old, profile('user-a'), tokens('user-a')), false);
  await assertPaidActionsBlocked();
  signIn(entry.store, entry.attempt, 'user-b');
  assert.equal(guard.requireAuthorizedToken(), 'token-user-b');
});

test('sign-out revokes requests immediately even if the SDK rejects later', async () => {
  const { store, attempt } = fresh();
  signIn(store, attempt);
  let reject;
  store.register(attempt, commands({ signOut: () => new Promise((_, fail) => { reject = fail; }) }));
  const pending = store.run('signOut');
  const failure = assert.rejects(pending, /登录暂时不可用/);
  await assertPaidActionsBlocked();
  reject(new Error('network failure'));
  await failure;
  assert.equal(store.getSnapshot().status, 'unavailable');
});

test('async modal failure is handled even while the user is signed out', async () => {
  const { store, attempt } = fresh();
  store.signedOut(attempt);
  store.register(attempt, commands({ openSignIn: async () => { throw new Error('modal failed'); } }));
  await assert.rejects(store.run('openSignIn'), /登录暂时不可用/);
  assert.equal(store.getSnapshot().status, 'unavailable');
});

test('queued auth commands do not run after a failure', async () => {
  const { store, attempt } = fresh();
  let opened = false;
  store.signedOut(attempt);
  store.register(attempt, commands({ openSignIn: () => { opened = true; } }));
  const pending = store.run('openSignIn');
  store.fail(new Error('script failed'), attempt);
  await assert.rejects(pending);
  assert.equal(opened, false);
});

test('token expiration cannot use a previously authorized backend token', async () => {
  const { store, attempt } = fresh();
  const operation = store.beginSync(attempt, user('user-a'));
  assert.throws(() => store.completeSync(operation, profile('user-a'), { ...tokens('user-a'), expire_at: 1 }));
  await assertPaidActionsBlocked();
});

test('public navigation, body and pricing render on the server without evaluating Clerk', () => {
  delete global.window;
  delete global.localStorage;
  const React = require('react');
  const { renderToString } = require('react-dom/server');
  const { AuthProvider } = loadProject(path.join(root, 'components/auth/auth-provider'));
  const { ToastProvider } = loadProject(path.join(root, 'components/ui/toast-provider'));
  const PricingSection = loadProject(path.join(root, 'components/PricingSection')).default;
  const html = renderToString(React.createElement(ToastProvider, null,
    React.createElement(AuthProvider, null,
      React.createElement('nav', null, React.createElement('a', { href: '/' }, 'Home')),
      React.createElement('main', null, 'Public feature introduction'),
      React.createElement(PricingSection))));
  assert.match(html, /Public feature introduction/);
  assert.match(html, /href="\/"/);
  assert.match(html, /id="pricing"/);
  assert.doesNotMatch(html, /clerk\.browser/);
});

test('Clerk imports are confined to the isolated runtime modules', () => {
  const walk = directory => fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? walk(path.join(directory, entry.name)) : [path.join(directory, entry.name)]);
  const allowed = new Set(['components/auth/clerk-runtime.tsx', 'components/auth/clerk-provider.tsx', 'components/auth/google-one-tap.tsx']);
  for (const file of ['app', 'components', 'lib'].flatMap(directory => walk(path.join(root, directory)))) {
    if (!/\.tsx?$/.test(file)) continue;
    const relative = path.relative(root, file).replaceAll('\\', '/');
    if (/@clerk\//.test(fs.readFileSync(file, 'utf8'))) assert.ok(allowed.has(relative), `SDK import outside auth runtime: ${relative}`);
  }
});
