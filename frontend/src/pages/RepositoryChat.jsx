import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getRepositoryById, chatWithRepository } from '../services/api';
import LoadingOverlay from '../components/common/LoadingOverlay';

const RepositoryChat = () => {
  const { id } = useParams();
  const [repository, setRepository] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchRepository();
  }, [id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchRepository = async () => {
    try {
      const response = await getRepositoryById(id);
      
      if (!response?.data) {
        setError('Repository data not available');
        return;
      }

      setRepository(response.data);
      
      setMessages([{
        id: Date.now(),
        type: 'assistant',
        content: `Hello! I'm your AI assistant for ${response.data.repository_name}. Ask me anything about this repository's code, structure, or functionality.`,
        timestamp: new Date()
      }]);
    } catch (err) {
      console.error('Error fetching repository:', err);
      setError(err.userMessage || 'Failed to load repository information');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!inputValue.trim() || loading) return;

    const question = inputValue.trim();
    setInputValue('');
    setError(null);

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: question,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await chatWithRepository(id, question);
      
      if (!response?.data?.answer) {
        throw new Error('No response received from AI');
      }

      const assistantMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: response.data.answer,
        timestamp: new Date(),
        metadata: response.data.context_size
      };

      setMessages(prev => [...prev, assistantMessage]);
      setError(null);
    } catch (err) {
      console.error('Error sending message:', err);
      const errorText = err.userMessage || err.message || 'Failed to get response';
      setError(errorText);
      
      const errorMessage = {
        id: Date.now() + 1,
        type: 'error',
        content: errorText,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const clearChat = () => {
    setMessages([{
      id: Date.now(),
      type: 'assistant',
      content: `Chat cleared. How can I help you with ${repository?.repository_name}?`,
      timestamp: new Date()
    }]);
    setError(null);
  };

  const formatTimestamp = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="repository-chat-container">
      {loading && <LoadingOverlay message="Getting AI response..." submessage="This may take a few moments" />}
      <div className="chat-header">
        <div className="breadcrumb">
          <Link to="/repositories" className="breadcrumb-link">Repositories</Link>
          <span className="breadcrumb-separator">/</span>
          {repository && (
            <>
              <Link to={`/repositories/${id}/symbols`} className="breadcrumb-link">
                {repository.repository_name}
              </Link>
              <span className="breadcrumb-separator">/</span>
            </>
          )}
          <span className="breadcrumb-current">Chat</span>
        </div>

        <div className="header-content">
          <h2>💬 Repository Assistant</h2>
          {repository && (
            <p className="chat-subtitle">
              Ask questions about {repository.repository_name}
            </p>
          )}
        </div>

        <div className="header-actions">
          <button
            onClick={clearChat}
            className="btn btn-secondary btn-sm"
            disabled={loading || messages.length <= 1}
          >
            🗑️ Clear Chat
          </button>
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((message) => (
          <div key={message.id} className={`message message-${message.type}`}>
            <div className="message-avatar">
              {message.type === 'user' ? '👤' : message.type === 'error' ? '⚠️' : '🤖'}
            </div>
            <div className="message-content">
              <div className="message-header">
                <span className="message-sender">
                  {message.type === 'user' ? 'You' : message.type === 'error' ? 'Error' : 'AI Assistant'}
                </span>
                <span className="message-timestamp">
                  {formatTimestamp(message.timestamp)}
                </span>
              </div>
              <div className="message-text">{message.content}</div>
              {message.metadata && (
                <div className="message-metadata">
                  Context: {message.metadata.symbols} symbols, {message.metadata.files} files
                </div>
              )}
            </div>
          </div>
        ))}



        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-container">
        {error && (
          <div className="chat-error">
            <span>⚠️ {error}</span>
            <button onClick={() => setError(null)} className="error-close">×</button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="chat-input-form">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a question about this repository..."
            className="chat-input"
            disabled={loading}
            rows={1}
            autoFocus
          />
          <button
            type="submit"
            className="btn btn-primary chat-send-btn"
            disabled={loading || !inputValue.trim()}
          >
            {loading ? '⏳' : '📤'} Send
          </button>
        </form>

        <div className="chat-suggestions">
          <p className="suggestions-title">Try asking:</p>
          <div className="suggestion-chips">
            <button
              className="suggestion-chip"
              onClick={() => setInputValue('What does this repository do?')}
              disabled={loading}
            >
              What does this repository do?
            </button>
            <button
              className="suggestion-chip"
              onClick={() => setInputValue('What are the main functions?')}
              disabled={loading}
            >
              What are the main functions?
            </button>
            <button
              className="suggestion-chip"
              onClick={() => setInputValue('Explain the project structure')}
              disabled={loading}
            >
              Explain the project structure
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .repository-chat-container {
          display: flex;
          flex-direction: column;
          height: calc(100vh - 80px);
          max-width: 1200px;
          margin: 0 auto;
          padding: var(--spacing-lg);
        }

        .chat-header {
          margin-bottom: var(--spacing-lg);
          padding-bottom: var(--spacing-lg);
          border-bottom: 2px solid var(--border-color);
        }

        .breadcrumb {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          margin-bottom: var(--spacing-md);
          font-size: 0.875rem;
        }

        .breadcrumb-link {
          color: var(--primary-color);
          text-decoration: none;
        }

        .breadcrumb-link:hover {
          text-decoration: underline;
        }

        .breadcrumb-separator {
          color: var(--text-light);
        }

        .breadcrumb-current {
          color: var(--text-secondary);
        }

        .header-content h2 {
          font-size: 2rem;
          margin: 0 0 var(--spacing-sm) 0;
        }

        .chat-subtitle {
          color: var(--text-secondary);
          margin: 0;
        }

        .header-actions {
          margin-top: var(--spacing-md);
        }

        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: var(--spacing-lg);
          background: #f9fafb;
          border-radius: var(--radius-lg);
          margin-bottom: var(--spacing-lg);
          display: flex;
          flex-direction: column;
          gap: var(--spacing-lg);
        }

        .message {
          display: flex;
          gap: var(--spacing-md);
          animation: fadeIn 0.3s ease-in;
        }

        .message-user {
          flex-direction: row-reverse;
        }

        .message-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          flex-shrink: 0;
          background: white;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .message-content {
          max-width: 70%;
          background: white;
          border-radius: var(--radius-lg);
          padding: var(--spacing-md);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .message-user .message-content {
          background: var(--primary-color);
          color: white;
        }

        .message-error .message-content {
          background: #fee2e2;
          color: var(--error-color);
          border: 1px solid #fecaca;
        }

        .message-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-xs);
          gap: var(--spacing-md);
        }

        .message-sender {
          font-weight: 600;
          font-size: 0.875rem;
        }

        .message-user .message-sender {
          color: rgba(255, 255, 255, 0.9);
        }

        .message-timestamp {
          font-size: 0.75rem;
          color: var(--text-light);
        }

        .message-user .message-timestamp {
          color: rgba(255, 255, 255, 0.7);
        }

        .message-text {
          line-height: 1.6;
          white-space: pre-wrap;
          word-wrap: break-word;
        }

        .message-metadata {
          margin-top: var(--spacing-sm);
          padding-top: var(--spacing-sm);
          border-top: 1px solid var(--border-color);
          font-size: 0.75rem;
          color: var(--text-light);
        }

        .typing-indicator {
          display: flex;
          gap: 4px;
          padding: var(--spacing-sm) 0;
        }

        .typing-indicator span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--primary-color);
          animation: typing 1.4s infinite;
        }

        .typing-indicator span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing-indicator span:nth-child(3) {
          animation-delay: 0.4s;
        }

        .chat-input-container {
          background: white;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: var(--spacing-lg);
          box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
        }

        .chat-error {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #fee2e2;
          color: var(--error-color);
          padding: var(--spacing-sm) var(--spacing-md);
          border-radius: var(--radius-md);
          margin-bottom: var(--spacing-md);
          font-size: 0.875rem;
        }

        .error-close {
          background: none;
          border: none;
          font-size: 1.25rem;
          cursor: pointer;
          color: var(--error-color);
          padding: 0;
          width: 24px;
          height: 24px;
        }

        .chat-input-form {
          display: flex;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-md);
        }

        .chat-input {
          flex: 1;
          padding: var(--spacing-md);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          font-size: 1rem;
          font-family: inherit;
          resize: none;
          min-height: 60px;
          max-height: 150px;
        }

        .chat-input:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .chat-send-btn {
          align-self: flex-end;
          white-space: nowrap;
        }

        .chat-suggestions {
          border-top: 1px solid var(--border-color);
          padding-top: var(--spacing-md);
        }

        .suggestions-title {
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin: 0 0 var(--spacing-sm) 0;
          font-weight: 500;
        }

        .suggestion-chips {
          display: flex;
          flex-wrap: wrap;
          gap: var(--spacing-sm);
        }

        .suggestion-chip {
          padding: var(--spacing-xs) var(--spacing-md);
          border: 1px solid var(--border-color);
          border-radius: 20px;
          background: white;
          color: var(--text-secondary);
          font-size: 0.875rem;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .suggestion-chip:hover:not(:disabled) {
          background: var(--primary-color);
          color: white;
          border-color: var(--primary-color);
        }

        .suggestion-chip:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes typing {
          0%, 60%, 100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-10px);
          }
        }

        @media (max-width: 768px) {
          .repository-chat-container {
            padding: var(--spacing-md);
          }

          .message-content {
            max-width: 85%;
          }

          .chat-input-form {
            flex-direction: column;
          }

          .chat-send-btn {
            align-self: stretch;
          }

          .suggestion-chips {
            flex-direction: column;
          }

          .suggestion-chip {
            width: 100%;
            text-align: left;
          }
        }
      `}</style>
    </div>
  );
};

export default RepositoryChat;
