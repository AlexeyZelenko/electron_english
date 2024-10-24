# English Learning App

A modern desktop application for learning English with Ukrainian translations, powered by AI and built with Vue 3 + Electron.

![English Learning App](public/images/placeholders/vocabulary.webp)

## Features

- 🔤 **Personalized Vocabulary Building**
  - Create custom word collections
  - Add translations and example sentences
  - Organize words by categories

- 🎯 **Interactive Practice**
  - Flashcard-based learning
  - Audio pronunciation
  - Progress tracking

- 🤖 **AI-Powered Features**
  - Automatic example sentence generation
  - Word transcriptions
  - Smart translations

- 📊 **Progress Tracking**
  - Track vocabulary growth
  - Monitor practice results
  - Identify improvement areas

- 💾 **Data Management**
  - Import existing word lists
  - Export vocabulary for backup
  - Support for JSON, CSV, and Excel formats

## Tech Stack

### Frontend
- Vue.js 3 with Composition API
- TypeScript
- Tailwind CSS
- Vite

### Desktop Integration
- Electron
- @electron/remote
- say.js (text-to-speech)

### Backend & Database
- Supabase
  - Authentication
  - PostgreSQL database
  - Real-time subscriptions

### AI & Translation
- OpenAI API
  - Example sentence generation
  - Word details and transcriptions
- DeepL API for translations

### Data Management
- XLSX for Excel handling
- csvtojson for CSV parsing
- Native JSON support

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/english-learning-app.git
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with your API keys:
```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_KEY=your-supabase-anon-key
VITE_OPENAI_API_KEY=your-openai-api-key
VITE_DEEPL_API_KEY=your-deepl-api-key
```

4. Start the development server:
```bash
npm run dev
```

5. For desktop app development:
```bash
npm run electron:dev
```

## Building

### Web Version
```bash
npm run build
```

### Desktop App
```bash
npm run electron:build
```

## Features in Detail

### Vocabulary Management
- Add words with translations
- Include example sentences
- Organize by categories and collections
- AI-generated example sentences

### Practice Mode
- Interactive flashcards
- Audio pronunciation
- Spaced repetition learning
- Progress tracking

### Data Import/Export
- Import from various formats
- Export for backup
- Bulk word management

### AI Integration
- OpenAI for example generation
- Automatic transcriptions
- Smart translations

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Vue.js team for the amazing framework
- Electron team for desktop app capabilities
- Supabase for backend services
- OpenAI for AI capabilities
- All contributors and users of the app
