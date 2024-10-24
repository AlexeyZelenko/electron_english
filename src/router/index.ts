import {createRouter, createWebHistory} from 'vue-router';
import {useAuthStore} from '../stores/authStore';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('../views/HomeView.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/auth',
            name: 'auth',
            component: () => import('../views/AuthView.vue'),
            meta: { requiresGuest: true }
        },
        {
            path: '/words',
            name: 'words',
            component: () => import('../views/WordsView.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/words/:id',
            name: 'word-details',
            component: () => import('../views/WordDetailsView.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/practice',
            name: 'practice',
            component: () => import('../views/PracticeView.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/import-export',
            name: 'import-export',
            component: () => import('../views/ImportExportView.vue'),
            meta: { requiresAuth: true }
        }
    ]
});

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();

    if (to.meta.requiresAuth && !authStore.user) {
        next('/auth');
    } else if (to.meta.requiresGuest && authStore.user) {
        next('/');
    } else {
        next();
    }
});

export default router;