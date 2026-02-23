type ServiceAccountPayload = {
  project_id?: string;
  client_email?: string;
  private_key?: string;
};

export type FirebaseAdminContext = {
  projectId: string;
  hasServiceAccount: boolean;
  hasAdminSdk: boolean;
};

function parseServiceAccount(): ServiceAccountPayload | null {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!raw) return null;

  const candidates = [raw];
  try {
    const decoded = Buffer.from(raw, 'base64').toString('utf-8');
    if (decoded && decoded !== raw) candidates.push(decoded);
  } catch {
    // ignore invalid base64
  }

  for (const candidate of candidates) {
    try {
      const parsed = JSON.parse(candidate) as ServiceAccountPayload;
      if (!parsed.client_email || !parsed.private_key) continue;
      return {
        ...parsed,
        private_key: parsed.private_key.replace(/\\n/g, '\n'),
      };
    } catch {
      // continue
    }
  }

  return null;
}

function loadFirebaseAdminSdk() {
  try {
    // Avoid hard dependency at build-time: runtime uses firebase-admin when installed.
    const req = eval('require') as NodeRequire;
    const app = req('firebase-admin/app');
    const firestore = req('firebase-admin/firestore');
    return {
      app,
      firestore,
    };
  } catch {
    return null;
  }
}

export function getFirebaseAdminContext(): FirebaseAdminContext {
  const serviceAccount = parseServiceAccount();
  const projectId =
    (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? '').trim() || (serviceAccount?.project_id ?? '').trim();
  const sdk = loadFirebaseAdminSdk();
  return {
    projectId,
    hasServiceAccount: Boolean(serviceAccount?.client_email && serviceAccount?.private_key),
    hasAdminSdk: Boolean(sdk),
  };
}

export function getFirebaseAdminFirestore() {
  const serviceAccount = parseServiceAccount();
  const projectId =
    (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? '').trim() || (serviceAccount?.project_id ?? '').trim();
  if (!serviceAccount || !projectId) {
    return null;
  }

  const sdk = loadFirebaseAdminSdk();
  if (!sdk) {
    return null;
  }

  const { app, firestore } = sdk;
  if (!app.getApps().length) {
    app.initializeApp({
      credential: app.cert({
        projectId,
        clientEmail: serviceAccount.client_email ?? '',
        privateKey: serviceAccount.private_key ?? '',
      }),
    });
  }
  return firestore.getFirestore();
}
