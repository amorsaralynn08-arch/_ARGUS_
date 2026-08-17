import { Eye } from "lucide-react";

const eyePositions = [
  { top: "4%", left: "6%", size: 15, opacity: 0.09, rotate: -8 },
  { top: "5%", right: "8%", size: 12, opacity: 0.08, rotate: 10 },
  { top: "16%", left: "32%", size: 10, opacity: 0.06, rotate: 4 },
  { top: "22%", right: "30%", size: 11, opacity: 0.07, rotate: -6 },
  { top: "30%", left: "3%", size: 13, opacity: 0.08, rotate: 7 },
  { top: "34%", right: "5%", size: 14, opacity: 0.08, rotate: -5 },
  { top: "47%", left: "10%", size: 11, opacity: 0.06, rotate: 9 },
  { top: "52%", right: "12%", size: 12, opacity: 0.07, rotate: -8 },
  { top: "64%", left: "4%", size: 14, opacity: 0.08, rotate: 5 },
  { top: "68%", right: "6%", size: 11, opacity: 0.06, rotate: -4 },
  { bottom: "12%", left: "12%", size: 13, opacity: 0.07, rotate: 8 },
  { bottom: "7%", right: "16%", size: 15, opacity: 0.08, rotate: -6 },
  { bottom: "3%", left: "40%", size: 10, opacity: 0.06, rotate: 4 },
];

const ScatteredEyes = () => (
  <div className="scattered-eyes" aria-hidden="true">
    {eyePositions.map((pos, i) => (
      <Eye
        key={i}
        size={pos.size}
        style={{
          position: "absolute",
          top: pos.top,
          bottom: pos.bottom,
          left: pos.left,
          right: pos.right,
          color: "var(--color-primary)",
          opacity: pos.opacity,
          transform: `rotate(${pos.rotate}deg)`,
        }}
      />
    ))}
  </div>
);

export default ScatteredEyes;