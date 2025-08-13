import React, { useState, useEffect, useRef } from "react";
import UserHeader from "./UserHeader";
import MessageBubble from "./MessageBubble";

export default function ChatWindow({ messages, user, onSendMessage, typingStatus, onBack }) {
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageText.trim() === "") return;

    const newMessage = {
      id: `msg_${Date.now()}`,
      wa_id: user.wa_id,
      text: messageText.trim(),
      timestamp: Math.floor(Date.now() / 1000),
      status: "sending",
      direction: "out",
    };

    onSendMessage(newMessage);
    setMessageText("");
  };

  useEffect(() => {
    console.log("Selected User Data:", user);
  }, [user]);

  return (
    <div className="chat-window">
      <UserHeader user={user} typingStatus={typingStatus} onBack={onBack} />
      <div className="chat-messages">
        {messages.length === 0 && <div style={{ textAlign: 'center', color: '#8696a0', marginTop: 20 }}>No messages yet</div>}
        {messages.reduce((acc, msg, index) => {
          const prevMsg = index > 0 ? messages[index - 1] : null;
          const prevDate = prevMsg ? new Date(prevMsg.timestamp * 1000).toDateString() : null;
          const currDate = new Date(msg.timestamp * 1000).toDateString();

          if (index === 0 || currDate !== prevDate) {
            acc.push(
              <div key={`date-${msg.timestamp}`} className="date-separator" aria-label={`Date separator: ${currDate}`}>
                <span>{currDate}</span>
              </div>
            );
          }
          acc.push(<MessageBubble key={msg.id} message={msg} />);
          return acc;
        }, [])}
        <div ref={messagesEndRef} />
      </div>
      <form className="chat-input-form" onSubmit={handleSendMessage}>
        <button type="button" className="icon-button emoji-button" title="Emoji">
          <img src="/icons/emoji.svg" alt="Emoji" />
        </button>
        <input
          type="text"
          placeholder="Type a message"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          className="chat-input"
          aria-label="Type a message"
        />
        <button type="button" className="icon-button attachment-button" title="Attach">
          <img src="/icons/attachment.svg" alt="Attachment" />
        </button>
        <button type="submit" className="icon-button send-button" title="Send" aria-label="Send">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
        <button type="button" className="icon-button mic-button" title="Record voice message">
          <img src="/icons/mic.svg" alt="Mic" />
        </button>
      </form>
    </div>
  );
}
