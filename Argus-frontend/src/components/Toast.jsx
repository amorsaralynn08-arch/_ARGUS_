import { useEffect } from "react";
import { CheckCircle } from "lucide-react";

const Toast = ({ message, onDone }) => {
  useEffect(() => {
    const timer = setTimeout(onDone, 3500);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="toast">
      <CheckCircle size={15} aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
};

export default Toast;