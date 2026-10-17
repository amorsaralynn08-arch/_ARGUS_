import { useNavigate, useLocation } from "react-router-dom";
import { Bell, MessageSquare } from "lucide-react";
import useUnresolvedAlerts from "../hooks/useUnresolvedAlerts";
import useUnreadMessages from "../hooks/useUnreadMessages";
import { useAuth } from "../context/AuthContext";
import { getHomeRouteForRole } from "../utils/roleRoutes";

const TopBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const alertCount = useUnresolvedAlerts();
  const messageCount = useUnreadMessages();

  const homeRoute = getHomeRouteForRole(user?.role);
  const onMessagesPage = location.pathname.endsWith("/messages");

  const toggleMessages = () => {
    if (onMessagesPage) {
      navigate(location.state?.from || homeRoute);
    } else {
      navigate(`${homeRoute}/messages`, { state: { from: location.pathname } });
    }
  };

  return (
    <div className="topbar">
      <button
        className="topbar-icon"
        onClick={toggleMessages}
        title={onMessagesPage ? "Close messages" : "Messages"}
        style={onMessagesPage ? { color: "var(--color-primary)", borderColor: "var(--color-primary)" } : undefined}
      >
        <MessageSquare size={18} />
        {messageCount > 0 && <span className="topbar-badge">{messageCount > 9 ? "9+" : messageCount}</span>}
      </button>
      <button className="topbar-icon" onClick={() => navigate(`${homeRoute}/alerts`)} title="Alerts">
        <Bell size={18} />
        {alertCount > 0 && <span className="topbar-badge">{alertCount > 9 ? "9+" : alertCount}</span>}
      </button>
    </div>
  );
};

export default TopBar;