import React from "react";

function getStatusIcon(status) {
  switch (status) {
    case "read":
      return <img src="/icons/double-check-blue.png" alt="Read" className="status-icon" />;
    case "delivered":
      return <img src="/icons/double-check.png" alt="Delivered" className="status-icon" />;
    case "sent":
      return <img src="/icons/check.png" alt="Sent" className="status-icon" />;
    case "sending":
      return <img src="/icons/tick.png" alt="Sending" className="status-icon" />;
    case "failed":
      return (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="red" className="status-icon">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path>
        </svg>
      );
    default:
      return null;
  }
}

// Helper to format timestamp similar to WhatsApp Web
const formatTimestamp = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp * 1000);
  const now = new Date();
  
  // Reset time to start of day for accurate day comparison
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  const diffTime = today - messageDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    // Today - show time in 12-hour format
    return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true });
  } else if (diffDays === 1) {
    // Yesterday
    return "Yesterday " + date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true });
  } else {
    // Older - show full date and time
    return date.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' }) + " " + 
           date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true });
  }
};

export default function MessageBubble({ message }) {
  const isOwn = message.direction === "out" || message.sender === "me";
  
  // Determine status based on message properties
  const getStatus = () => {
    if (message.status) return message.status;
    if (message.read) return "read";
    if (message.delivered) return "delivered";
    if (message.sent) return "sent";
    return "pending";
  };

  const status = getStatus();

  return (
    <div className={`message-bubble ${isOwn ? "own" : "received"}`}>
      <div className="message-content">
        {message.text}
      </div>
      <div className="message-info">
        <span className="message-time">{formatTimestamp(message.timestamp)}</span>
        {isOwn && getStatusIcon(status)}
      </div>
    </div>
  );
}
