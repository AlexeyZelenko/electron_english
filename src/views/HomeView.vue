<template>
    <div class="min-h-screen bg-gray-100 p-8">
        <div class="max-w-4xl mx-auto">
            <div class="flex justify-between items-center mb-12">
                <h1 class="text-3xl font-bold">Words Learning App</h1>
                <button
                        @click="showAddWordModal = true"
                        class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
                >
                    Add New Word
                </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <!-- Add New Words -->
                <router-link
                        to="/words"
                        class="block bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition"
                >
                    <h2 class="text-2xl font-semibold mb-4">Word List</h2>
                    <p class="text-gray-600">View, add, and manage your vocabulary list.</p>
                </router-link>

                <!-- Practice -->
                <router-link
                        to="/practice"
                        class="block bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition"
                >
                    <h2 class="text-2xl font-semibold mb-4">Practice</h2>
                    <p class="text-gray-600">Review your words with flashcards.</p>
                </router-link>
            </div>

            <!-- Stats -->
            <div class="mt-12 bg-white rounded-xl shadow-lg p-8">
                <h2 class="text-2xl font-semibold mb-6">Your Progress</h2>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-6">
                    <div>
                        <p class="text-3xl font-bold text-blue-500">{{ wordStore.words.length }}</p>
                        <p class="text-gray-600">Total Words</p>
                    </div>
                    <div>
                        <p class="text-3xl font-bold text-green-500">{{ uniqueCategories.length }}</p>
                        <p class="text-gray-600">Categories</p>
                    </div>
                    <div>
                        <p class="text-3xl font-bold text-purple-500">{{ uniqueCollections.length }}</p>
                        <p class="text-gray-600">Collections</p>
                    </div>
                </div>
            </div>

            <FeatureBlocks />
        </div>

        <!-- Add Word Modal -->
        <div v-if="showAddWordModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <WordInput
                    @close="showAddWordModal = false"
                    @word-added="handleWordAdded"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import {computed, onMounted, ref} from 'vue';
import {useWordStore} from '../stores/wordStore';
import WordInput from '../components/WordInput.vue';
import FeatureBlocks from '../components/FeatureBlocks.vue';

const wordStore = useWordStore();
const showAddWordModal = ref(false);

onMounted(() => {
    wordStore.fetchWords();
});

const uniqueCategories = computed(() => {
    const categories = new Set(wordStore.words.map(word => word.category || 'All'));
    return Array.from(categories);
});

const uniqueCollections = computed(() => {
    const collections = new Set(wordStore.words.map(word => word.collection || 'All'));
    return Array.from(collections);
});

const handleWordAdded = () => {
    showAddWordModal.value = false;
    wordStore.fetchWords();
};
</script>