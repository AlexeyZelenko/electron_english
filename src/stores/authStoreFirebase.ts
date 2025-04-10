import { defineStore } from 'pinia';
import { ref } from 'vue';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    type User
} from 'firebase/auth';
import { auth } from '../lib/firebase';

export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null>(null);
    const loading = ref(false);
    const error = ref<string | null>(null);

    // Инициализировать слушатель состояния аутентификации
    const initialize = () => {
        return new Promise<void>((resolve) => {
            const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
                user.value = currentUser;
                resolve();
                unsubscribe();
            });
        });
    };

    // Регистрация нового пользователя
    const signUp = async (email: string, password: string) => {
        try {
            loading.value = true;
            error.value = null;
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            user.value = userCredential.user;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to register';
            throw error.value;
        } finally {
            loading.value = false;
        }
    };

    // Вход пользователя
    const signIn = async (email: string, password: string) => {
        try {
            loading.value = true;
            error.value = null;
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            user.value = userCredential.user;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to login';
            throw error.value;
        } finally {
            loading.value = false;
        }
    };

    // Выход пользователя
    const logout = async () => {
        try {
            loading.value = true;
            error.value = null;
            await signOut(auth);
            user.value = null;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to logout';
            throw error.value;
        } finally {
            loading.value = false;
        }
    };

    return {
        user,
        loading,
        error,
        initialize,
        signUp,
        signIn,
        logout
    };
});