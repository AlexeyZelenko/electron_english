<template>
    <div class="min-h-screen bg-gray-100 p-8">
        <div class="max-w-6xl mx-auto">
            <div class="flex justify-between items-center mb-8">
                <h1 class="text-2xl font-bold">My Words</h1>
                <div class="flex gap-4">
                    <input
                            v-model="search"
                            type="text"
                            placeholder="Search words..."
                            class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
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
                    <button
                            @click="showAddWordModal = true"
                            class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
                    >
                        Add Word
                    </button>
                </div>
            </div>

            <!-- Table -->
            <div class="bg-white rounded-lg shadow overflow-hidden">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                    <tr>
                        <th
                                v-for="header in headers"
                                :key="header.key"
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                @click="sortBy(header.key)"
                        >
                            {{ header.label }}
                            <span v-if="sortKey === header.key" class="ml-1">
                  {{ sortOrder === 'asc' ? '↑' : '↓' }}
                </span>
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="word in sortedAndFilteredWords" :key="word.id">
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex items-center">
                                <div class="text-sm font-medium text-gray-900">{{ word.english }}</div>
                                <span v-if="word.transcription" class="ml-2 text-sm text-gray-500">
                    [{{ word.transcription }}]
                  </span>
                                <!--                                <button-->
                                <!--                                        @click="playAudio(word.english)"-->
                                <!--                                        class="ml-2 text-blue-500 hover:text-blue-600"-->
                                <!--                                >-->
                                <!--                                    🔊-->
                                <!--                                </button>-->
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {{ word.ukrainian }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {{ word.category || 'General' }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {{ word.collection || 'Default' }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div class="flex gap-2">
                                <router-link
                                        :to="`/words/${word.id}`"
                                        class="text-blue-600 hover:text-blue-900 mx-2"
                                >
                                    Details
                                </router-link>
                                <button
                                        @click="deleteWord(word.id)"
                                        class="text-red-600 hover:text-red-900"
                                >
                                    Delete
                                </button>
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Add Word Modal -->
        <WordInputModal
                v-if="showAddWordModal"
                @close="showAddWordModal = false"
                @word-added="handleWordAdded"
        />
    </div>
</template>

<script setup lang="ts">
import {computed, onMounted, ref} from 'vue';
import {useWordStore} from '../stores/wordStore';
import WordInputModal from '../components/WordInputModal.vue';

const wordStore = useWordStore();
const search = ref('');
const selectedCategory = ref('');
const selectedCollection = ref('');
const showAddWordModal = ref(false);
const sortKey = ref('english');
const sortOrder = ref<'asc' | 'desc'>('asc');

const headers = [
    {key: 'english', label: 'English'},
    {key: 'ukrainian', label: 'Ukrainian'},
    {key: 'category', label: 'Category'},
    {key: 'collection', label: 'Collection'}
];

onMounted(() => {
    wordStore.fetchWords();
});

const categories = computed(() => {
    const uniqueCategories = new Set(wordStore.words.map(word => word.category || 'General'));
    return Array.from(uniqueCategories);
});

const collections = computed(() => {
    const uniqueCollections = new Set(wordStore.words.map(word => word.collection || 'Default'));
    return Array.from(uniqueCollections);
});

const filteredWords = computed(() => {
    return wordStore.words.filter(word => {
        const matchesSearch = search.value === '' ||
                word.english.toLowerCase().includes(search.value.toLowerCase()) ||
                word.ukrainian.toLowerCase().includes(search.value.toLowerCase());

        const matchesCategory = selectedCategory.value === '' ||
                (word.category || 'General') === selectedCategory.value;

        const matchesCollection = selectedCollection.value === '' ||
                (word.collection || 'Default') === selectedCollection.value;

        return matchesSearch && matchesCategory && matchesCollection;
    });
});

const sortedAndFilteredWords = computed(() => {
    return [...filteredWords.value].sort((a, b) => {
        const aValue = (a[sortKey.value as keyof typeof a] || '').toString().toLowerCase();
        const bValue = (b[sortKey.value as keyof typeof b] || '').toString().toLowerCase();

        if (sortOrder.value === 'asc') {
            return aValue.localeCompare(bValue);
        } else {
            return bValue.localeCompare(aValue);
        }
    });
});

const sortBy = (key: string) => {
    if (sortKey.value === key) {
        sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
    } else {
        sortKey.value = key;
        sortOrder.value = 'asc';
    }
};

const deleteWord = async (id: number) => {
    if (confirm('Are you sure you want to delete this word?')) {
        await wordStore.deleteWord(id);
    }
};

const handleWordAdded = () => {
    showAddWordModal.value = false;
    wordStore.fetchWords();
};

const playAudio = (word) => {
    try {
        // Ensure we are playing audio correctly in the renderer process
        const utterance = new SpeechSynthesisUtterance(word);
        utterance.lang = 'en-US';
        window.speechSynthesis.speak(utterance);
        console.log('Playing audio for:', word);
    } catch (error) {
        console.error('Error while trying to play audio:', error);
    }
};

</script>