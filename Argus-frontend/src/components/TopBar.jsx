import { useNavigate } from "react-router-dom";
import { Bell, MessageSquare } from "lucide-react";
import useUnresolvedAlerts from "../hooks/useUnresolvedAlerts";

const TopBar = () => {
  const navigate = useNavigate();
  const alertCount = useUnresolvedAlerts();

  return (
    <div className="topbar">
      <button className="topbar-icon" title="Messages (coming soon)" disabled>
        <MessageSquare size={18} />
      </button>
      <button className="topbar-icon" onClick={() => navigate("/dashboard/alerts")} title="Alerts">
        <Bell size={18} />
        {alertCount > 0 && <span className="topbar-badge">{alertCount > 9 ? "9+" : alertCount}</span>}
      </button>
    </div>
  );
};

export default TopBar;