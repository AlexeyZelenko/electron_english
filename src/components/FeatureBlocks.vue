<template>
    <div class="py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <template v-for="feature in features" :key="feature.id">
                    <div
                            v-lazy="{ threshold: 0.5 }"
                            class="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105"
                    >
                        <div class="aspect-w-16 aspect-h-9">
                            <img
                                    :src="feature.image"
                                    :alt="feature.title"
                                    class="w-full h-full object-cover"
                                    loading="lazy"
                            />
                        </div>
                        <div class="p-6">
                            <h3 class="text-xl font-bold text-gray-900 mb-2">{{ feature.title }}</h3>
                            <p class="text-sm text-gray-500 mb-4">{{ feature.subtitle }}</p>
                            <p class="text-gray-700">{{ feature.text }}</p>
                        </div>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';

const features = ref([
    {
        id: 1,
        title: "Personalized Vocabulary Building",
        subtitle: "Create your custom word collections",
        text: "Build your vocabulary efficiently by creating personalized word lists. Add translations, example sentences, and organize words into categories that matter to you.",
        image: "/src/assets/images/placeholders/vocabulary.webp"
    },
    {
        id: 2,
        title: "Interactive Practice Sessions",
        subtitle: "Learn through engagement",
        text: "Practice your vocabulary with interactive flashcards. Test your knowledge in both English and Ukrainian, with audio pronunciation support for better learning.",
        image: "/src/assets/images/placeholders/practice.webp"
    },
    {
        id: 3,
        title: "AI-Powered Examples",
        subtitle: "Context-rich learning",
        text: "Get AI-generated example sentences for each word, helping you understand proper usage in real-world contexts. Includes automatic translations for better comprehension.",
        image: "/src/assets/images/placeholders/ai-examples.webp"
    },
    {
        id: 4,
        title: "Progress Tracking",
        subtitle: "Monitor your improvement",
        text: "Track your learning progress with detailed statistics. See your vocabulary growth, practice session results, and identify areas for improvement.",
        image: "/src/assets/images/placeholders/progress.webp"
    },
    {
        id: 5,
        title: "Import/Export Capabilities",
        subtitle: "Flexible data management",
        text: "Easily import existing word lists or export your vocabulary for backup. Supports multiple file formats including JSON, CSV, and Excel.",
        image: "/src/assets/images/placeholders/import-export.webp"
    },
    {
        id: 6,
        title: "Audio Pronunciation",
        subtitle: "Perfect your pronunciation",
        text: "Listen to native pronunciations of English words. Practice speaking with confidence using our integrated text-to-speech feature.",
        image: "/src/assets/images/placeholders/audio.webp"
    }
]);
</script>

<style scoped>
.aspect-w-16 {
    position: relative;
    padding-bottom: 56.25%;
}

.aspect-w-16 > img {
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
}
</style>