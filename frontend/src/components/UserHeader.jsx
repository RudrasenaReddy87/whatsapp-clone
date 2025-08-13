import React, { useState } from "react";

export default function UserHeader({ user, typingStatus, onBack }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="user-header">
      <div className="user-info">
        <button className="back-button" aria-label="Back" onClick={() => onBack && onBack()}>
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#111b21" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <img src={user?.avatar || "/images/profile_def.jpg"} alt={user?.name} className="user-avatar" />
        <div className="user-details">
          <div className="user-name">{user?.name || user?.profile?.name}</div>
          <div className="user-number">{user?.wa_id || user?.phone || user?.id || "No number"}</div>
          <div className="user-status">{typingStatus ? "Typing..." : user?.status || "Online"}</div>
        </div>
      </div>
      <div className="user-actions">
        <button aria-label="Voice call" className="icon-button" title="Call">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#111b21" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
          </svg>
        </button>
        <button aria-label="Video call" className="icon-button" title="Video Call">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#111b21" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="23 7 16 12 23 17 23 7"></polygon>
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
          </svg>
        </button>
        <button aria-label="Search" className="icon-button">
          <img src="/icons/search.svg" alt="Search" />
        </button>
        <div className="dropdown">
          <button aria-label="Menu" className="icon-button" onClick={() => setMenuOpen(!menuOpen)}>
            <img src="/icons/menu.svg" alt="Menu" />
          </button>
          {menuOpen && (
            <div className="dropdown-content">
              <a href="#">Contact info</a>
              <a href="#">Select messages</a>
              <a href="#">Close chat</a>
              <a href="#">Mute notifications</a>
              <a href="#">Disappearing messages</a>
              <a href="#">Clear chat</a>
              <a href="#">Delete chat</a>
              <a href="#">Report</a>
              <a href="#">Block</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
