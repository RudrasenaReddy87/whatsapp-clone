import React, { useState, useMemo } from "react";

export default function ChatList({ conversations, selectedId, onSelect }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredConversations = useMemo(() => {
    if (!searchTerm.trim()) return conversations;

    const term = searchTerm.toLowerCase();
    return conversations.filter(conv =>
      conv.name?.toLowerCase().includes(term) ||
      conv.lastMessage?.toLowerCase().includes(term)
    );
  }, [conversations, searchTerm]);

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
      // Today - show time
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } else if (diffDays === 1) {
      // Yesterday
      return "Yesterday";
    } else if (diffDays < 7) {
      // Within the last week - show day name
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      // Older - show date
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <>
      <header
        id="sidebar-header"
        style={{
          display: "flex",
          alignItems: "center",
          padding: "10px 15px",
          gap: 10,
        }}
      >
        <img
          src="/images/profile_def.jpg"
          alt="Profile"
          className="avatar"
          id="profile-image"
          style={{ width: 32, height: 32 }}
        />
        <div
          style={{
            fontWeight: "bold",
            fontSize: 20,
            color: "#25D366",
            userSelect: "none",
          }}
        >
          WhatsApp
        </div>
        <div
          className="toolbar"
          style={{ marginLeft: "auto", display: "flex", gap: 10 }}
        >
          <img
            src="/icons/communities.svg"
            alt="Communities"
            title="Communities"
            className="icon"
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              padding: 4,
              cursor: "pointer",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#202c33")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          />
          <img
            src="/icons/status.svg"
            alt="Status"
            title="Status"
            className="icon"
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              padding: 4,
              cursor: "pointer",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#202c33")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          />
          <img
            src="/icons/new-chat.svg"
            alt="New chat"
            title="New chat"
            className="icon"
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              padding: 4,
              cursor: "pointer",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#202c33")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          />
          <div className="dropdown">
            <img
              src="/icons/menu.svg"
              alt="Menu"
              title="Menu"
              className="icon dropdown-button"
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                padding: 4,
                cursor: "pointer",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#202c33")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            />
            <div className="dropdown-content">
              <a href="#">New group</a>
              <a href="#">New community</a>
              <a href="#">Archived</a>
              <a href="#">Starred messages</a>
              <a href="#">Select chats</a>
              <a href="#">Settings</a>
              <a href="#">Log out</a>
            </div>
          </div>
        </div>
      </header>
      <form
        id="search-toolbar"
        style={{
          position: "relative",
          borderRadius: 20,
          overflow: "hidden",
          backgroundColor: "#f6f6f6",
          maxWidth: "calc(100% - 40px)",
          margin: "10px 20px 0 20px",
        }}
      >
        <input
          type="search"
          id="search-input"
          placeholder="Search or start a new chat"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search or start a new chat"
          style={{
            border: "none",
            outline: "none",
            padding: "10px 40px 10px 40px",
            width: "100%",
            borderRadius: 20,
            backgroundColor: "#f6f6f6",
            fontSize: 16,
            color: "#111b21",
          }}
        />
        <img
          src="/icons/search.svg"
          alt="Search"
          className="icon"
          style={{
            width: 36,
            height: 36,
            position: "absolute",
            left: 10,
            top: "50%",
            transform: "translateY(-50%)",
            cursor: "default",
          }}
        />
        <img
          src="/icons/filter.svg"
          alt="Filter"
          className="icon"
          style={{
            width: 36,
            height: 36,
            position: "absolute",
            right: 10,
            top: "50%",
            transform: "translateY(-50%)",
            cursor: "pointer",
          }}
        />
      </form>
      {!navigator.onLine && (
        <div className="connectivity-notification">
          <img
            src="/icons/warning.svg"
            alt="Offline warning"
            style={{ width: 32, height: 32 }}
          />
          <div>
            <div className="connectivity-notification-title">
              Computer not connected
            </div>
            <span>Make sure your computer has an active Internet connection</span>
          </div>
        </div>
      )}
      <section id="sidebar-contents">
        <div
          id="chats-list"
          style={{ display: "flex", flexDirection: "column", flexGrow: 1, paddingTop: '8px', paddingBottom: '8px' }}
        >
          {filteredConversations.map((conv) => {
            const unreadCount = conv.unread || 0;
            return (
              <div
                key={conv._id}
                className={`chat-tile${selectedId === conv._id ? " active" : ""}`}
                onClick={() => onSelect(conv._id)}
              >
                <img
                  src="/images/profile_def.jpg"
                  alt="Profile"
                  className="chat-tile-avatar"
                />
                <div className="chat-tile-details">
                  <div className="chat-tile-title">
                    <span>{conv.name || "Unknown"}</span>
                    <span>{formatTimestamp(conv.lastTimestamp)}</span>
                  </div>
                  <div className="chat-tile-subtitle">
                    <span>{conv.lastMessage}</span>
                    {unreadCount > 0 && (
                      <span className="unread-badge">{unreadCount}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          <div style={{ flexGrow: 1 }}></div>
        </div>
      </section>
    </>
  );
}
