import { useState, useEffect, useRef } from 'react';
import { FaRegFolderClosed } from 'react-icons/fa6';

type Message = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

type ChatHistory = {
  messages: Message[];
  input: string;
};

const PLACEHOLDER_MESSAGES = [
  'Type your question...',
  'How old are you?',
  'What are your skills?',
  'Where are you located?',
  'What projects have you worked on?',
];

export default function MacTerminal() {
  const [chatHistory, setChatHistory] = useState<ChatHistory>({
    messages: [],
    input: '',
  });
  const [isTyping, setIsTyping] = useState(false);
  const [placeholder, setPlaceholder] = useState('');
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [streamedMessage, setStreamedMessage] = useState('');

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const currentMessage = PLACEHOLDER_MESSAGES[currentPlaceholderIndex];

    const animatePlaceholder = () => {
      if (isDeleting) {
        if (placeholder.length === 0) {
          setIsDeleting(false);
          setCurrentPlaceholderIndex(
            (prev) => (prev + 1) % PLACEHOLDER_MESSAGES.length
          );
          timeout = setTimeout(animatePlaceholder, 400);
        } else {
          setPlaceholder((prev) => prev.slice(0, -1));
          timeout = setTimeout(animatePlaceholder, 80);
        }
      } else {
        if (placeholder.length === currentMessage.length) {
          timeout = setTimeout(() => setIsDeleting(true), 1500);
        } else {
          setPlaceholder(currentMessage.slice(0, placeholder.length + 1));
          timeout = setTimeout(animatePlaceholder, 120);
        }
      }
    };

    timeout = setTimeout(animatePlaceholder, 100);

    return () => clearTimeout(timeout);
  }, [placeholder, isDeleting, currentPlaceholderIndex]);

const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const welcomeMessage = `
Last login: ${formattedDate} on ttys001
----------------------------------------
User      : Felix
Location  : Medan, Indonesia

Contact   : pelikseuh@gmail.com
GitHub    : github.com/pelikse
----------------------------------------

Type 'help' to see available commands.
`;


  const systemPrompt = `IMPORTANT: You ARE Felix himself. You must always speak in first-person ("I", "my", "me"). Never refer to "Felix" in third-person.
CURRENT DATE: ${formattedDate} - Always use this exact date when discussing the current date/year.

Example responses:
Q: "Where do you live?"
A: "I live in Medan, Indonesia"

Q: "What's your background?"
A: "I'm a Full Stack Developer with experience in React, Next.js, and Node.js"

Q: "How old are you?"
A: "I'm 21 years old"

Core details about me:
- I'm Felix
- I'm 21 years old
- I live in Medan, Indonesia
- I'm a Full Stack Developer
- My email is pelikseuh@gmail.com
- I was born in 2004
- I was born in Medan, Indonesia

My technical expertise:
- Full Stack Development
- React, Express, Node, Astro, JavaScript, TypeScript
- Node.js/Express

Response rules:
1. ALWAYS use first-person (I, me, my)
2. Never say "Felix" or refer to myself in third-person
3. Keep responses concise and professional
4. Use markdown formatting when appropriate
5. Maintain a friendly, conversational tone

If a question is unrelated to my work or portfolio:
- If it is a simple factual or general-knowledge question (e.g., basic math, country capitals, definitions, common facts), answer it normally.
- If it is not simple factual knowledge and is off-topic, respond with a sarcastic remark.

Examples of sarcastic replies:
- "Not in my database. I only keep the good stuff."
- "Outside my scope — my brain’s on a strict diet."
- "Yeah, no. I limit my knowledge to things that actually matter."
- "That’s above my clearance level… and I’m not asking."
`;


  useEffect(() => {
    setChatHistory((prev) => {
      if (prev.messages.length === 0) {
        return {
          ...prev,
          messages: [{ role: 'assistant', content: welcomeMessage }],
        };
      }
      return prev;
    });
  }, []);

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory.messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChatHistory((prev) => ({ ...prev, input: e.target.value }));
  };

  const handleBuiltInCommands = (command: string): string | null => {
  const cmd = command.trim().toLowerCase();

  switch (cmd) {
    case 'help':
      return `Available commands:

- help → Show this message
- whoami → Show info about me
- ls → List available sections
- clear → Clear the terminal
- credits → Show source attribution

Ask anything else and I’ll respond using my AI assistant!`;

    case 'whoami':
      return `I'm Felix — a Developer based in Medan, Indonesia.
Email: pelikseuh@gmail.com
GitHub: github.com/pelikse`;

    case 'ls':
      return `./about-me
./projects
./contact
./skills
./experience`;

    case './about-me':
      return `Under construction...`;

    case './projects':
      return `Under construction...`;

    case './skills':
      return `Under construction...`;

    case './experience':
      return `Under construction...`;

    case 'credits':
      return `
This porfolio is inspired by John Culbreth's github (https://github.com/JohnnyCulbreth)`;

    case 'clear':
      // clear will be handled separately in handleSubmit
      return '__CLEAR__'; 

    default:
      return null;
  }
};


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userInput = chatHistory.input.trim();
    if (!userInput) return;

    const localResponse = handleBuiltInCommands(userInput);
      if (localResponse !== null) {
    if (localResponse === '__CLEAR__') {
      setChatHistory({
        messages: [{ role: 'assistant', content: welcomeMessage }],
        input: '',
      });
      setStreamedMessage('');
      setIsTyping(false);
      return;
    }

    setChatHistory((prev) => ({
      messages: [
        ...prev.messages,
        { role: 'user', content: userInput },
        { role: 'assistant', content: localResponse },
      ],
      input: '',
    }));
    return;
  }

    setChatHistory((prev) => ({
      messages: [...prev.messages, { role: 'user', content: userInput }],
      input: '',
    }));

    setHistory((prev) => [...prev, userInput]);
    setHistoryIndex(null);
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
        messages: [
          ...chatHistory.messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
          {
            role: 'user',
            content: `${systemPrompt}\n\n${userInput}`,
          },
        ],
      }),
      });

      if (!response.ok) throw new Error('Failed to get response');
      const data = await response.json();
      setStreamedMessage('');
      const message = data.message;

      let index = 0;
      const typeNextChar = () => {
        if (index <= message.length) {
          setStreamedMessage(message.substring(0, index));
          index++;
          setTimeout(typeNextChar, 15);
        } else {
          setChatHistory((prev) => ({
            ...prev,
            messages: [...prev.messages, { role: 'assistant', content: message }],
          }));
          setStreamedMessage('');
          setIsTyping(false);
        }
      };
      typeNextChar();
    } catch (error) {
      setChatHistory((prev) => ({
        ...prev,
        messages: [
          ...prev.messages,
          {
            role: 'assistant',
            content: "Well, that didn’t work. But hey, at least you tried.",
          },
        ],
      }));
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className='bg-black/75 w-[600px] h-[400px] rounded-lg overflow-hidden shadow-lg mx-4 sm:mx-0'>
      <div className='bg-gray-800 h-6 flex items-center space-x-2 px-4'>
        <div className='w-3 h-3 rounded-full bg-red-500'></div>
        <div className='w-3 h-3 rounded-full bg-yellow-500'></div>
        <div className='w-3 h-3 rounded-full bg-green-500'></div>
        <span className='text-sm text-gray-300 flex-grow text-center font-semibold flex items-center justify-center gap-2'>
          <FaRegFolderClosed size={14} className='text-gray-300' />
          pelikseuh ⸺ zsh
        </span>
      </div>
      <div className='p-4 text-gray-200 font-mono text-xs h-[calc(400px-1.5rem)] flex flex-col'>
        <div className='flex-1 overflow-y-auto'>
          {chatHistory.messages.map((msg, index) => (
            <div key={index} className='mb-2'>
              {msg.role === 'user' ? (
                <div className='flex items-start space-x-2'>
                  <span className='text-green-400'>{'>'}</span>
                  <pre className='whitespace-pre-wrap'>{msg.content}</pre>
                </div>
              ) : (
                <pre className='whitespace-pre-wrap'>{msg.content}</pre>
              )}
            </div>
          ))}
          {streamedMessage && (
            <pre className='whitespace-pre-wrap'>{streamedMessage}</pre>
          )}
          {isTyping && !streamedMessage && <div className='animate-pulse'>...</div>}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSubmit} className='mt-2'>
          <div className='flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2'>
            <span className='whitespace-nowrap'>guest@guest root %</span>
            <input
              ref={inputRef}
              type='text'
              value={chatHistory.input}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === 'ArrowUp') {
                  e.preventDefault();
                  setHistoryIndex((prev) => {
                    const newIndex = prev === null ? history.length - 1 : Math.max(prev - 1, 0);
                    setChatHistory((ch) => ({ ...ch, input: history[newIndex] || '' }));
                    return newIndex;
                  });
                } else if (e.key === 'ArrowDown') {
                  e.preventDefault();
                  setHistoryIndex((prev) => {
                    if (prev === null) return null;
                    const newIndex = Math.min(prev + 1, history.length);
                    const newInput = newIndex < history.length ? history[newIndex] : '';
                    setChatHistory((ch) => ({ ...ch, input: newInput }));
                    return newIndex < history.length ? newIndex : null;
                  });
                }
              }}
              className='w-full sm:flex-1 bg-transparent outline-none text-white placeholder-gray-400'
              placeholder={placeholder}
            />
          </div>
        </form>
      </div>
    </div>
  );
}