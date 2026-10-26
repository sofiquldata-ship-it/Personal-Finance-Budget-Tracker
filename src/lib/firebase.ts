import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDocFromServer,
  collection,
  onSnapshot,
  setDoc,
  deleteDoc,
  query,
  orderBy,
  Firestore,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { Transaction, MonthBudget } from '../types/finance';

// Error Operation Enum mandated by Firebase integration rules
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const currentAuth = getAuth();
  const user = currentAuth.currentUser;

  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: user?.uid,
      email: user?.email,
      emailVerified: user?.emailVerified,
      isAnonymous: user?.isAnonymous,
      tenantId: user?.tenantId,
      providerInfo:
        user?.providerData?.map((p) => ({
          providerId: p.providerId,
          email: p.email,
        })) || [],
    },
    operationType,
    path,
  };

  console.error('Firestore Error:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Fallback configuration supporting both firebase-applet-config.json and Vercel environment variables
const config = {
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || firebaseConfig.projectId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || firebaseConfig.appId,
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || firebaseConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || firebaseConfig.authDomain,
  firestoreDatabaseId:
    import.meta.env.VITE_FIREBASE_DATABASE_ID || firebaseConfig.firestoreDatabaseId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || firebaseConfig.storageBucket,
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseConfig.messagingSenderId,
};

const app = getApps().length > 0 ? getApp() : initializeApp(config);
export const auth = getAuth(app);
export const db: Firestore = getFirestore(app, config.firestoreDatabaseId);

// Test connection on boot as mandated by skill
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, '_health_check', 'ping'));
    return true;
  } catch (error: any) {
    // If the server responded with permission-denied or document not found, Firestore is reachable and connected
    if (error?.code === 'permission-denied' || error?.code === 'not-found') {
      return true;
    }
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is running in offline mode.');
      return false;
    }
    console.warn('Firebase connection check response:', error);
    return false;
  }
}

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export async function loginWithGoogle(): Promise<User> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (err) {
    console.error('Google Sign-In failed:', err);
    throw err;
  }
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

// Real-time Firestore Sync Listeners
export function subscribeToUserTransactions(
  userId: string,
  onUpdate: (txs: Transaction[]) => void
): () => void {
  const collectionPath = `users/${userId}/transactions`;
  const q = query(collection(db, collectionPath), orderBy('date', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const txs: Transaction[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        txs.push({
          id: docSnap.id,
          date: data.date,
          type: data.type,
          category: data.category,
          amount: Number(data.amount) || 0,
          paymentMethod: data.paymentMethod || 'Cash',
          isRecurring: Boolean(data.isRecurring),
          notes: data.notes || '',
          createdAt: data.createdAt || new Date().toISOString(),
          updatedAt: data.updatedAt || new Date().toISOString(),
        });
      });
      onUpdate(txs);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, collectionPath);
    }
  );
}

export function subscribeToUserBudgets(
  userId: string,
  onUpdate: (budgets: Record<string, MonthBudget>) => void
): () => void {
  const collectionPath = `users/${userId}/budgets`;
  return onSnapshot(
    collection(db, collectionPath),
    (snapshot) => {
      const budgetMap: Record<string, MonthBudget> = {};
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        budgetMap[docSnap.id] = {
          monthYear: docSnap.id,
          overallTarget: Number(data.overallTarget) || 0,
          categoryBudgets: data.categoryBudgets || {},
        };
      });
      onUpdate(budgetMap);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, collectionPath);
    }
  );
}

export async function saveTransactionToFirestore(userId: string, tx: Transaction): Promise<void> {
  const docPath = `users/${userId}/transactions/${tx.id}`;
  try {
    await setDoc(doc(db, 'users', userId, 'transactions', tx.id), {
      ...tx,
      userId,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, docPath);
  }
}

export async function deleteTransactionFromFirestore(userId: string, txId: string): Promise<void> {
  const docPath = `users/${userId}/transactions/${txId}`;
  try {
    await deleteDoc(doc(db, 'users', userId, 'transactions', txId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, docPath);
  }
}

export async function saveBudgetToFirestore(userId: string, budget: MonthBudget): Promise<void> {
  const docPath = `users/${userId}/budgets/${budget.monthYear}`;
  try {
    await setDoc(doc(db, 'users', userId, 'budgets', budget.monthYear), {
      ...budget,
      userId,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, docPath);
  }
}
