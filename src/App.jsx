import { useState } from 'react';
import './App.css';
import Lottie from 'lottie-react';
import animation from './assets/animation.json';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import axios from 'axios';

function App() {
  const GEMINI_API_KEY = 'AIzaSyDoi7lPoDKEpalJ4MUenO6-xEvaUiJKw-k';
  const ai_url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

  const [suggestion, setsuggestion] = useState([
    'what is ai',
    'what is blockchain',
    'how to build blockchain',
  ]);

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const handlesubmit = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await axios.post(ai_url, {
        contents: [
          {
            parts: [{ text: input }],
          },
        ],
      });

      const botText =
        response.data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
      const botMessage = { sender: 'bot', text: botText };

      setMessages((prev) => [...prev, botMessage]);
      setInput('');
    } catch (error) {
      console.error('Error fetching from Gemini:', error);
      const errorMessage = { sender: 'bot', text: 'Oops! Something went wrong.' };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  return (
    <>
      <div className="d-flex flex-column min-vh-100">
        <div className="container flex-grow-1 my-3">
          <div className="card border-0 shadow-sm transparent-bg">
            <div className="card-body">
              {/* Animation with glowing gradient container */}
              <div className="logo-container">
                <Lottie animationData={animation} loop={true} style={{ width: '11rem' }} />
              </div>

              {/* Suggestion Cards */}
              <div className="row row-cols-1 row-cols-md-3 g-4 mb-4">
                {suggestion.map((currELe, index) => (
                  <div className="col" key={index}>
                    <div className="card border-0 shadow-sm suggestion-card">
                      <div className="card-body">
                        <p className="card-text">{currELe}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Messages */}
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`alert ${
                    msg.sender === 'user' ? 'alert-primary' : 'alert-success'
                  }`}
                >
                  {msg.sender === 'user' ? 'You: ' : 'Bot: '}
                  {msg.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Suggestion Input Box at Bottom */}
        <div className="card-footer bg-white border-top mt-auto py-3">
          <div className="container">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Ask me anything"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handlesubmit()}
              />
              <button className="btn btn-primary" onClick={handlesubmit}>
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
