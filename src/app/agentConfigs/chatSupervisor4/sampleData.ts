// Flashcard structure and initial data
export interface Flashcard {
  id: number;
  english: string;
  spanish: string;
}

export interface FlashcardApp {
  flashcards: Flashcard[];
  currentIndex: number;
  isRevealed: boolean;
  isStarted: boolean;
}

export const initialFlashcards: Flashcard[] = [
  {
    id: 1,
    english: "Hello, how are you?",
    spanish: "Hola, ¿cómo estás?"
  },
  {
    id: 2,
    english: "Where is the bathroom?",
    spanish: "¿Dónde está el baño?"
  },
  {
    id: 3,
    english: "I would like some water, please.",
    spanish: "Me gustaría un poco de agua, por favor."
  },
  {
    id: 4,
    english: "What time is it?",
    spanish: "¿Qué hora es?"
  },
  {
    id: 5,
    english: "Thank you very much.",
    spanish: "Muchas gracias."
  },
  {
    id: 6,
    english: "Excuse me, can you help me?",
    spanish: "Disculpe, ¿puede ayudarme?"
  },
  {
    id: 7,
    english: "I don't understand.",
    spanish: "No entiendo."
  },
  {
    id: 8,
    english: "How much does this cost?",
    spanish: "¿Cuánto cuesta esto?"
  },
  {
    id: 9,
    english: "I am learning Spanish.",
    spanish: "Estoy aprendiendo español."
  },
  {
    id: 10,
    english: "See you later!",
    spanish: "¡Hasta luego!"
  }
];

export const initialFlashcardAppData: FlashcardApp = {
  flashcards: initialFlashcards,
  currentIndex: 0,
  isRevealed: true, // Always show translations
  isStarted: false
};

// Sample responses for the flashcard learning agent
export const exampleFlashcardResponses = {
  encouragement: [
    "Great job! That's correct.",
    "Excellent pronunciation!",
    "Perfect! You're getting the hang of it.",
    "Well done! Keep it up."
  ],
  correction: [
    "Not quite right. Let me help you with the pronunciation.",
    "Close! Let me give you the correct pronunciation.",
    "Good effort! Here's how to say it correctly."
  ],
  readingPrompts: [
    "Let me read the English sentence for you.",
    "Here's the English phrase:",
    "Listen to this sentence:"
  ]
};

// Information about flashcard learning policies
export const exampleFlashcardPolicies = [
  {
    id: "FL-001",
    name: "Flashcard Learning Policy",
    topic: "flashcard learning",
    content: "The flashcard app helps users learn Spanish translations of common English phrases. Users can start the session and progress through cards at their own pace. Spanish translations are always visible to aid learning."
  },
  {
    id: "FL-002", 
    name: "Pronunciation Feedback Policy",
    topic: "pronunciation feedback",
    content: "The learning assistant provides helpful feedback on Spanish pronunciation attempts in English only and encourages users to practice speaking aloud. When users are reasonably correct, the system automatically advances to the next card."
  },
  {
    id: "FL-003",
    name: "Learning Session Policy", 
    topic: "learning session",
    content: "Each learning session progresses through 10 flashcards. Users can restart at any time or go back to previous cards if needed."
  }
];
