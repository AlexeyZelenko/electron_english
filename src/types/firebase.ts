import { Timestamp } from "firebase/firestore";

// Тип для документа Word в Firestore
export interface WordFirestore {
    id?: string;
    user_id: string;
    english: string;
    transcription: string;
    translation?: string;
    category: string;
    collection: string;
    examples?: string[];
    created_at: Timestamp;
    updated_at: Timestamp;
    // Другие поля...
}

// Тип для использования в приложении (со строковыми датами)
export interface Word {
    id: string;
    user_id: string;
    english: string;
    transcription: string;
    translation?: string;
    category: string;
    collection: string;
    examples?: string[];
    created_at: string;
    updated_at: string;
    // Другие поля...
}