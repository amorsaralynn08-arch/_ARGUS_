import { Eye } from "lucide-react";
import ScatteredEyes from "./ScatteredEyes";

const AuthLayout = ({ formTitle, children }) => (
  <div className="auth-page">
    <ScatteredEyes />
    <div className="auth-content">
      <div className="auth-header">
        <Eye size={26} className="auth-logo" aria-hidden="true" />
        <div className="brand-name">ARGUS</div>
        <div className="brand-tagline">See it before it breaks.</div>
      </div>

      <div className="auth-form-title">{formTitle}</div>

      {children}
    </div>
  </div>
);

export default AuthLayout;