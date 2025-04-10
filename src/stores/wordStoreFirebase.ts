import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Word } from '../types/firebase';
// import type { Word } from '../types';
import { db } from '../lib/firebase'; // Предполагаем, что настройка Firebase выполнена в этом файле
import {
    collection,
    query,
    where,
    orderBy,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    serverTimestamp,
    Timestamp
} from 'firebase/firestore';
// import { useAuthStore } from './authStore';
import { useAuthStore } from './authStoreFirebase';
import { generateTranscription } from '../services/ai';

export const useWordStore = defineStore('words', () => {
    const authStore = useAuthStore();
    const words = ref<Word[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);

    const fetchWords = async () => {
        console.log('Fetching words...');
        
        if (!authStore.user?.uid) return;
        console.log('User ID:', authStore.user.uid);

        try {
            loading.value = true;

            const wordsCollection = collection(db, 'words');
            const wordQuery = query(
                wordsCollection,
                where('user_id', '==', String(authStore.user.uid))                
            );            

            const querySnapshot = await getDocs(wordQuery);
           
            words.value = querySnapshot.docs.map(doc => {
                const data = doc.data();
                // Преобразуем Timestamp обратно в строку ISO для совместимости
                return {
                    id: doc.id,
                    ...data,
                    created_at: data.created_at?.toDate().toISOString(),
                    updated_at: data.updated_at?.toDate().toISOString()
                } as Word;
            });
            console.log('Fetched words:', words.value);
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

            const wordsCollection = collection(db, 'words');
            await addDoc(wordsCollection, {
                ...word,
                user_id: authStore.user.uid,
                transcription,
                category: word.category || 'All',
                collection: word.collection || 'All',
                created_at: serverTimestamp(),
                updated_at: serverTimestamp()
            });

            await fetchWords();
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to add word';
            throw error.value;
        } finally {
            loading.value = false;
        }
    };

    const updateWord = async (id: string, updates: Partial<Word>) => {
        if (!authStore.user) return;

        try {
            loading.value = true;

            const wordDoc = doc(db, 'words', id);
            await updateDoc(wordDoc, {
                ...updates,
                updated_at: serverTimestamp()
            });

            await fetchWords();
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to update word';
            throw error.value;
        } finally {
            loading.value = false;
        }
    };

    const deleteWord = async (id: string) => {
        if (!authStore.user) return;

        try {
            loading.value = true;

            const wordDoc = doc(db, 'words', id);
            await deleteDoc(wordDoc);

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