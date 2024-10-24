<template>
    <div class="min-h-screen bg-gray-100 p-8">
        <div class="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
            <div v-if="loading" class="text-center py-8">Loading...</div>
            <div v-else-if="error" class="text-red-600 p-4 bg-red-50 rounded">{{ error }}</div>
            <div v-else-if="word" class="space-y-6">
                <!-- Header with Edit Toggle -->
                <div class="flex justify-between items-start">
                    <div class="flex-1">
                        <div v-if="!isEditing">
                            <h1 class="text-3xl font-bold text-gray-900">{{ word.english }}</h1>
                            <p class="text-lg text-gray-600 mt-1">{{ word.ukrainian }}</p>
                            <p v-if="word.transcription" class="text-gray-500">[{{ word.transcription }}]</p>
                        </div>
                        <div v-else class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700">English Word</label>
                                <input
                                        v-model="editedWord.english"
                                        type="text"
                                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Ukrainian Translation</label>
                                <input
                                        v-model="editedWord.ukrainian"
                                        type="text"
                                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                />
                            </div>
                        </div>
                    </div>
                    <div class="flex gap-2">
                        <button
                                v-if="!isEditing"
                                @click="startEditing"
                                class="text-blue-500 hover:text-blue-600"
                        >
                            Edit
                        </button>
                        <div v-else class="flex gap-2">
                            <button
                                    @click="saveChanges"
                                    class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                    :disabled="isSaving"
                            >
                                {{ isSaving ? 'Saving...' : 'Save' }}
                            </button>
                            <button
                                    @click="cancelEditing"
                                    class="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Categories -->
                <div class="flex gap-4">
                    <div v-if="!isEditing">
                        <span class="px-3 py-1 bg-gray-100 rounded-full text-sm">
                            Category: {{ word.category || 'All' }}
                        </span>
                        <span class="px-3 py-1 bg-gray-100 rounded-full text-sm ml-2">
                            Collection: {{ word.collection || 'All' }}
                        </span>
                    </div>
                    <div v-else class="w-full space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Category</label>
                            <input
                                    v-model="editedWord.category"
                                    type="text"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="General"
                            />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Collection</label>
                            <input
                                    v-model="editedWord.collection"
                                    type="text"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="Default"
                            />
                        </div>
                    </div>
                </div>

                <!-- Examples -->
                <div class="space-y-4">
                    <h2 class="text-xl font-semibold">Examples</h2>
                    <div v-if="!isEditing && word.sentence_english" class="p-4 bg-gray-50 rounded">
                        <p class="text-gray-900">{{ word.sentence_english }}</p>
                        <p class="text-gray-600 mt-1">{{ word.sentence_ukrainian }}</p>
                    </div>
                    <div v-if="isEditing" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700">English Example</label>
                            <textarea
                                    v-model="editedWord.sentence_english"
                                    rows="2"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            ></textarea>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Ukrainian Example</label>
                            <textarea
                                    v-model="editedWord.sentence_ukrainian"
                                    rows="2"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            ></textarea>
                        </div>
                    </div>

                    <button
                            @click="generateNewExample"
                            class="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                            :disabled="isGenerating || isEditing"
                    >
                        {{ isGenerating ? 'Generating...' : 'Generate New Example' }}
                    </button>
                </div>

                <!-- Additional Information -->
                <div v-if="wordDetails" class="space-y-4">
                    <h2 class="text-xl font-semibold">Additional Information</h2>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <h3 class="font-medium text-gray-700">Part of Speech</h3>
                            <p>{{ wordDetails.partOfSpeech }}</p>
                        </div>
                        <div v-if="wordDetails.synonyms?.length">
                            <h3 class="font-medium text-gray-700">Synonyms</h3>
                            <p>{{ wordDetails.synonyms.join(', ') }}</p>
                        </div>
                        <div v-if="wordDetails.antonyms?.length">
                            <h3 class="font-medium text-gray-700">Antonyms</h3>
                            <p>{{ wordDetails.antonyms.join(', ') }}</p>
                        </div>
                    </div>
                </div>

                <!-- Audio Controls -->
<!--                <div class="flex justify-center">-->
<!--                    <button-->
<!--                            @click="playAudio"-->
<!--                            class="text-blue-500 hover:text-blue-600 text-lg"-->
<!--                            :disabled="isEditing"-->
<!--                    >-->
<!--                        🔊 Listen to Pronunciation-->
<!--                    </button>-->
<!--                </div>-->
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {useToast} from 'vue-toastification';
import {useWordStore} from '../stores/wordStore';
import {generateSentence, getWordDetails} from '../services/ai';
import type {Word, WordDetails} from '../types';

const route = useRoute();
const router = useRouter();
const wordStore = useWordStore();
const toast = useToast(); // Инициализируем уведомления

const word = ref<Word | null>(null);
const editedWord = ref<Partial<Word>>({});
const wordDetails = ref<WordDetails | null>(null);
const loading = ref(true);
const error = ref('');
const isGenerating = ref(false);
const isEditing = ref(false);
const isSaving = ref(false);

// Загружаем данные слова
const loadWordDetails = async () => {
    try {
        const id = Number(route.params.id);
        const foundWord = wordStore.words.find(w => w.id === id);
        if (!foundWord) {
            throw new Error('Word not found');
        }
        word.value = foundWord;
        wordDetails.value = await getWordDetails(foundWord.english);
    } catch (err) {
        error.value = err instanceof Error ? err.message : 'Failed to load word details';
        toast.error(error.value); // Показываем ошибку
    } finally {
        loading.value = false;
    }
};

onMounted(async () => {
    await loadWordDetails();
});

// Воспроизведение аудио
const playAudio = () => {
    if (!word.value) return;
    const utterance = new SpeechSynthesisUtterance(word.value.english);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
};

// Генерация нового примера предложения
const generateNewExample = async () => {
    if (!word.value) return;

    isGenerating.value = true;
    try {
        const newExample = await generateSentence(word.value.english);
        await wordStore.updateWord(word.value.id, {
            sentence_english: newExample,
            sentence_ukrainian: ''
        });
        await loadWordDetails();
        toast.success('New example generated successfully!');
    } catch (err) {
        error.value = err instanceof Error ? err.message : 'Failed to generate example';
        toast.error(error.value);
    } finally {
        isGenerating.value = false;
    }
};

// Начало редактирования
const startEditing = () => {
    if (!word.value) return;
    editedWord.value = { ...word.value };
    isEditing.value = true;
};

// Отмена редактирования
const cancelEditing = () => {
    isEditing.value = false;
    editedWord.value = {};
};

// Сохранение изменений
const saveChanges = async () => {
    if (!word.value || !editedWord.value.english || !editedWord.value.ukrainian) return;

    isSaving.value = true;
    try {
        await wordStore.updateWord(word.value.id, editedWord.value);
        await loadWordDetails();
        isEditing.value = false;
        editedWord.value = {};
        toast.success('Changes saved successfully!');
    } catch (err) {
        error.value = err instanceof Error ? err.message : 'Failed to save changes';
        toast.error(error.value);
    } finally {
        isSaving.value = false;
    }
};
</script>
