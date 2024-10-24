import {defineStore} from 'pinia';
import {ref} from 'vue';
import type {Word} from '../types';
import {supabase} from '../lib/supabase';
import {useAuthStore} from './authStore';
import {generateTranscription} from '../services/ai';

export const useWordStore = defineStore('words', () => {
    const authStore = useAuthStore();
    const words = ref<Word[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);

    const fetchWords = async () => {
        if (!authStore.user) return;

        try {
            loading.value = true;
            const { data, error: err } = await supabase
                .from('words')
                .select('*')
                .eq('user_id', authStore.user.id)
                .order('created_at', { ascending: false });

            if (err) throw err;
            words.value = data;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to fetch words';
        } finally {
            loading.value = false;
        }
    };

    const addWord = async (word: Partial<Word>) => {
        if (!authStore.user) return;

        try {
            loading.value = true;
            const transcription = await generateTranscription(word.english || '');

            const { error: err } = await supabase
                .from('words')
                .insert([{
                    ...word,
                    user_id: authStore.user.id,
                    transcription,
                    category: word.category || 'All',
                    collection: word.collection || 'All',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }]);

            if (err) throw err;
            await fetchWords();
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to add word';
            throw error.value;
        } finally {
            loading.value = false;
        }
    };

    const updateWord = async (id: number, updates: Partial<Word>) => {
        if (!authStore.user) return;

        try {
            loading.value = true;
            const { error: err } = await supabase
                .from('words')
                .update({
                    ...updates,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)
                .eq('user_id', authStore.user.id);

            if (err) throw err;
            await fetchWords();
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to update word';
            throw error.value;
        } finally {
            loading.value = false;
        }
    };

    const deleteWord = async (id: number) => {
        if (!authStore.user) return;

        try {
            loading.value = true;
            const { error: err } = await supabase
                .from('words')
                .delete()
                .eq('id', id)
                .eq('user_id', authStore.user.id);

            if (err) throw err;
            await fetchWords();
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to delete word';
            throw error.value;
        } finally {
            loading.value = false;
        }
    };

    return {
        words,
        loading,
        error,
        fetchWords,
        addWord,
        updateWord,
        deleteWord
    };
});