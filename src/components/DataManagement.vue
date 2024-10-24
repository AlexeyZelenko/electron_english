<template>
    <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold mb-4">Data Management</h2>

        <!-- Export Section -->
        <div class="mb-6">
            <h3 class="text-lg font-medium mb-2">Export Words</h3>
            <button
                    @click="exportWords"
                    class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                    :disabled="isExporting"
            >
                {{ isExporting ? 'Exporting...' : 'Export to JSON' }}
            </button>
        </div>

        <!-- Import Section -->
        <div>
            <h3 class="text-lg font-medium mb-2">Import Words</h3>
            <div class="flex items-center gap-4">
                <input
                        type="file"
                        accept=".json"
                        @change="handleFileSelect"
                        class="hidden"
                        ref="fileInput"
                />
                <button
                        @click="$refs.fileInput.click()"
                        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                >
                    Select JSON File
                </button>
                <button
                        v-if="selectedFile"
                        @click="importWords"
                        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                        :disabled="isImporting"
                >
                    {{ isImporting ? 'Importing...' : 'Import Words' }}
                </button>
            </div>
            <p v-if="selectedFile" class="mt-2 text-sm text-gray-600">
                Selected file: {{ selectedFile.name }}
            </p>
        </div>

        <!-- Status Messages -->
        <div class="mt-4">
            <p v-if="error" class="text-red-500">{{ error }}</p>
            <p v-if="success" class="text-green-500">{{ success }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import {useWordStore} from '../stores/wordStore';

// Убираем прямой импорт ipcRenderer
// Используем вместо этого window.api

const wordStore = useWordStore();
const fileInput = ref<HTMLInputElement | null>(null);
const selectedFile = ref<File | null>(null);
const isExporting = ref(false);
const isImporting = ref(false);
const error = ref('');
const success = ref('');

const handleFileSelect = (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
        selectedFile.value = input.files[0];
        error.value = '';
        success.value = '';
    }
};

const exportWords = async () => {
    isExporting.value = true;
    error.value = '';
    success.value = '';

    try {
        const words = wordStore.words;
        // Используем window.api для вызова ipcRenderer.invoke
        await window.api.invoke('export-words', words);
        success.value = 'Words exported successfully!';
    } catch (err) {
        error.value = err instanceof Error ? err.message : 'Failed to export words';
    } finally {
        isExporting.value = false;
    }
};

const importWords = async () => {
    if (!selectedFile.value) return;

    isImporting.value = true;
    error.value = '';
    success.value = '';

    try {
        const fileContent = await selectedFile.value.text();
        const words = JSON.parse(fileContent);

        // Validate words structure
        if (!Array.isArray(words)) {
            throw new Error('Invalid file format');
        }

        // Используем window.api для вызова ipcRenderer.invoke
        await window.api.invoke('import-words', words);
        await wordStore.fetchWords();
        success.value = 'Words imported successfully!';
        selectedFile.value = null;
        if (fileInput.value) {
            fileInput.value.value = '';
        }
    } catch (err) {
        error.value = err instanceof Error ? err.message : 'Failed to import words';
    } finally {
        isImporting.value = false;
    }
};
</script>
