import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, signInWithPhoneNumber } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "demo-key",
  authDomain: "localhost",
  projectId: "demo-no-project",
  storageBucket: "demo-bucket",
  messagingSenderId: "demo-sender",
  appId: "demo-app"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
connectAuthEmulator(auth, 'http://127.0.0.1:9099');

// Функция для входа (тестовая)
export const loginWithPhone = async (phoneNumber, verificationCode) => {
  try {
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber);
    // В эмуляторе код всегда 123456
    const result = await confirmationResult.confirm(verificationCode);
    return { success: true, user: result.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};