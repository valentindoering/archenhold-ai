"use client";
import React, { useState, useEffect } from 'react';
import { initialFlashcards, type Flashcard, type FlashcardApp } from '@/app/agentConfigs/chatSupervisor4/sampleData';

interface FlashcardAppProps {
  // No props needed for now - the component manages its own state
}

const FlashcardApp: React.FC<FlashcardAppProps> = () => {
  const [flashcardState, setFlashcardState] = useState<FlashcardApp>({
    flashcards: initialFlashcards,
    currentIndex: 0,
    isRevealed: true,
    isStarted: false
  });

  // Expose functions to window for agent control
  useEffect(() => {
    (window as any).startFlashcardSession = () => {
      setFlashcardState(prev => ({
        ...prev,
        isStarted: true,
        currentIndex: 0,
        isRevealed: true
      }));
    };

    // Remove reveal functionality - always show translation
    (window as any).revealFlashcardAnswer = () => {
      // No-op since answers are always revealed
    };

    (window as any).nextFlashcard = () => {
      setFlashcardState(prev => {
        const nextIndex = prev.currentIndex + 1;
        if (nextIndex >= prev.flashcards.length) {
          // Session completed
          return {
            ...prev,
            isStarted: false,
            currentIndex: 0,
            isRevealed: true
          };
        }
        return {
          ...prev,
          currentIndex: nextIndex,
          isRevealed: true
        };
      });
      
      // Return status for agent to know if session completed
      const nextIndex = flashcardState.currentIndex + 1;
      return {
        completed: nextIndex >= flashcardState.flashcards.length
      };
    };

    (window as any).restartFlashcardSession = () => {
      setFlashcardState(prev => ({
        ...prev,
        isStarted: true,
        currentIndex: 0,
        isRevealed: true
      }));
    };

    (window as any).getFlashcardStatus = () => {
      return {
        success: true,
        currentCard: flashcardState.currentIndex + 1,
        totalCards: flashcardState.flashcards.length,
        isStarted: flashcardState.isStarted,
        isRevealed: flashcardState.isRevealed,
        message: "Flashcard status retrieved"
      };
    };

    // Cleanup
    return () => {
      delete (window as any).startFlashcardSession;
      delete (window as any).revealFlashcardAnswer;
      delete (window as any).nextFlashcard;
      delete (window as any).restartFlashcardSession;
      delete (window as any).getFlashcardStatus;
    };
  }, [flashcardState.currentIndex, flashcardState.flashcards.length, flashcardState.isStarted, flashcardState.isRevealed]);

  const currentFlashcard = flashcardState.flashcards[flashcardState.currentIndex];

  const handleStart = () => {
    setFlashcardState(prev => ({
      ...prev,
      isStarted: true,
      currentIndex: 0,
      isRevealed: true
    }));
  };

  // Remove reveal functionality
  const handleReveal = () => {
    // No-op since answers are always revealed
  };

  const handleNext = () => {
    setFlashcardState(prev => {
      const nextIndex = prev.currentIndex + 1;
      if (nextIndex >= prev.flashcards.length) {
        // Session completed
        return {
          ...prev,
          isStarted: false,
          currentIndex: 0,
          isRevealed: true
        };
      }
      return {
        ...prev,
        currentIndex: nextIndex,
        isRevealed: true
      };
    });
  };

  const handleRestart = () => {
    setFlashcardState(prev => ({
      ...prev,
      isStarted: true,
      currentIndex: 0,
      isRevealed: true
    }));
  };

  if (!flashcardState.isStarted) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 w-80 h-96 flex flex-col items-center justify-center">
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Spanish Flashcards
          </h3>
          <p className="text-gray-600 text-sm">
            Learn Spanish with 10 common phrases
          </p>
        </div>
        
        <button
          onClick={handleStart}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Start Session
        </button>
        
        <div className="mt-4 text-xs text-gray-500 text-center">
          <p>Say "start" or use the button above</p>
          <p>to begin your Spanish practice</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 w-80 h-96 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Spanish Flashcards
        </h3>
        <span className="text-sm text-gray-500">
          {flashcardState.currentIndex + 1} / {flashcardState.flashcards.length}
        </span>
      </div>

      {/* Flashcard Content */}
      <div className="flex-1 flex flex-col justify-center">
        {/* English Text */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">
            English
          </div>
          <div className="text-lg font-medium text-gray-800">
            {currentFlashcard.english}
          </div>
        </div>

        {/* Spanish Text (always shown) */}
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-xs text-blue-600 uppercase tracking-wide mb-2">
            Spanish
          </div>
          <div className="text-lg font-medium text-blue-800">
            {currentFlashcard.spanish}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={handleNext}
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
        >
          {flashcardState.currentIndex + 1 >= flashcardState.flashcards.length ? 'Finish' : 'Next'}
        </button>
        <button
          onClick={handleRestart}
          className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
        >
          Restart
        </button>
      </div>

      {/* Voice Instructions */}
      <div className="mt-3 text-xs text-gray-500 text-center">
        <p>Say "next" or "restart" to control</p>
      </div>
    </div>
  );
};

export default FlashcardApp;
