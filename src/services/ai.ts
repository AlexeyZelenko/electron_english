import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
});

export async function generateTranscription(word: string): Promise<string> {
    try {
        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a helpful English teacher. Provide the IPA transcription for the given word."
                },
                {
                    role: "user",
                    content: `Provide only the IPA transcription for the word "${word}". Response should contain only the transcription.`
                }
            ],
            model: "gpt-3.5-turbo",
        });

        return completion.choices[0].message.content || '';
    } catch (error) {
        console.error('Error generating transcription:', error);
        throw new Error('Failed to generate transcription');
    }
}

export async function generateSentence(word: string): Promise<string> {
    try {
        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a helpful English teacher. Generate a natural, simple example sentence using the provided word."
                },
                {
                    role: "user",
                    content: `Generate a simple example sentence using the word "${word}". Respond with just the sentence, nothing else.`
                }
            ],
            model: "gpt-3.5-turbo",
        });

        return completion.choices[0].message.content || '';
    } catch (error) {
        console.error('Error generating sentence:', error);
        throw new Error('Failed to generate example sentence');
    }
}

export async function getWordDetails(word: string): Promise<any> {
    try {
        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a helpful English teacher. Provide detailed information about the given word."
                },
                {
                    role: "user",
                    content: `Provide detailed information about the word "${word}" including part of speech, synonyms, and antonyms. Respond in JSON format.`
                }
            ],
            model: "gpt-3.5-turbo",
        });

        if (!completion.choices || !completion.choices[0] || !completion.choices[0].message || !completion.choices[0].message.content) {
            throw new Error('Ответ от OpenAI пуст или некорректен.');
        }

        let content = completion.choices[0].message.content;

        // Удаляем блоки кода, такие как ```json и ```
        content = content.replace(/```json|```/g, '').trim();

        // Пробуем парсить содержимое как JSON
        try {
            return JSON.parse(content);
        } catch (jsonError) {
            console.error('Ошибка парсинга JSON:', jsonError, content);
            throw new Error('Неверный формат ответа от OpenAI. Ожидается JSON.');
        }

    } catch (error) {
        console.error('Error getting word details:', error);
        throw new Error('Failed to get word details');
    }
}

