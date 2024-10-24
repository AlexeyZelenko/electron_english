export interface Word {
    id: number;
    user_id: string;
    english: string;
    ukrainian: string;
    transcription?: string;
    category?: string;
    collection?: string;
    created_at: string;
    updated_at: string;
}

export interface WordDetails extends Word {
    examples?: string[];
    audioUrl?: string;
    partOfSpeech?: string;
    synonyms?: string[];
    antonyms?: string[];
}

export interface User {
    id: string;
    email: string;
    created_at: string;
}