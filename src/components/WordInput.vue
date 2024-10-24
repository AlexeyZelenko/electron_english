<template>
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-semibold">Add New Word</h2>
                <button
                        @click="$emit('close')"
                        class="text-gray-500 hover:text-gray-700"
                >
                    ✕
                </button>
            </div>

            <form @submit.prevent="addWord" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700">Category</label>
                    <input
                            v-model="newWord.category"
                            type="text"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            placeholder="General"
                    />
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700">English Word</label>
                    <input
                            v-model="newWord.english"
                            type="text"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                            placeholder="Enter word in English"
                    />
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700">Ukrainian Translation</label>
                    <input
                            v-model="newWord.ukrainian"
                            type="text"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                            placeholder="Enter translation"
                    />
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700">English Sentence</label>
                    <textarea
                            v-model="newWord.sentence_english"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            rows="2"
                            placeholder="Example sentence in English"
                    ></textarea>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700">Ukrainian Sentence</label>
                    <textarea
                            v-model="newWord.sentence_ukrainian"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            rows="2"
                            placeholder="Example sentence translation"
                    ></textarea>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700">Collection</label>
                    <input
                            v-model="newWord.collection"
                            type="text"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Default"
                    />
                </div>

                <button
                        type="submit"
                        class="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                        :disabled="isLoading"
                >
                    {{ isLoading ? 'Adding...' : 'Add Word' }}
                </button>

                <p v-if="error" class="text-red-500 text-sm mt-2">{{ error }}</p>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import {useWordStore} from '../stores/wordStore';
import type {Word} from '../types';

const emit = defineEmits(['close', 'word-added']);
const wordStore = useWordStore();
const isLoading = ref(false);
const error = ref('');

const newWord = ref<Partial<Word>>({
    category: 'General',
    english: '',
    ukrainian: '',
    sentence_english: '',
    sentence_ukrainian: '',
    collection: 'Default'
});

const addWord = async () => {
    isLoading.value = true;
    error.value = '';

    try {
        await wordStore.addWord(newWord.value);
        emit('word-added');
    } catch (err) {
        error.value = err instanceof Error ? err.message : 'Failed to add word';
    } finally {
        isLoading.value = false;
    }
};
</script>