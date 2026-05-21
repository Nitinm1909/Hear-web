import React, { useState, useRef, useEffect } from "react";
import "./chatbot.css";
import floatingIcon from "./assets/chatbot1.jpg";
import headerLogo from "./assets/chatbot1.jpg";
import userIcon from "./assets/user-avatar.jpeg";

const faqData = [
  {
    question: "When will the product launch?",
    answer:
      "The product launch date will be announced soon. Stay tuned for updates within the app.",
  },
  {
    question: "What features does this product provide?",
    answer:
      "This product offers smart tools, an easy-to-use interface, and features designed to improve user experience and productivity.",
  },
  {
    question: "Is my data safe in this application?",
    answer:
      "Yes, your data is securely stored and protected using modern security practices and encryption.",
  },
  {
    question: "What makes this product different from others?",
    answer:
      "This product stands out with its simple design, user-focused features, and efficient performance compared to other solutions.",
  },
  {
    question: "Do I need to create an account?",
    answer:
      "Yes, creating an account helps you access all features and securely save your data.",
  },
  {
    question: "Can I delete my account anytime?",
    answer:
      "Yes, you can delete your account anytime from the settings, and your data will be removed.",
  },
];

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi there! How can I assist you today? 😊" },
  ]);
  const [input, setInput] = useState("");
  const [showFaqs, setShowFaqs] = useState(true);
  const chatbotRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFaqClick = (faq) => {
    // Add the question as a user message
    setMessages((prev) => [...prev, { sender: "user", text: faq.question }]);
    setShowFaqs(false);

    // Add the answer as a bot message after a short delay
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: faq.answer },
      ]);
      // Show FAQs again after answering
      setTimeout(() => {
        setShowFaqs(true);
      }, 500);
    }, 600);
  };

  const handleSend = () => {
    if (input.trim() === "") return;
    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    setInput("");
    setShowFaqs(false);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Thanks for your message! We'll reply soon." },
      ]);
      setTimeout(() => {
        setShowFaqs(true);
      }, 500);
    }, 1000);
  };

  // Close chatbox when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        chatbotRef.current &&
        !chatbotRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div
        className="chatbot-container"
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <img
          src={floatingIcon}
          alt="Chatbot Icon"
          className={`bot-icon ${hovered && !isOpen ? "shake" : ""}`}
        />
        {hovered && !isOpen && (
          <div className="chatbot-tooltip">Hi! How can I help you?</div>
        )}
      </div>

      {isOpen && (
        <div className="chatbot-window" ref={chatbotRef}>
          <div className="chatbot-header">
            <div className="chatbot-header-left">
              <div className="chatbot-header-title">
                <div className="chatbot-logo-wrapper">
                  <img
                    src={headerLogo}
                    alt="H.E.A.R. Logo"
                    className="chatbot-logo"
                  />
                </div>
                <div className="assistant-text">
                  <div className="assistant-name-small">Elva</div>
                  <div className="assistant-subtitle-small">
                    Your Hearing Assistant
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`message-row ${msg.sender === "user" ? "user" : "bot"
                  }`}
              >
                {msg.sender === "bot" && (
                  <>
                    <img src={headerLogo} alt="Bot" className="avatar" />
                    <div className="message bot">{msg.text}</div>
                  </>
                )}
                {msg.sender === "user" && (
                  <>
                    <div className="message user">{msg.text}</div>
                    <img
                      src={userIcon}
                      alt="User"
                      className="avatar user-avatar"
                    />
                  </>
                )}
              </div>
            ))}

            {/* FAQ Questions */}
            {showFaqs && (
              <div className="faq-container">
                <div className="faq-label">Frequently Asked Questions:</div>
                <div className="faq-chips">
                  {faqData.map((faq, index) => (
                    <button
                      key={index}
                      className="faq-chip"
                      onClick={() => handleFaqClick(faq)}
                    >
                      {faq.question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-input-area">
            <input
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button onClick={handleSend}>Send</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
