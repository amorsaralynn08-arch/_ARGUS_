import { useState, useEffect } from "react";
import api from "../api/axios";

const useUnresolvedAlerts = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const { data } = await api.get("alerts/?is_resolved=false");
        const list = Array.isArray(data) ? data : data.results || [];
        setCount(list.length);
      } catch (err) {
        console.error("Failed to load alert count:", err);
      }
    };
    fetchCount();
    const interval = setInterval(fetchCount, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  return count;
};

export default useUnresolvedAlerts;