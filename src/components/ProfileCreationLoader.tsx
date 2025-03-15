//components/ProfileCreationLoader.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Icons } from './Icons';

const messages = [
  { text: 'Activating your personal LockedIn profile...', emoji: '🚀' },
  { text: 'Crafting your unique experience...', emoji: '🎨' },
  { text: 'Securing your data with top-notch encryption...', emoji: '🔒' },
  { text: 'Almost there! Just a few more seconds...', emoji: '⏳' }
];

const quotes = [
  '“The future belongs to those who believe in the beauty of their dreams.” – Eleanor Roosevelt',
  '“Success is not final, failure is not fatal: It is the courage to continue that counts.” – Winston Churchill',
  '“The only limit to our realization of tomorrow is our doubts of today.” – Franklin D. Roosevelt',
  '“Do what you can, with what you have, where you are.” – Theodore Roosevelt'
];

export function ProfileCreationLoader() {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
    }, 3000);

    const quoteInterval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 5000);

    return () => {
      clearInterval(messageInterval);
      clearInterval(quoteInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <motion.div
        className="bg-background-light dark:bg-background-dark p-8 rounded-lg shadow-lg text-center max-w-md w-full"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="w-16 h-16 bg-lockedin-blue rounded-full mx-auto mb-4 flex items-center justify-center"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          <Icons.Command />
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentMessageIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="mb-4"
          >
            <h2 className="text-xl font-semibold text-lockedin-purple-dark">
              {messages[currentMessageIndex].text} {messages[currentMessageIndex].emoji}
            </h2>
          </motion.div>
        </AnimatePresence>

        <motion.div
          className="w-full bg-lockedin-purple-darker rounded-full h-2 mb-4"
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 5, repeat: Infinity, repeatType: 'reverse' }}
        >
          <motion.div
            className="bg-lockedin-purple-light h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 5, repeat: Infinity, repeatType: 'reverse' }}
          />
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuoteIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-lockedin-purple-darkest italic">{quotes[currentQuoteIndex]}</p>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
