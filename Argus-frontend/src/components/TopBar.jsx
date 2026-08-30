// src/components/TopBar.jsx — full replace
import { useNavigate } from "react-router-dom";
import { Bell, MessageSquare } from "lucide-react";
import useUnresolvedAlerts from "../hooks/useUnresolvedAlerts";
import useUnreadMessages from "../hooks/useUnreadMessages";
import { useAuth } from "../context/AuthContext";
import { getHomeRouteForRole } from "../utils/roleRoutes";

const TopBar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const alertCount = useUnresolvedAlerts();
  const messageCount = useUnreadMessages();

  return (
    <div className="topbar">
      <button className="topbar-icon" onClick={() => navigate(`${getHomeRouteForRole(user?.role)}/messages`)} title="Messages">
        <MessageSquare size={18} />
        {messageCount > 0 && <span className="topbar-badge">{messageCount > 9 ? "9+" : messageCount}</span>}
      </button>
      <button className="topbar-icon" onClick={() => navigate(`${getHomeRouteForRole(user?.role)}/alerts`)} title="Alerts">
        <Bell size={18} />
        {alertCount > 0 && <span className="topbar-badge">{alertCount > 9 ? "9+" : alertCount}</span>}
      </button>
    </div>
  );
};

export default TopBar;