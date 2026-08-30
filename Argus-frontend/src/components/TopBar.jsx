import { useNavigate } from "react-router-dom";
import { Bell, MessageSquare } from "lucide-react";
import useUnresolvedAlerts from "../hooks/useUnresolvedAlerts";
import { useAuth } from "../context/AuthContext";
import { getHomeRouteForRole } from "../utils/roleRoutes";
import useUnreadMessages from "../hooks/useUnreadMessages";


const TopBar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const alertCount = useUnresolvedAlerts();
  const messageCount = useUnreadMessages();

  return (
    <div className="topbar">
      <button className="topbar-icon" title="Messages (coming soon)" disabled>
        <MessageSquare size={18} />
      </button>
      <button className="topbar-icon" onClick={() => navigate(`${getHomeRouteForRole(user?.role)}/messages`)} title="Messages">
       <MessageSquare size={18} />
       {messageCount > 0 && <span className="topbar-badge">{messageCount > 9 ? "9+" : messageCount}</span>}
       </button>
    </div>
  );
};

export default TopBar;