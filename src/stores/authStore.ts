import {defineStore} from 'pinia';
import {ref} from 'vue';
import {supabase} from '../lib/supabase';
import type {User} from '../types';
import { useToast } from 'vue-toastification';

export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null>(null);
    const loading = ref(false);
    const error = ref<string | null>(null);
    const toast= useToast();

    const initialize = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        user.value = session?.user ?? null;

        supabase.auth.onAuthStateChange((_event, session) => {
            user.value = session?.user ?? null;
        });
    };

    const signIn = async (email: string, password: string) => {
        try {
            loading.value = true;
            const { error: err } = await supabase.auth.signInWithPassword({
                email,
                password
            });
            if (err) throw err;

            toast.success('Successful sign in!', {
                timeout: 8000,
            });
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to sign in';
            throw error.value;
        } finally {
            loading.value = false;
        }
    };

    const signUp = async (email: string, password: string) => {
        try {
            loading.value = true;
            const { error: err } = await supabase.auth.signUp({
                email,
                password
            });
            if (err) throw err;

            toast.success('Registration successful! Please check your email to confirm your account.', {
                timeout: 8000,
            });
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to sign up';
            throw error.value;
        } finally {
            loading.value = false;
        }
    };

    const signOut = async () => {
        try {
            loading.value = true;
            const { error: err } = await supabase.auth.signOut();
            if (err) throw err;

            toast.success('Successful sign out!', {
                timeout: 8000,
            });
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to sign out';
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
        signIn,
        signUp,
        signOut
    };
});