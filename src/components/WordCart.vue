<template>
    <div class="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-2xl font-bold text-gray-800">{{ word.english }}</h2>
            <span class="text-lg text-gray-600">{{ word.ukrainian }}</span>
        </div>

        <div class="space-y-4">
            <div v-if="word.sentence_english" class="text-gray-700">
                <p class="font-medium">Example:</p>
                <p>{{ word.sentence_english }}</p>
                <p class="text-gray-600">{{ word.sentence_ukrainian }}</p>
            </div>

            <div class="space-y-2">
                <button
                        @click="generateExample"
                        class="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                        :disabled="isGenerating"
                >
                    {{ isGenerating ? 'Generating...' : 'Generate Example' }}
                </button>

                <button
                        v-if="generatedExample"
                        @click="translateExample"
                        class="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                        :disabled="isTranslating"
                >
                    {{ isTranslating ? 'Translating...' : 'Translate Example' }}
                </button>
            </div>

            <div v-if="error" class="p-4 bg-red-50 text-red-600 rounded">
                {{ error }}
            </div>

            <div v-if="generatedExample" class="mt-4 p-4 bg-gray-50 rounded">
                <p class="font-medium">Generated Example:</p>
                <p>{{ generatedExample }}</p>
                <p v-if="translatedExample" class="mt-2 text-gray-600">
                    {{ translatedExample }}
                </p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import type {Word} from '../types';
import {generateSentence, translateText} from '../services/ai';

const props = defineProps<{
    word: Word;
}>();

const generatedExample = ref('');
const translatedExample = ref('');
const error = ref('');
const isGenerating = ref(false);
const isTranslating = ref(false);

const generateExample = async () => {
    error.value = '';
    isGenerating.value = true;
    try {
        generatedExample.value = await generateSentence(props.word.english);
        translatedExample.value = '';
    } catch (err) {
        error.value = err instanceof Error ? err.message : 'Failed to generate example';
    } finally {
        isGenerating.value = false;
    }
};

const translateExample = async () => {
    if (!generatedExample.value) return;

    error.value = '';
    isTranslating.value = true;
    try {
        translatedExample.value = await translateText(generatedExample.value, 'UK');
    } catch (err) {
        error.value = err instanceof Error ? err.message : 'Failed to translate example';
    } finally {
        isTranslating.value = false;
    }
};
</script>