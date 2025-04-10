import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Конфигурация Firebase
// Эти данные можно скопировать с консоли Firebase (Project settings)
const firebaseConfig = {
    apiKey: "AIzaSyAttUPInsKHxt2qTtXppDkwIzHgaQxadcM",
    authDomain: "electronenglishwords.firebaseapp.com",
    projectId: "electronenglishwords",
    storageBucket: "electronenglishwords.firebasestorage.app",
    messagingSenderId: "532739315385",
    appId: "1:532739315385:web:47c51b603a5d21dc9cad68"
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);

// Экспорт сервисов Firebase для использования в приложении
export const db = getFirestore(app);
export const auth = getAuth(app);