<template>
    <div class="min-h-screen bg-gray-100 p-8">
        <div class="max-w-4xl mx-auto">
            <h1 class="text-3xl font-bold mb-8">Import/Export Data</h1>

            <!-- Instructions -->
            <div class="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 class="text-xl font-semibold mb-4">File Format Instructions</h2>

                <div class="space-y-4">
                    <div>
                        <h3 class="font-medium text-lg mb-2">Required Columns</h3>
                        <ul class="list-disc list-inside space-y-1 text-gray-600">
                            <li><code>english</code> - English word (required)</li>
                            <li><code>ukrainian</code> - Ukrainian translation (required)</li>
                            <li><code>category</code> - Word category (optional)</li>
                            <li><code>collection</code> - Collection name (optional)</li>
                            <li><code>sentence_english</code> - Example sentence in English (optional)</li>
                            <li><code>sentence_ukrainian</code> - Example sentence in Ukrainian (optional)</li>
                        </ul>
                    </div>

                    <div>
                        <h3 class="font-medium text-lg mb-2">Example Format</h3>
                        <pre class="bg-gray-50 p-4 rounded text-sm overflow-x-auto">
{
  "english": "hello",
  "ukrainian": "привіт",
  "category": "Greetings",
  "collection": "Basic",
  "sentence_english": "Hello, how are you?",
  "sentence_ukrainian": "Привіт, як справи?"
}</pre>
                    </div>

                    <div>
                        <h3 class="font-medium text-lg mb-2">Supported File Types</h3>
                        <ul class="list-disc list-inside space-y-1 text-gray-600">
                            <li>JSON (.json)</li>
                            <li>CSV (.csv)</li>
                            <li>Excel (.xlsx)</li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- Import Section -->
            <div class="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 class="text-xl font-semibold mb-4">Import Words</h2>

                <div class="space-y-4">
                    <input
                            type="file"
                            accept=".json,.csv,.xlsx"
                            @change="handleFileSelect"
                            class="hidden"
                            ref="fileInput"
                    />

                    <div class="flex gap-4">
                        <button
                                @click="$refs.fileInput.click()"
                                class="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
                        >
                            Select File
                        </button>

                        <button
                                v-if="selectedFile"
                                @click="importWords"
                                class="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition"
                                :disabled="isImporting"
                        >
                            {{ isImporting ? 'Importing...' : 'Import Words' }}
                        </button>
                    </div>

                    <div v-if="selectedFile" class="text-sm text-gray-600">
                        Selected file: {{ selectedFile.name }}
                    </div>

                    <div v-if="importPreview.length" class="mt-4">
                        <h3 class="font-medium mb-2">Preview (first 5 entries):</h3>
                        <div class="overflow-x-auto">
                            <table class="min-w-full divide-y divide-gray-200">
                                <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">English</th>
                                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Ukrainian</th>
                                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                                </tr>
                                </thead>
                                <tbody class="bg-white divide-y divide-gray-200">
                                <tr v-for="(word, index) in importPreview.slice(0, 5)" :key="index">
                                    <td class="px-4 py-2">{{ word.english }}</td>
                                    <td class="px-4 py-2">{{ word.ukrainian }}</td>
                                    <td class="px-4 py-2">{{ word.category || '-' }}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Export Section -->
            <div class="bg-white rounded-lg shadow-md p-6">
                <h2 class="text-xl font-semibold mb-4">Export Words</h2>

                <div class="flex gap-4">
                    <button
                            @click="exportWords('json')"
                            class="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
                            :disabled="isExporting"
                    >
                        Export as JSON
                    </button>

                    <button
                            @click="exportWords('csv')"
                            class="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
                            :disabled="isExporting"
                    >
                        Export as CSV
                    </button>

                    <button
                            @click="exportWords('xlsx')"
                            class="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
                            :disabled="isExporting"
                    >
                        Export as Excel
                    </button>
                </div>
            </div>

            <!-- Status Messages -->
            <div class="mt-4">
                <p v-if="error" class="text-red-500">{{ error }}</p>
                <p v-if="success" class="text-green-500">{{ success }}</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import {useToast} from 'vue-toastification';
import {useWordStore} from '../stores/wordStore';
import {utils as xlsxUtils} from 'xlsx'; // Корректный импорт для работы с Excel файлами
import type {Word} from '../types';

const wordStore = useWordStore();
const fileInput = ref<HTMLInputElement | null>(null);
const selectedFile = ref<File | null>(null);
const isImporting = ref(false);
const isExporting = ref(false);
const error = ref('');
const success = ref('');
const importPreview = ref<Partial<Word>[]>([]);
const toast = useToast(); // Инициализация toast для уведомлений

// Обработчик выбора файла
const handleFileSelect = async (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    selectedFile.value = input.files[0];
    error.value = '';
    success.value = '';

    try {
        const words = await parseFile(input.files[0]);
        importPreview.value = words;

        if (!validateWords(words)) {
            throw new Error('Invalid file format');
        }

    } catch (err) {
        error.value = err instanceof Error ? err.message : 'Failed to parse file';
        selectedFile.value = null;
        if (fileInput.value) fileInput.value.value = '';
    }
};

// Валидация структуры данных
const validateWords = (words: any[]): words is Partial<Word>[] => {
    return words.every(word =>
            typeof word.english === 'string' &&
            typeof word.ukrainian === 'string' &&
            (!word.category || typeof word.category === 'string') &&
            (!word.collection || typeof word.collection === 'string')
    );
};

// Импорт слов
const importWords = async () => {
    if (!selectedFile.value || !importPreview.value.length) return;

    isImporting.value = true;
    error.value = '';
    success.value = '';

    try {
        const words = importPreview.value;

        for (const word of words) {
            await wordStore.addWord(word);
        }

        success.value = `Successfully imported ${words.length} words`;
        selectedFile.value = null;
        importPreview.value = [];
        if (fileInput.value) fileInput.value.value = '';
        toast.success(success.value); // Уведомление об успешном импорте
    } catch (err) {
        error.value = err instanceof Error ? err.message : 'Failed to import words';
        toast.error(error.value); // Уведомление об ошибке импорта
    } finally {
        isImporting.value = false;
    }
};

// Экспорт слов
const exportWords = async (format: 'json' | 'csv' | 'xlsx') => {
    isExporting.value = true;
    error.value = '';
    success.value = '';

    try {
        const words = wordStore.words;

        // Проверяем, что есть хотя бы 5 слов для экспорта
        if (words.length < 5) {
            throw new Error('The table must contain at least 5 words for export.');
        }

        let content: string;
        switch (format) {
            case 'json':
                content = JSON.stringify(words, null, 2);
                break;

            case 'csv':
                const headers = ['english', 'ukrainian', 'category', 'collection', 'sentence_english', 'sentence_ukrainian'];
                content = [
                    headers.join(','),
                    ...words.map(word => headers.map(header =>
                            JSON.stringify((word as any)[header] || '')
                    ).join(','))
                ].join('\n');
                break;

            case 'xlsx': {
                const wb = xlsxUtils.book_new();
                const ws = xlsxUtils.json_to_sheet(words);
                xlsxUtils.book_append_sheet(wb, ws, 'Words');
                content = xlsxUtils.write(wb, { bookType: 'xlsx', type: 'binary' });
                break;
            }
        }

        // Вызов основного процесса для сохранения файла
        // const successSave = await ipcRenderer.invoke('export-file', { content, extension: format });
        const successSave = await window.api.saveFile(content, format);

        // Если файл успешно сохранен
        if (successSave) {
            success.value = 'Export completed successfully';
            toast.success(success.value); // Показать toast уведомление
        } else {
            throw new Error('File save was canceled');
        }

    } catch (err) {
        error.value = err instanceof Error ? err.message : 'Failed to export words';
        toast.error(error.value); // Показать toast уведомление об ошибке
    } finally {
        isExporting.value = false;
    }
};
</script>
