import { useState, useEffect } from "react";
import api from "../api/axios";

const useUnreadMessages = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchCount = () => {
      api.get("messages/unread-count/").then(({ data }) => setCount(data.count)).catch(() => {});
    };
    fetchCount();
    const interval = setInterval(fetchCount, 15000);
    return () => clearInterval(interval);
  }, []);

  return count;
};

export default useUnreadMessages;