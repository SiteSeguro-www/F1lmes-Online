import React, { useState, useRef, useEffect } from 'react';
import { Product, ChatMessage } from '../types';
import { askProductAssistant } from '../services/geminiService';

interface AIChatAssistantProps {
  product: Product;
}

const AIChatAssistant: React.FC<AIChatAssistantProps> = ({ product }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: `Olá! Sou a IA do MercadoClone. Tem alguma dúvida sobre o ${product.title.split(' ').slice(0, 3).join(' ')}...?` }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMsg = inputValue;
    setInputValue('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const responseText = await askProductAssistant(userMsg, product);
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: 'Ops, tive um problema ao processar. Tente novamente.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="mt-6 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-bold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
      >
        <i className="fa-solid fa-sparkles"></i>
        Perguntar à IA sobre este produto
      </button>
    );
  }

  return (
    <div className="mt-6 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden flex flex-col h-[400px]">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex justify-between items-center text-white">
        <div className="flex items-center gap-2 font-bold">
          <i className="fa-solid fa-robot"></i>
          Assistente Virtual
        </div>
        <button onClick={() => setIsOpen(false)} className="hover:text-gray-200">
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-lg text-sm ${
              msg.role === 'user' 
                ? 'bg-ml-blue text-white rounded-tr-none' 
                : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none shadow-sm'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
              <i className="fa-solid fa-circle-notch fa-spin text-ml-blue"></i> Analisando...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 bg-white border-t border-gray-200 flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Digite sua dúvida..."
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-ml-blue focus:ring-1 focus:ring-ml-blue"
        />
        <button
          onClick={handleSend}
          disabled={isLoading}
          className="bg-ml-blue text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-blue-600 disabled:opacity-50 transition-colors"
        >
          <i className="fa-solid fa-paper-plane"></i>
        </button>
      </div>
    </div>
  );
};

export default AIChatAssistant;
