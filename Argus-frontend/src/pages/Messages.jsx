import { useState, useEffect, useRef } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { Send } from "lucide-react";
import { useLocation } from "react-router-dom";

const formatTime = (iso) => new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const Messages = () => {
  const { user } = useAuth();
  const location = useLocation();
  
useEffect(() => {
  if (location.state?.prefill) setText(location.state.prefill);
}, [location.state]);

  const isFleetManager = user?.role === "FLEET_MANAGER";
  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);

  const fetchContacts = () => {
    api.get("messages/contacts/").then(({ data }) => {
      setContacts(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchContacts();
    const interval = setInterval(fetchContacts, 8000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isFleetManager && contacts.length > 0 && !activeContact) {
      setActiveContact(contacts[0]);
    }
  }, [contacts, isFleetManager]);

  useEffect(() => {
    if (!activeContact) return;
    const fetchMessages = () => {
      api.get(`messages/?with=${activeContact.id}`).then(({ data }) => setMessages(data));
    };
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [activeContact]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || !activeContact) return;
    try {
      await api.post("messages/", { recipient: activeContact.id, content: text });
      setText("");
      const { data } = await api.get(`messages/?with=${activeContact.id}`);
      setMessages(data);
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  if (loading) return <div className="table-empty">Loading...</div>;

  return (
    <div className="messages-shell">
      {isFleetManager && (
        <div className="messages-contacts">
          {contacts.length === 0 ? (
            <div className="table-empty">No team members yet.</div>
          ) : (
            contacts.map((c) => (
              <div key={c.id} className={`contact-row${activeContact?.id === c.id ? " active" : ""}`} onClick={() => setActiveContact(c)}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>{c.name}</div>
                  {c.unread_count > 0 && <span className="contact-badge">{c.unread_count}</span>}
                </div>
                <div style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>{c.role}</div>
              </div>
            ))
          )}
        </div>
      )}

      <div className="messages-conversation">
        {!activeContact ? (
          <div className="table-empty">{isFleetManager ? "Select a team member to message." : "No fleet manager found."}</div>
        ) : (
          <>
            <div className="conversation-header">{activeContact.name}</div>
            <div className="conversation-body">
              {messages.map((m) => {
                const isOwn = m.sender === user.id;
                return (
                  <div key={m.id} className={`message-bubble${isOwn ? " own" : ""}`}>
                    <div>{m.content}</div>
                    <div className="message-meta">
                      {formatTime(m.created_at)}
                      {isOwn && <span> · {m.is_read ? "Seen" : "Delivered"}</span>}
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>
            <form className="conversation-input" onSubmit={handleSend}>
              <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message..." />
              <button type="submit"><Send size={16} /></button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Messages;