<template>
    <div class="min-h-screen bg-gray-100">
        <!-- Navigation -->
        <nav class="bg-white shadow">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between h-16">
                    <div class="flex">
                        <!-- Logo -->
                        <div class="flex-shrink-0 flex items-center">
                            <router-link to="/" class="text-xl font-bold text-blue-600">
                                My Dictionary
                            </router-link>
                        </div>

                        <!-- Navigation Links (Only show when authenticated) -->
                        <div v-if="authStore.user" class="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <router-link
                                    to="/"
                                    class="inline-flex items-center px-1 pt-1 text-sm font-medium"
                                    :class="[$route.path === '/' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700']"
                            >
                                Home
                            </router-link>

                            <router-link
                                    to="/words"
                                    class="inline-flex items-center px-1 pt-1 text-sm font-medium"
                                    :class="[$route.path === '/words' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700']"
                            >
                                Words
                            </router-link>

                            <router-link
                                    to="/practice"
                                    class="inline-flex items-center px-1 pt-1 text-sm font-medium"
                                    :class="[$route.path === '/practice' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700']"
                            >
                                Practice
                            </router-link>

                            <router-link
                                    to="/import-export"
                                    class="inline-flex items-center px-1 pt-1 text-sm font-medium"
                                    :class="[$route.path === '/import-export' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700']"
                            >
                                Import/Export
                            </router-link>
                        </div>
                    </div>

                    <!-- User Menu -->
                    <div class="flex items-center">
                        <template v-if="authStore.user">
                            <button
                                    @click="handleSignOut"
                                    class="text-sm text-gray-500 hover:text-gray-700"
                            >
                                Sign Out
                            </button>
                        </template>
                        <template v-else>
                            <router-link
                                    to="/auth"
                                    class="text-sm text-gray-500 hover:text-gray-700"
                            >
                                Sign In
                            </router-link>
                        </template>
                    </div>
                </div>
            </div>
        </nav>

        <!-- Main Content -->
        <main>
            <router-view></router-view>
        </main>
    </div>
</template>

<script setup lang="ts">
import {onMounted} from 'vue';
import {useRouter} from 'vue-router';
// import {useAuthStore} from './stores/authStore';
import {useAuthStore} from './stores/authStoreFirebase';

const router = useRouter();
const authStore = useAuthStore();

onMounted(() => {
    authStore.initialize();
});

const handleSignOut = async () => {
    try {
        await authStore.logout();
        router.push('/auth');
    } catch (error) {
        console.error('Failed to sign out:', error);
    }
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>