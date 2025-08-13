

import React, { useEffect, useState } from "react";
import ChatList from "./components/ChatList";
import ChatWindow from "./components/ChatWindow";
import "./App.css";

function App() {
  const [conversations, setConversations] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [errorChats, setErrorChats] = useState(null);
  const [errorMessages, setErrorMessages] = useState(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 900);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const backendUrl = process.env.REACT_APP_BACKEND_URL || "";

  useEffect(() => {
    setLoadingChats(true);
    setErrorChats(null);
    fetch(`${backendUrl}/webhook/conversations`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch chats");
        return await res.json();
      })
      .then((data) => {
        const uniqueConversations = Array.from(new Map(data.map(conv => [conv._id, conv])).values());
        setConversations(uniqueConversations);
      })
      .catch((err) => {
        setErrorChats(err.message);
        setConversations([]);
      })
      .finally(() => setLoadingChats(false));
  }, []);

  useEffect(() => {
    if (selectedId) {
      setLoadingMessages(true);
      setErrorMessages(null);
      fetch(`${backendUrl}/webhook/messages/${selectedId}`)
        .then(async (res) => {
          if (!res.ok) throw new Error("Failed to fetch messages");
          return await res.json();
        })
        .then((data) => setMessages(Array.isArray(data) ? data : []))
        .catch((err) => {
          setErrorMessages(err.message);
          setMessages([]);
        })
        .finally(() => setLoadingMessages(false));
      const user = conversations.find((c) => c._id === selectedId);
      if (user) {
        setSelectedUser({
          ...user,
          name: user.name || user.profile?.name || "Unknown",
          wa_id: user.wa_id || user.number || "No number",
        });
      } else {
        setSelectedUser(null);
      }
    }
  }, [selectedId, conversations]);

  // Message sending handler for ChatWindow
  const handleSendMessage = async (newMessage) => {
    setMessages((prev) => [...prev, newMessage]);

    try {
      const response = await fetch(`${backendUrl}/webhook/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMessage),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const savedMessage = await response.json();

      // Update message status to 'sent' on successful send
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMessage.id ? { ...msg, status: savedMessage.status } : msg
        )
      );
    } catch (error) {
      console.error("Fetch error:", error.message);
      // Update message status to 'failed'
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMessage.id ? { ...msg, status: "failed" } : msg
        )
      );
    }
  };

  const handleBack = () => setSelectedId(null);

  return (
    <main id="main">
      <aside id="sidebar" style={{ display: isMobile && selectedId ? "none" : "flex" }}>
        {loadingChats ? (
          <div style={{ padding: 24, color: '#8696a0' }}>Loading chats...</div>
        ) : errorChats ? (
          <div style={{ padding: 24, color: 'red' }}>Error: {errorChats}</div>
        ) : (
          <ChatList
            conversations={conversations}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        )}
      </aside>
      <section id="chat-window" style={{ display: isMobile && !selectedId ? "none" : "flex" }}>
        {selectedUser ? (
          <ChatWindow
            messages={messages}
            user={selectedUser}
            onSendMessage={handleSendMessage}
            onBack={handleBack}
          />
        ) : (
          <div style={{ padding: 24, color: '#8696a0' }}>Select a chat to start messaging</div>
        )}
      </section>
    </main>
  );
}

export default App;