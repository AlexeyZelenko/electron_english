<template>
    <div class="min-h-screen bg-gray-100 p-8">
        <div class="max-w-2xl mx-auto">
            <!-- Controls -->
            <div class="mb-8 flex justify-between items-center">
                <div class="space-x-4">
                    <select
                            v-model="selectedCategory"
                            class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Categories</option>
                        <option v-for="category in categories" :key="category" :value="category">
                            {{ category }}
                        </option>
                    </select>

                    <select
                            v-model="selectedCollection"
                            class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Collections</option>
                        <option v-for="collection in collections" :key="collection" :value="collection">
                            {{ collection }}
                        </option>
                    </select>
                </div>

                <div class="text-sm text-gray-600">
                    {{ currentIndex + 1 }} / {{ filteredWords.length }}
                </div>
            </div>

            <!-- Flashcard -->
            <div v-if="currentWord" class="flashcard-container">
                <div
                        class="flashcard"
                        :class="{ 'is-flipped': isFlipped }"
                        @click="isFlipped = !isFlipped"
                >
                    <!-- Front -->
                    <div class="flashcard-face flashcard-front">
                        <div class="h-full flex flex-col items-center justify-center">
                            <h2 class="text-4xl font-bold text-gray-900 mb-4">
                                {{ currentWord.english }}
                            </h2>
                            <p v-if="currentWord.transcription" class="text-xl text-gray-500">
                                [{{ currentWord.transcription }}]
                            </p>
                            <button
                                    @click.stop="playAudio"
                                    class="mt-4 text-blue-500 hover:text-blue-600"
                            >
                                🔊 Listen
                            </button>
                        </div>
                    </div>

                    <!-- Back -->
                    <div class="flashcard-face flashcard-back">
                        <div class="h-full flex flex-col items-center justify-center">
                            <h2 class="text-4xl font-bold text-gray-900 mb-4">
                                {{ currentWord.ukrainian }}
                            </h2>
                            <div v-if="currentWord.sentence_english" class="text-center mt-4">
                                <p class="text-gray-700">{{ currentWord.sentence_english }}</p>
                                <p class="text-gray-600 mt-2">{{ currentWord.sentence_ukrainian }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Navigation -->
            <div class="mt-8 flex justify-center space-x-4">
                <button
                        @click="previousWord"
                        class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                        :disabled="currentIndex === 0"
                >
                    Previous
                </button>
                <button
                        @click="nextWord"
                        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                        :disabled="currentIndex === filteredWords.length - 1"
                >
                    Next
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {computed, onMounted, ref} from 'vue';
import {useWordStore} from '../stores/wordStore';

const wordStore = useWordStore();
const currentIndex = ref(0);
const isFlipped = ref(false);
const selectedCategory = ref('');
const selectedCollection = ref('');

// Fetch words on mount
onMounted(() => {
    wordStore.fetchWords();
});

// Get unique categories and collections
const categories = computed(() => {
    const uniqueCategories = new Set(wordStore.words.map(word => word.category || 'All'));
    return Array.from(uniqueCategories);
});

const collections = computed(() => {
    const uniqueCollections = new Set(wordStore.words.map(word => word.collection || 'All'));
    return Array.from(uniqueCollections);
});

// Filter words based on selection
const filteredWords = computed(() => {
    return wordStore.words.filter(word => {
        const matchesCategory = !selectedCategory.value || word.category === selectedCategory.value;
        const matchesCollection = !selectedCollection.value || word.collection === selectedCollection.value;
        return matchesCategory && matchesCollection;
    });
});

// Current word
const currentWord = computed(() => {
    return filteredWords.value[currentIndex.value] || null;
});

// Navigation
const nextWord = () => {
    if (currentIndex.value < filteredWords.value.length - 1) {
        currentIndex.value++;
        isFlipped.value = false;
    }
};

const previousWord = () => {
    if (currentIndex.value > 0) {
        currentIndex.value--;
        isFlipped.value = false;
    }
};

// Audio playback using SpeechSynthesis API
const playAudio = () => {
    if (!currentWord.value) return;

    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(currentWord.value.english);
        utterance.lang = 'en-US';
        window.speechSynthesis.speak(utterance);
    } else {
        console.error('SpeechSynthesis is not supported in this browser');
    }
};
</script>

<style scoped>
.flashcard-container {
    perspective: 1000px;
    height: 24rem; /* h-96 equivalent */
}

.flashcard {
    position: relative;
    width: 100%;
    height: 100%;
    cursor: pointer;
    transform-style: preserve-3d;
    transition: transform 0.6s;
}

.flashcard.is-flipped {
    transform: rotateY(180deg);
}

.flashcard-face {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    background: white;
    border-radius: 0.75rem;
    padding: 2rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.flashcard-back {
    transform: rotateY(180deg);
}
</style>
