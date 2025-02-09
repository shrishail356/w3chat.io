import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

const TypingMessage = ({ content, onComplete }: { content: string; onComplete: () => void }) => {
  const [displayedContent, setDisplayedContent] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  // List of content that should bypass typing
  const skipTypingFor = [
    'Native ETH Transfer Confirmation',
    'ERC20 Token Transfer Confirmation',
  ];

  const shouldSkipTyping = skipTypingFor.some((phrase) => content.includes(phrase));

  useEffect(() => {
    if (!content) return;

    if (shouldSkipTyping) {
      // Skip typing animation
      setDisplayedContent(content);
      onComplete();
      return;
    }

    // Calculate delay based on content length (faster for longer content)
    const baseDelay = 30; // base delay in milliseconds
    const adjustedDelay = Math.max(10, baseDelay - content.length / 100);

    if (currentIndex < content.length) {
      const timer = setTimeout(() => {
        setDisplayedContent((prevContent) => prevContent + content[currentIndex]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }, adjustedDelay);

      return () => clearTimeout(timer);
    } else {
      onComplete();
    }
  }, [content, currentIndex, onComplete, shouldSkipTyping]);

  return (
    <ReactMarkdown className="prose prose-invert max-w-none">
      {displayedContent}
    </ReactMarkdown>
  );
};

export default TypingMessage;
