<template>
    <div class="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div class="max-w-md w-full">
            <!-- Auth Form -->
            <div class="bg-white rounded-lg shadow-md p-8">
                <h2 class="text-2xl font-bold text-center mb-8">
                    {{ isLogin ? 'Sign In' : 'Create Account' }}
                </h2>

                <form @submit.prevent="handleSubmit" class="space-y-6">
                    <!-- Email -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Email</label>
                        <input
                                v-model="email"
                                type="email"
                                required
                                class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="your@email.com"
                        />
                    </div>

                    <!-- Password -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Password</label>
                        <input
                                v-model="password"
                                type="password"
                                required
                                class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="••••••••"
                                minlength="6"
                        />
                    </div>

                    <!-- Error Message -->
                    <div v-if="error" class="p-4 bg-red-50 text-red-600 rounded text-sm">
                        {{ error }}
                    </div>

                    <!-- Submit Button -->
                    <button
                            type="submit"
                            class="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                            :disabled="loading"
                    >
                        <span v-if="loading">Please wait...</span>
                        <span v-else>{{ isLogin ? 'Sign In' : 'Create Account' }}</span>
                    </button>

                    <!-- Toggle Login/Register -->
                    <div class="text-center text-sm">
                        <button
                                type="button"
                                @click="isLogin = !isLogin"
                                class="text-blue-500 hover:text-blue-700"
                        >
                            {{ isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import {useRouter} from 'vue-router';
import {useAuthStore} from '../stores/authStore';

const router = useRouter();
const authStore = useAuthStore();

const isLogin = ref(true);
const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

const handleSubmit = async () => {
    error.value = '';
    loading.value = true;

    try {
        if (isLogin.value) {
            await authStore.signIn(email.value, password.value);
        } else {
            await authStore.signUp(email.value, password.value);
        }
        router.push('/');
    } catch (err) {
        error.value = err instanceof Error ? err.message : 'Authentication failed';
    } finally {
        loading.value = false;
    }
};
</script>