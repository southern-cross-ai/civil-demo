import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  MessageSquare, X, Send, Paperclip, Mic, 
  Smile, ChevronDown, Bot, User, Sparkles, 
  AlertCircle, Clock, Check, CheckCheck, MoreVertical
} from 'lucide-react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';

// Animation variants for chat messages
const messageVariants = {
  hidden: { opacity: 0, y: 10, scale: 0.95 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.05,
      type: 'spring',
      stiffness: 400,
      damping: 25,
      mass: 0.8
    }
  }),
  exit: { 
    opacity: 0, 
    x: 50,
    transition: {
      duration: 0.2
    }
  },
  hover: {
    scale: 1.02,
    transition: { type: 'spring', stiffness: 400, damping: 10 }
  },
  tap: { scale: 0.98 }
};

// Animation for typing indicator
const typingVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { 
      staggerChildren: 0.2,
      delayChildren: 0.2
    }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

// Animation for typing dots
const dotVariants = {
  initial: { y: 0 },
  animate: {
    y: -5,
    transition: {
      duration: 0.6,
      repeat: Infinity,
      repeatType: 'reverse',
      ease: 'easeInOut'
    }
  }
};

// Typing indicator component
const TypingIndicator = () => (
  <motion.div
    className="flex items-center space-x-2 p-3 bg-gray-800/50 rounded-2xl w-fit mb-4 ml-2"
    initial="initial"
    animate="animate"
    exit="exit"
    variants={typingVariants}
  >
    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center flex-shrink-0">
      <Bot className="h-4 w-4 text-white" />
    </div>
    <div className="flex space-x-1.5">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="h-2 w-2 rounded-full bg-blue-400"
          variants={dotVariants}
          custom={i}
        />
      ))}
    </div>
  </motion.div>
);

// Message status indicator
const MessageStatus = ({ status, timestamp }) => {
  const statusIcons = {
    sending: <Clock className="h-3 w-3 text-gray-400" />,
    sent: <Check className="h-3 w-3 text-gray-400" />,
    delivered: <CheckCheck className="h-3 w-3 text-blue-400" />,
    read: <CheckCheck className="h-3 w-3 text-blue-400" />,
    error: <AlertCircle className="h-3 w-3 text-red-400" />
  };

  return (
    <div className="flex items-center mt-1 space-x-1">
      <span className="text-xs text-gray-400">
        {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </span>
      {statusIcons[status] || statusIcons.sent}
    </div>
  );
};

const ChatSidebar = ({ 
  open, 
  onClose, 
  messages = [], 
  input = '', 
  setInput = () => {}, 
  onSubmit = () => {}, 
  isTyping = false 
}) => {
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isHoveringMessage, setIsHoveringMessage] = useState(null);
  const controls = useAnimation();

  const scrollToBottom = useCallback((behavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, []);

  // Auto-scroll and focus management
  useEffect(() => {
    scrollToBottom('auto');
    if (open) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [messages, open, scrollToBottom]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSubmit(input);
      // Don't clear input here if you want to keep it for multi-line messages
      // setInput('');
    }
  };

  if (!open) return null;

  return (
    <motion.div 
      className="fixed inset-y-0 right-0 w-full sm:w-96 bg-gray-900/95 backdrop-blur-lg border-l border-gray-800/50 shadow-2xl flex flex-col z-50 overflow-hidden"
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ 
        type: 'spring', 
        damping: 30, 
        stiffness: 400,
        mass: 0.5
      }}
    >
      {/* Header with gradient and improved styling */}
      <motion.div 
        className="relative px-4 py-3 border-b border-gray-800/50 bg-gradient-to-r from-gray-900 to-gray-900/80"
        initial={false}
        animate={{
          backgroundColor: isMinimized 
            ? 'rgba(17, 24, 39, 0.95)' 
            : 'rgba(17, 24, 39, 0.98)'
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-400/5" />
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center">
            <motion.div 
              className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg"
              whileHover={{ rotate: 10, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <MessageSquare className="h-4 w-4 text-white" />
            </motion.div>
            <div className="ml-3">
              <h3 className="text-base font-semibold text-white flex items-center">
                <span>Aviation Safety Assistant</span>
                <motion.span 
                  className="ml-2 text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  Online
                </motion.span>
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Ask me anything about aviation safety
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <motion.button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label={isMinimized ? 'Maximize chat' : 'Minimize chat'}
            >
              <ChevronDown 
                className={`h-4 w-4 transition-transform duration-300 ${isMinimized ? 'rotate-180' : ''}`} 
              />
            </motion.button>
            <motion.button
              onClick={onClose}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
              whileHover={{ scale: 1.1, color: '#f87171' }}
              whileTap={{ scale: 0.95 }}
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </motion.button>
          </div>
        </div>
      </motion.div>
      
      <AnimatePresence mode="wait">
        {!isMinimized && (
          <motion.div 
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-900/70 via-gray-900/50 to-gray-900/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  variants={messageVariants}
                  initial="hidden"
                  animate="visible"
                  custom={index}
                  whileHover="hover"
                  whileTap="tap"
                  onHoverStart={() => setIsHoveringMessage(message.id)}
                  onHoverEnd={() => setIsHoveringMessage(null)}
                >
                  <div
                    className={`relative max-w-[85%] rounded-2xl px-4 py-2.5 shadow-lg ${
                      message.type === 'user'
                        ? 'bg-gradient-to-br from-blue-600 to-blue-500 text-white rounded-br-none'
                        : 'bg-gray-800/90 text-gray-100 rounded-bl-none border border-gray-700/50'
                    }`}
                  >
                    {/* Message content */}
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {message.text}
                    </div>
                    
                    {/* Message metadata */}
                    <div className={`mt-1.5 flex items-center justify-end space-x-2 transition-opacity duration-200 ${
                      isHoveringMessage === message.id ? 'opacity-100' : 'opacity-60'
                    }`}>
                      <MessageStatus 
                        status={message.status || 'sent'} 
                        timestamp={message.timestamp || Date.now()} 
                      />
                      {message.type === 'user' && (
                        <button 
                          className="text-gray-300 hover:text-white transition-colors"
                          onClick={() => {
                            // Handle message actions (edit, delete, etc.)
                            console.log('Message action:', message.id);
                          }}
                        >
                          <MoreVertical className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                    
                    {/* Citation/source if available */}
                    {message.citation && (
                      <div className="mt-2 pt-2 border-t border-gray-700/50">
                        <div className="text-xs text-blue-300 font-medium flex items-center">
                          <Sparkles className="h-3 w-3 mr-1" />
                          Source
                        </div>
                        <div className="text-xs text-gray-300 mt-1">
                          {message.citation}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              
              {/* Typing indicator */}
              {isTyping && (
                <motion.div 
                  className="flex items-center space-x-2 pl-2 py-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex space-x-1.5">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 rounded-full bg-blue-400"
                        animate={{
                          y: [0, -5, 0],
                          opacity: [0.6, 1, 0.6],
                        }}
                        transition={{
                          duration: 1.2,
                          repeat: Infinity,
                          delay: i * 0.15,
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-400">Assistant is typing...</span>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Message input area */}
      <AnimatePresence>
        {!isMinimized && (
          <motion.div 
            className="p-4 border-t border-gray-800/50 bg-gray-900/50 backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="relative">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="w-full bg-gray-800/70 border border-gray-700/50 rounded-2xl py-3 pl-4 pr-12 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
                  aria-label="Type your message"
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                  <button
                    type="button"
                    className="p-1.5 rounded-full text-gray-400 hover:text-blue-400 hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-colors"
                    aria-label="Add emoji"
                  >
                    <Smile className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="p-1.5 rounded-full text-gray-400 hover:text-blue-400 hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-colors"
                    aria-label="Attach file"
                  >
                    <Paperclip className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="p-1.5 rounded-full text-gray-400 hover:text-blue-400 hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-colors"
                    aria-label="Record voice message"
                  >
                    <Mic className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={!input.trim()}
                className={`absolute right-4 bottom-4 p-2 rounded-full ${
                  input.trim()
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                } transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ChatSidebar;
